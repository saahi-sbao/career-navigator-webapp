import Header from '@/components/header';
import CareerGrid from '@/components/career-grid';
import Suggestions from '@/components/suggestions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 p-6 bg-card rounded-lg shadow-sm text-center">
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Discover Your Strengths</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Take our Multiple Intelligences assessment to identify your top strengths and receive personalized career pathway recommendations.</p>
            <Button asChild size="lg">
              <Link href="/assessment">
                Start Assessment <ArrowRight className="ml-2" />
              </Link>
            </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Explore Career Fields
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Or, select your interests to get personalized career suggestions from our AI.
          </p>
        </div>
        <CareerGrid />
        <Suggestions />
      </main>
    </div>
  );
}
