'use client';

import { useSession } from 'next-auth/react';

/**
 * Hook to access the current authenticated user.
 * Returns user data from the session along with loading state.
 */
export function useCurrentUser() {
  const { data: session, status, update } = useSession();

  return {
    user: session?.user || null,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    update,
  };
}