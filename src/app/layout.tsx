import './globals.css';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import ClientLayout from '@/components/client-layout';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/theme-provider';
import Chatbot from '@/components/chatbot';


const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Career Navigator - AI-Powered Career Guidance for Students',
  description:
    'Career Navigator helps Kenyan students find their ideal career path with AI-powered assessments, personalized recommendations, and connections to mentors.',
  keywords: [
    'Career Navigator',
    'career guidance',
    'kenyan education',
    'CBC',
    'career assessment',
    'AI education',
    'student tools',
    'mentor connection',
  ],
  authors: [{ name: 'Career Navigator' }],
  metadataBase: new URL('https://career-navigator.app'), // Replace with your actual domain
  openGraph: {
    type: 'website',
    url: 'https://career-navigator.app', // Replace with your actual domain
    title: 'Career Navigator - AI-Powered Career Guidance for Students',
    description:
      'Career Navigator helps Kenyan students find their ideal career path with AI-powered assessments, personalized recommendations, and connections to mentors.',
    images: [
      {
        url: 'https://career-navigator.app/og-image.png', // Replace with a link to your open graph image
        width: 1200,
        height: 630,
        alt: 'Career Navigator Hero Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    url: 'https://career-navigator.app', // Replace with your actual domain
    title: 'Career Navigator - AI-Powered Career Guidance for Students',
    description:
      'Career Navigator helps Kenyan students find their ideal career path with AI-powered assessments, personalized recommendations, and connections to mentors.',
    images: ['https://career-navigator.app/twitter-image.png'], // Replace with a link to your twitter image
  },
  alternates: {
    canonical: 'https://career-navigator.app/', // Replace with your actual domain
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <ClientLayout>{children}</ClientLayout>
            <Chatbot />
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
