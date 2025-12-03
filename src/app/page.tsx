
import Header from '@/components/header';
import CareerGrid from '@/components/career-grid';
import Suggestions from '@/components/suggestions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
              Discover Your Future Career
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Explore your interests and aptitudes with our AI-powered assessment to find the perfect career pathway for you in the Kenyan CBE curriculum.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                  <Link href="/assessment">Start Assessment</Link>
              </Button>
            </div>
          </div>
        </section>
        <section
          id="career-fields"
          className="container space-y-6 bg-slate-50/50 dark:bg-transparent py-8 md:py-12 lg:py-24 rounded-t-2xl"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
              Explore Career Fields
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Select the fields you are interested in to get personalized suggestions.
            </p>
          </div>
          <CareerGrid />
          <Suggestions />
        </section>
      </main>
    </>
  );
}
