'use client';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {children}
    </div>
  );
}
