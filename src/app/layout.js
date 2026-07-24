import './globals.css';
import { Inter, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: `${APP_NAME} — AI-Powered Mock Interviews`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ['interview', 'AI', 'mock interview', 'practice', 'career'],
  openGraph: {
    type: 'website',
    title: `${APP_NAME} — AI-Powered Mock Interviews`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — AI-Powered Mock Interviews`,
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} min-h-screen antialiased font-sans`}>        <AuthProvider>
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </AuthProvider>
      </body>
    </html>
  );
}