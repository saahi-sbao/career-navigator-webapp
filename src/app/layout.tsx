import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/lib/auth';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Career Navigator',
  description: 'Navigate your career path with AI-powered suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <UserProvider>{children}</UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
