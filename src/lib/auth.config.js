import Credentials from 'next-auth/providers/credentials';

/**
 * Edge-compatible auth config (no Mongoose/Node-only imports).
 * Used by middleware for route protection.
 */
const authConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // authorize is in the full auth.js config, not here
      async authorize() {
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    // Route-protection logic. Kept here (Edge-safe) so middleware can use it
    // without pulling in the Node-only auth.js (mongoose, bcryptjs, etc.).
    async authorized({ auth, request: { nextUrl } }) {
  const isLoggedIn = !!auth?.user;
  const isAuthPage = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'].some(path => nextUrl.pathname.startsWith(path));
  const isProtectedPage = nextUrl.pathname.startsWith('/dashboard');

  if (isAuthPage) {
    if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
    return true;
  }

  // Only /dashboard/* requires login. Everything else (home page,
  // marketing pages, etc.) stays public.
  if (isProtectedPage) {
    return isLoggedIn;
  }

  return true;
},
  },
};

export default authConfig;