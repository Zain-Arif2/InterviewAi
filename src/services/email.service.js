import { Resend } from 'resend';
import { APP_NAME, APP_URL } from '@/lib/constants';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const emailFrom = process.env.EMAIL_FROM || `${APP_NAME} <noreply@interviewai.com>`;

/**
 * Send a verification email with a 6-digit OTP.
 */
export async function sendVerificationEmail(email, otp, name = '') {
  const subject = `${APP_NAME} — Verify Your Email`;
  const html = buildEmailTemplate({
    title: 'Verify Your Email',
    greeting: name ? `Hi ${name},` : 'Hi there,',
    body: `
      <p>Welcome to ${APP_NAME}! Please verify your email address by entering the code below:</p>
      <div style="text-align: center; margin: 32px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 16px 32px; border-radius: 12px; font-family: 'SF Mono', Monaco, monospace;">
          ${otp}
        </div>
      </div>
      <p style="color: #6b7280; font-size: 14px;">This code expires in 15 minutes. If you didn't create an account, you can safely ignore this email.</p>
    `,
  });

  return sendEmail(email, subject, html);
}

/**
 * Send a password reset email with a 6-digit OTP.
 */
export async function sendPasswordResetEmail(email, otp) {
  const subject = `${APP_NAME} — Reset Your Password`;
  const html = buildEmailTemplate({
    title: 'Reset Your Password',
    greeting: 'Hi,',
    body: `
      <p>We received a request to reset your password. Enter the code below to proceed:</p>
      <div style="text-align: center; margin: 32px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 16px 32px; border-radius: 12px; font-family: 'SF Mono', Monaco, monospace;">
          ${otp}
        </div>
      </div>
      <p style="color: #6b7280; font-size: 14px;">This code expires in 15 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
    `,
  });

  return sendEmail(email, subject, html);
}

/**
 * Core email sending function.
 */
async function sendEmail(to, subject, html) {
  if (!resend) {
    console.log('📧 Email (dev mode — no Resend API key):');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    const otpMatch = html.match(/(\d{6})/);
    if (otpMatch) {
      console.log(`   OTP: ${otpMatch[1]}`);
    }
    return { success: true, data: { id: 'dev-mode' } };
  }

  try {
    const data = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Email send failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Build a professional HTML email template.
 */
function buildEmailTemplate({ title, greeting, body }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">${APP_NAME}</h1>
        </div>
        <!-- Body -->
        <div style="padding: 32px;">
          <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 16px;">${greeting}</p>
          ${body}
        </div>
        <!-- Footer -->
        <div style="padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0;">
            <a href="${APP_URL}" style="color: #6366f1; text-decoration: none;">${APP_URL}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}