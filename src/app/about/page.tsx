
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card>
            <CardHeader>
                <CardTitle className="text-center text-4xl font-bold text-primary">About The Career Guidance System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-lg text-foreground">
                 <p className="text-muted-foreground">
                    This system is designed to help students in Kenya's Competency-Based Education (CBE) system navigate their career choices. By assessing multiple intelligences, we recommend suitable career pathways that align with each student's unique interests, abilities, and passions.
                </p>

                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-primary">How It Works</h3>
                    <ul className="space-y-3 list-inside">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="text-green-500 mt-1 h-6 w-6 flex-shrink-0" />
                            <span><strong className="font-semibold">Intelligence Assessment:</strong> We use a questionnaire based on Howard Gardner's Multiple Intelligence Theory to assess 8 different types of intelligences.</span>
                        </li>
                        <li className="flex items-start gap-2">
                             <CheckCircle2 className="text-green-500 mt-1 h-6 w-6 flex-shrink-0" />
                            <span><strong className="font-semibold">Pathway Classification:</strong> A machine learning model classifies your intelligence profile into one of the three senior school pathways in Kenya (Arts & Sports Science, Social Sciences, or STEM).</span>
                        </li>
                        <li className="flex items-start gap-2">
                             <CheckCircle2 className="text-green-500 mt-1 h-6 w-6 flex-shrink-0" />
                            <span><strong className="font-semibold">Personalized Recommendations:</strong> Based on your results, our AI generates personalized career recommendations, including specific careers and a 6-month skill development plan.</span>
                        </li>
                    </ul>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-primary">Our Mission</h3>
                    <p className="text-muted-foreground">
                        Our mission is to empower students to make informed and fulfilling career decisions that leverage their natural talents and contribute to Kenya's growing economy. We believe every student has a unique potential, and our goal is to help them discover it.
                    </p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
