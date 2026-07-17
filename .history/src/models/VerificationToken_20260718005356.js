import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
    },
    type: {
      type: String,
      enum: ['email-verification', 'password-reset'],
      required: [true, 'Token type is required'],
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  },
  {
    timestamps: true,
  }
);

// Auto-expire documents after expiresAt
verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for efficient lookups
verificationTokenSchema.index({ email: 1, type: 1 });

const VerificationToken =
  mongoose.models.VerificationToken ||
  mongoose.model('VerificationToken', verificationTokenSchema);

export default VerificationToken;