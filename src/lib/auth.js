import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import authConfig from '@/lib/auth.config';
import { authenticateUser } from '@/services/auth.service';
import { SESSION_MAX_AGE } from '@/lib/constants';

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await authenticateUser({
          email: credentials.email,
          password: credentials.password,
        });

        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: SESSION_MAX_AGE,
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      // Initial sign in — attach user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.plan = user.plan;
        token.emailVerified = user.emailVerified;
      }

      // Allow session updates via update() trigger
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
        if (session.role) token.role = session.role;
        if (session.plan) token.plan = session.plan;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.plan = token.plan;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
});