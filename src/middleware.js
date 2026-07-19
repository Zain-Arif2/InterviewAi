import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';

// Edge Runtime-safe middleware. Do NOT import from '@/lib/auth' here —
// that file pulls in mongoose/bcryptjs (via auth.service.js), which are
// Node-only and will break in the Edge Runtime that middleware runs in.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};