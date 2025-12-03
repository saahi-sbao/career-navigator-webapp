import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>About Career Navigator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to Career Navigator, your personal guide to discovering a fulfilling career path. Our mission is to empower you with the insights and tools needed to make informed decisions about your professional future.
            </p>
            <p>
              This platform leverages Howard Gardner's theory of Multiple Intelligences to help you understand your unique cognitive strengths. By identifying your dominant intelligences, we provide personalized career suggestions that align with your natural talents and interests.
            </p>
            <p>
              In addition to the assessment, our AI-powered engine allows you to explore various career fields and receive tailored recommendations based on your selected interests. Whether you're just starting out, considering a career change, or simply curious, Career Navigator is here to help you navigate the journey.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
