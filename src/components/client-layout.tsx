'use client';

import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/theme-provider';
import Chatbot from '@/components/chatbot';
import StartupAnimation from '@/components/startup-animation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <FirebaseClientProvider>
        {isLoading ? (
          <StartupAnimation />
        ) : (
          <>
            <div className="relative flex min-h-screen flex-col bg-background/80 backdrop-blur-sm">
              {children}
            </div>
            <Chatbot />
          </>
        )}
      </FirebaseClientProvider>
      <Toaster />
    </ThemeProvider>
  );
}
