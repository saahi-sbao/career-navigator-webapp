
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Languages,
  Calculator,
  Music,
  View,
  Bike,
  Users,
  User,
  Sprout,
  Sparkles,
} from 'lucide-react';
import type { ReactElement } from 'react';

type Intelligence = {
  name: string;
  description: string;
  icon: ReactElement;
};

const intelligences: Intelligence[] = [
  {
    name: 'Linguistic',
    description: 'High proficiency in words, language, and writing.',
    icon: <Languages className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Logical-Mathematical',
    description: 'Strong skills in reasoning, calculation, and abstract thought.',
    icon: <Calculator className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Musical',
    description: 'Sensitivity to rhythm, pitch, and sound patterns.',
    icon: <Music className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Spatial (Visual)',
    description: 'Capacity to think in images, physical space, and visualization (e.g., architects, sailors).',
    icon: <View className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Bodily-Kinesthetic',
    description: 'Exceptional control over physical movements (e.g., dancers, surgeons).',
    icon: <Bike className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Interpersonal',
    description: 'High ability to understand and interact effectively with others.',
    icon: <Users className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Intrapersonal',
    description: "Deep understanding of one's own, interests, goals, and emotions.",
    icon: <User className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Naturalist',
    description: 'Strong ability to recognize, categorize, and understand nature and the environment.',
    icon: <Sprout className="h-10 w-10 text-primary" />,
  },
  {
    name: 'Existential (Proposed)',
    description: 'Sensitivity to deep, philosophical questions about human existence.',
    icon: <Sparkles className="h-10 w-10 text-primary" />,
  },
];

export default function IntelligenceAnalystPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Intelligence Analyst</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the different types of intelligence based on Howard Gardner's theory. Understanding these can help you identify your unique strengths.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {intelligences.map((intelligence) => (
            <Card key={intelligence.name} className="flex flex-col">
              <CardHeader className="items-center text-center">
                {intelligence.icon}
                <CardTitle className="mt-4 text-2xl">{intelligence.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow">
                <p className="text-muted-foreground">{intelligence.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
