import Header from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <Card className="bg-gradient-to-br from-blue-500 to-orange-400 text-white shadow-lg">
    <CardContent className="flex flex-col items-center justify-center p-6">
      <p className="text-5xl font-extrabold">{value}</p>
      <p className="mt-2 text-lg font-medium">{label}</p>
    </CardContent>
  </Card>
);

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-10 text-primary">About This System</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-md">
              <div className="space-y-8 text-foreground">
                
                <div>
                  <h2 className="text-2xl font-semibold text-primary mb-3">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The Career Guidance System aims to help students in Kenya's Competency-Based Education system make informed career decisions by assessing their multiple intelligences and recommending suitable career pathways aligned with their interests, abilities, and passions.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-primary mb-3">How It Works</h2>
                  <p className="text-muted-foreground mb-4">Our system combines three key components:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span><strong>Intelligence Assessment:</strong> Based on Howard Gardner's Multiple Intelligence Theory, we assess 8 types of intelligences through a comprehensive questionnaire.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span><strong>Pathway Classification:</strong> Using machine learning algorithms, we classify your intelligence profile into one of Kenya's three CBE pathways (STEM, Arts & Sports Science, Social Sciences).</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span><strong>Personalized Recommendations:</strong> We generate AI-powered career recommendations tailored to your unique profile, including specific careers and a 6-month skill development plan.</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold text-primary mb-3">Technical Stack</h2>
                  <p className="text-muted-foreground mb-4">Built with modern technologies including:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Python for backend processing</li>
                    <li>Machine Learning (scikit-learn) for pathway classification</li>
                    <li>Genkit for personalized recommendations</li>
                    <li>Next.js, React, and Tailwind CSS for responsive web interface</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-primary mb-3">Data Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We take your privacy seriously. Your assessment data is processed securely and used only to provide you with personalized recommendations. We do not share your information with third parties.
                  </p>
                </div>

              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <StatCard value="8" label="Intelligence Types" />
            <StatCard value="40" label="Assessment Questions" />
            <StatCard value="3" label="Career Pathways" />
            <StatCard value="1,000+" label="Career Options" />
          </div>

        </div>
      </main>
    </div>
  );
}
