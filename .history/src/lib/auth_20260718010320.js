import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
// Change 'authenticateUser' here to the correct exported function name if needed
import { authenticateUser } from '@/services/auth.service';
import { SESSION_MAX_AGE } from '@/lib/constants';

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const user = await authenticateUser(credentials);
        if (!user) return null;
        return user;
      },
    }),
  ],
  // ... rest of your next-auth configuration
});