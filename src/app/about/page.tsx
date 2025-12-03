import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold">About This System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              This Career Guidance System is designed to assist students in Kenya's Competency-Based Curriculum (CBE) in discovering their interests and aptitudes.
            </p>
            <p>
              By leveraging established theories like Howard Gardner's Multiple Intelligences, this tool provides a simple yet effective way for students to gain insight into their strengths. The goal is to offer personalized career pathway suggestions that align with their natural talents.
            </p>
            <p>
              Whether you are a student exploring future options, a teacher guiding your class, or a parent supporting your child, this system serves as a starting point for important career conversations.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
