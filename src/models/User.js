import mongoose from 'mongoose';
import { DEFAULT_AVATAR } from '@/lib/constants';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    image: {
      type: String,
      default: DEFAULT_AVATAR,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    currentRole: {
      type: String,
      trim: true,
      default: '',
    },
    experienceLevel: {
      type: String,
      enum: ['', 'junior', 'mid', 'senior', 'lead'],
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    targetJobRole: {
      type: String,
      trim: true,
      default: '',
    },
    resumeSummary: {
      skills: { type: [String], default: [] },
      experienceSummary: { type: String, default: '' },
      yearsOfExperience: { type: Number, default: null },
      fileName: { type: String, default: '' },
      updatedAt: { type: Date, default: null },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free',
      },
      stripeCustomerId: {
        type: String,
        default: null,
      },
      stripeSubscriptionId: {
        type: String,
        default: null,
      },
      stripePriceId: {
        type: String,
        default: null,
      },
      stripeCurrentPeriodEnd: {
        type: Date,
        default: null,
      },
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    interviewCount: {
      type: Number,
      default: 0,
    },
    monthlyInterviewCount: {
      type: Number,
      default: 0,
    },
    monthlyInterviewReset: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'subscription.plan': 1 });

// Virtual for full avatar URL with initials fallback
userSchema.virtual('avatarUrl').get(function () {
  if (this.image && this.image !== DEFAULT_AVATAR) {
    return this.image;
  }
  const seed = encodeURIComponent(this.name || 'User');
  return `https://api.dicebear.com/8.x/initials/svg?seed=${seed}&backgroundColor=6366f1`;
});

// Ensure virtuals are included in JSON output
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;