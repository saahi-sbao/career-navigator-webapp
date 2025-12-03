import Header from '@/components/header';
import CareerGrid from '@/components/career-grid';
import Suggestions from '@/components/suggestions';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Explore Career Fields
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Select your interests to get personalized career suggestions from our AI.
          </p>
        </div>
        <CareerGrid />
        <Suggestions />
      </main>
    </div>
  );
}
