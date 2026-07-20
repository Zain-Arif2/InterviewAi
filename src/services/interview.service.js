import connectDB from '@/lib/db';
import Interview from '@/models/Interview';
import { getAIProvider } from '@/lib/ai/ai-provider.factory';
import { QUESTIONS_PER_INTERVIEW } from '@/lib/constants';

const TYPE_LABELS = { hr: 'HR', technical: 'Technical', behavioral: 'Behavioral' };

function buildSystemPrompt({ jobRole, experienceLevel, type, memoryContext }) {
  return `You are an experienced, friendly but professional interviewer conducting a ${TYPE_LABELS[type]} interview for a ${experienceLevel}-level ${jobRole} position.

Rules:
- Ask exactly ONE question at a time. Never ask multiple questions in one message.
- Keep questions natural and conversational, like a real interviewer — not robotic.
- Build on the candidate's previous answers where relevant (follow-up questions are encouraged).
- Do not repeat questions you've already asked.
- Do not reveal scores or feedback during the conversation — that happens at the end.
- Keep each message concise (2-4 sentences max), plain text, no markdown headers.
${memoryContext ? `\nContext from the candidate's last interview:\n${memoryContext}\nStart today's interview by briefly checking whether they've improved on their weak areas, then proceed with your first question.` : ''}`;
}

async function getMemoryContext(userId) {
  const lastInterview = await Interview.findOne({
    user: userId,
    status: 'completed',
  }).sort({ completedAt: -1 });

  if (!lastInterview) return null;

  const weak = lastInterview.weakSkills?.join(', ') || 'none noted';
  const strong = lastInterview.strongSkills?.join(', ') || 'none noted';

  return `Last interview (${TYPE_LABELS[lastInterview.type]}, overall score ${lastInterview.overallScore ?? 'N/A'}/100): struggled with ${weak}. Strong areas: ${strong}. Summary: ${lastInterview.summary || 'N/A'}`;
}

export async function createInterview(userId, { jobRole, experienceLevel, type }) {
  await connectDB();

  const memoryContext = await getMemoryContext(userId);
  const systemPrompt = buildSystemPrompt({ jobRole, experienceLevel, type, memoryContext });

  const ai = getAIProvider();
  const firstQuestion = await ai.chat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: 'Begin the interview with your first question.' },
  ]);

  const interview = await Interview.create({
    user: userId,
    jobRole,
    experienceLevel,
    type,
    status: 'in_progress',
    messages: [{ role: 'ai', content: firstQuestion.trim() }],
    questionCount: 1,
  });

  return { success: true, data: serializeInterview(interview) };
}

export async function submitAnswer(interviewId, userId, answerText) {
  await connectDB();

  const interview = await Interview.findOne({ _id: interviewId, user: userId });
  if (!interview) return { success: false, error: 'Interview not found' };
  if (interview.status === 'completed') return { success: false, error: 'This interview has already ended' };

  interview.messages.push({ role: 'user', content: answerText });

  if (interview.questionCount >= QUESTIONS_PER_INTERVIEW) {
    await generateReport(interview);
    await interview.save();
    return { success: true, data: serializeInterview(interview), completed: true };
  }

  const systemPrompt = buildSystemPrompt({
    jobRole: interview.jobRole,
    experienceLevel: interview.experienceLevel,
    type: interview.type,
    memoryContext: null,
  });

  const conversation = [
    { role: 'system', content: systemPrompt },
    ...interview.messages.map((m) => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    })),
  ];

  const ai = getAIProvider();
  const nextQuestion = await ai.chat(conversation);

  interview.messages.push({ role: 'ai', content: nextQuestion.trim() });
  interview.questionCount += 1;
  await interview.save();

  return { success: true, data: serializeInterview(interview), completed: false };
}

