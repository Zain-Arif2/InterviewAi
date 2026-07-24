import connectDB from '@/lib/db';
import User from '@/models/User';
import { getAIProvider } from '@/lib/ai/ai-provider.factory';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const MAX_RESUME_TEXT_CHARS = 8000; // keep prompt size sane for long resumes

/**
 * Extracts raw text from an uploaded PDF resume.
 */
async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

/**
 * Uses the AI provider to turn raw resume text into a structured summary
 * (skills, years of experience, one-paragraph summary).
 */
async function extractResumeSummary(resumeText) {
  const truncated = resumeText.slice(0, MAX_RESUME_TEXT_CHARS);

  const prompt = `Extract structured information from this resume text. Respond ONLY with a JSON object in this exact shape, no markdown, no extra text:
{
  "skills": ["skill1", "skill2", ...up to 12 most relevant technical/professional skills],
  "yearsOfExperience": <best-estimate integer, or null if unclear>,
  "experienceSummary": "2-3 sentence summary of their background, roles, and seniority"
}

Resume text:
${truncated}`;

  const ai = getAIProvider();
  const raw = await ai.chat([{ role: 'system', content: prompt }], { jsonMode: true, temperature: 0.2 });

  try {
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return { skills: [], yearsOfExperience: null, experienceSummary: '' };
  }
}

/**
 * Full pipeline: PDF buffer -> extracted text -> AI-structured summary -> saved on User.
 */
export async function processResumeUpload(userId, fileBuffer, fileName) {
  await connectDB();

  const resumeText = await extractTextFromPDF(fileBuffer);

  if (!resumeText || resumeText.trim().length < 50) {
    return { success: false, error: 'Could not read enough text from this PDF. Please upload a text-based resume (not a scanned image).' };
  }

  const summary = await extractResumeSummary(resumeText);

  const user = await User.findByIdAndUpdate(
    userId,
    {
      resumeSummary: {
        skills: summary.skills || [],
        experienceSummary: summary.experienceSummary || '',
        yearsOfExperience: summary.yearsOfExperience ?? null,
        fileName,
        updatedAt: new Date(),
      },
    },
    { new: true }
  );

  return { success: true, data: user.resumeSummary };
}

export async function getResumeSummary(userId) {
  await connectDB();
  const user = await User.findById(userId).select('resumeSummary');
  return { success: true, data: user?.resumeSummary || null };
}

export async function clearResumeSummary(userId) {
  await connectDB();
  await User.findByIdAndUpdate(userId, {
    resumeSummary: { skills: [], experienceSummary: '', yearsOfExperience: null, fileName: '', updatedAt: null },
  });
  return { success: true };
}