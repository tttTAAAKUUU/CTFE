import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

// 👇 AuthProvider gives the entire app access to auth state
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Clutch Trades',
  description: 'Competitive trading. Real prizes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        {/* 
          AuthProvider wraps the entire app.
          - Loads user on refresh
          - Stores user + loading state
          - Exposes login/logout
        */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
