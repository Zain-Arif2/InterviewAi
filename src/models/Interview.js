import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['ai', 'user'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobRole: { type: String, required: true, trim: true },
    experienceLevel: {
      type: String,
      enum: ['junior', 'mid', 'senior', 'lead'],
      required: true,
    },
    type: {
      type: String,
      enum: ['hr', 'technical', 'behavioral'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
      index: true,
    },
    messages: { type: [messageSchema], default: [] },
    questionCount: { type: Number, default: 0 },
    overallScore: { type: Number, min: 0, max: 100 },
    technicalScore: { type: Number, min: 0, max: 100 },
    communicationScore: { type: Number, min: 0, max: 100 },
    strongSkills: { type: [String], default: [] },
    weakSkills: { type: [String], default: [] },
    betterAnswers: { type: [String], default: [] },
    improvementTips: { type: [String], default: [] },
    summary: { type: String, default: '' },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

interviewSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Interview || mongoose.model('Interview', interviewSchema);