async function generateReport(interview) {
  const transcript = interview.messages
    .map((m) => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
    .join('\n\n');

  const reportPrompt = `You are grading a completed ${TYPE_LABELS[interview.type]} interview for a ${interview.experienceLevel}-level ${interview.jobRole} position.

Transcript:
${transcript}

Respond ONLY with a JSON object in this exact shape, no markdown, no extra text:
{
  "overallScore": <0-100 integer>,
  "technicalScore": <0-100 integer>,
  "communicationScore": <0-100 integer>,
  "strongSkills": ["skill1", "skill2"],
  "weakSkills": ["skill1", "skill2"],
  "betterAnswers": ["A stronger sample answer for one of the weaker responses"],
  "improvementTips": ["tip1", "tip2", "tip3"],
  "summary": "2-3 sentence overall summary of the candidate's performance"
}`;

  const ai = getAIProvider();
  const raw = await ai.chat([{ role: 'system', content: reportPrompt }], { jsonMode: true, temperature: 0.3 });

  const report = parseJSONSafely(raw);

  interview.overallScore = report?.overallScore ?? 0;
  interview.technicalScore = report?.technicalScore ?? 0;
  interview.communicationScore = report?.communicationScore ?? 0;
  interview.strongSkills = report?.strongSkills ?? [];
  interview.weakSkills = report?.weakSkills ?? [];
  interview.betterAnswers = report?.betterAnswers ?? [];
  interview.improvementTips = report?.improvementTips ?? [];
  interview.summary = report?.summary ?? '';
  interview.status = 'completed';
  interview.completedAt = new Date();
}

function parseJSONSafely(raw) {
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function getInterviewById(interviewId, userId) {
  await connectDB();
  const interview = await Interview.findOne({ _id: interviewId, user: userId });
  if (!interview) return { success: false, error: 'Interview not found' };
  return { success: true, data: serializeInterview(interview) };
}

export async function getUserInterviews(userId, { search = '', type = '', page = 1, limit = 10 } = {}) {
  await connectDB();

  const query = { user: userId };
  if (type) query.type = type;
  if (search) query.jobRole = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;

  const [interviews, total] = await Promise.all([
    Interview.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Interview.countDocuments(query),
  ]);

  return {
    success: true,
    data: {
      interviews: interviews.map(serializeInterview),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getUserStats(userId) {
  await connectDB();

  const [totalInterviews, completedInterviews, recentInterviews] = await Promise.all([
    Interview.countDocuments({ user: userId }),
    Interview.find({ user: userId, status: 'completed' }).sort({ completedAt: -1 }),
    Interview.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
  ]);

  const averageScore = completedInterviews.length
    ? Math.round(completedInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / completedInterviews.length)
    : null;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const interviewsThisMonth = await Interview.countDocuments({ user: userId, createdAt: { $gte: startOfMonth } });

  const recentCompleted = completedInterviews.slice(0, 5);
  const weakSkills = [...new Set(recentCompleted.flatMap((i) => i.weakSkills || []))].slice(0, 6);
  const strongSkills = [...new Set(recentCompleted.flatMap((i) => i.strongSkills || []))].slice(0, 6);

  return {
    success: true,
    data: {
      totalInterviews,
      averageScore,
      interviewsThisMonth,
      weakSkills,
      strongSkills,
      recentInterviews: recentInterviews.map(serializeInterview),
    },
  };
}
export async function getAnalyticsData(userId) {
  await connectDB();

  const completed = await Interview.find({ user: userId, status: 'completed' }).sort({ completedAt: 1 });

  const totalInterviews = completed.length;
  const averageScore = totalInterviews
    ? Math.round(completed.reduce((sum, i) => sum + (i.overallScore || 0), 0) / totalInterviews)
    : null;
  const averageTechnical = totalInterviews
    ? Math.round(completed.reduce((sum, i) => sum + (i.technicalScore || 0), 0) / totalInterviews)
    : null;
  const averageCommunication = totalInterviews
    ? Math.round(completed.reduce((sum, i) => sum + (i.communicationScore || 0), 0) / totalInterviews)
    : null;

  const progress = completed.map((i, idx) => ({
    label: `#${idx + 1}`,
    date: i.completedAt,
    overallScore: i.overallScore ?? 0,
    technicalScore: i.technicalScore ?? 0,
    communicationScore: i.communicationScore ?? 0,
  }));

  const technicalImprovement = totalInterviews >= 2
    ? (completed[totalInterviews - 1].technicalScore ?? 0) - (completed[0].technicalScore ?? 0)
    : 0;
  const communicationImprovement = totalInterviews >= 2
    ? (completed[totalInterviews - 1].communicationScore ?? 0) - (completed[0].communicationScore ?? 0)
    : 0;

  return {
    success: true,
    data: {
      totalInterviews,
      averageScore,
      averageTechnical,
      averageCommunication,
      technicalImprovement,
      communicationImprovement,
      progress,
    },
  };
}
function serializeInterview(interview) {
  return {
    id: interview._id.toString(),
    jobRole: interview.jobRole,
    experienceLevel: interview.experienceLevel,
    type: interview.type,
    status: interview.status,
    messages: interview.messages.map((m) => ({ role: m.role, content: m.content, createdAt: m.createdAt })),
    questionCount: interview.questionCount,
    overallScore: interview.overallScore,
    technicalScore: interview.technicalScore,
    communicationScore: interview.communicationScore,
    strongSkills: interview.strongSkills,
    weakSkills: interview.weakSkills,
    betterAnswers: interview.betterAnswers,
    improvementTips: interview.improvementTips,
    summary: interview.summary,
    createdAt: interview.createdAt,
    completedAt: interview.completedAt,
  };
}