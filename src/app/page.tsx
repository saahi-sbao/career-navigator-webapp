import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center items-start pt-10 px-4 pb-10">
        <Card className="text-center w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-8">
              This assessment is based on Howard Gardner's theory of Multiple Intelligences. It helps identify your top strengths and recommends possible career pathways that align with those intelligences.
            </p>
            <Button asChild className="text-lg">
              <Link href="/assessment">
                Start Assessment <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
