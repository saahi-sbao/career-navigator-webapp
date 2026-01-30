'use client';

import { useState, useEffect } from 'react';
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
    }, 1500); // Shortened startup time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <StartupAnimation />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background/80 backdrop-blur-sm">
      {children}
    </div>
  );
}
