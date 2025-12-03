import Header from '@/components/header';
import CareerGrid from '@/components/career-grid';
import Suggestions from '@/components/suggestions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main className="p-4 sm:p-8 min-h-screen flex flex-col items-center">
        <div className="bg-card p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl w-full">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <h1 className="text-4xl font-extrabold text-primary mb-2">
                  Career Builder & Explorer (CBE)
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground">
                  Navigate your career path. Select your interests to get AI-powered suggestions.
                  </p>
              </div>
              <Button asChild size="lg">
                  <Link href="/assessment">Start Assessment</Link>
              </Button>
          </div>


          <h2 className="text-2xl font-semibold text-card-foreground border-b pb-2 mb-6">
            Explore Career Fields
          </h2>

          <CareerGrid />
          <Suggestions />
        </div>
      </main>
    </>
  );
}
