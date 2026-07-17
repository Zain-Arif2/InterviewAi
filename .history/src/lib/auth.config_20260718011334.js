/**
 * Edge-compatible auth config (No Mongoose, Bcrypt, or Node native files).
 * This safely runs inside the Next.js Middleware/Proxy layer.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // Fallback to 30 days if constant isn't available here
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'].some(path => nextUrl.pathname.startsWith(path));
      
      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
        return true;
      }

      return isLoggedIn;
    },
  },
  providers: [], // Leave empty here, filled inside full auth.js configuration
};

export default authConfig;