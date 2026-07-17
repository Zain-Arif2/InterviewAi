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
};

export default authConfig;