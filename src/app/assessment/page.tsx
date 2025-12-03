'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowRight, Book, Calculator, Users, Brain, Run, Music, Palette, Leaf, Redo } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// --- DATA AND CONFIGURATION ---

const INTELLIGENCES: Record<string, Intelligence> = {
  L: { name: "Linguistic", icon: Book, description: "The ability to use language effectively both orally and in writing.", careers: ["Journalist", "Lawyer", "Writer", "Editor", "Public Speaker"] },
  LM: { name: "Logical-Mathematical", icon: Calculator, description: "The capacity to analyze problems logically, carry out mathematical operations, and investigate issues scientifically.", careers: ["Software Engineer", "Data Scientist", "Accountant", "Physicist", "Actuary"] },
  S: { name: "Spatial", icon: Palette, description: "The potential to recognize and use the patterns of wide space and more confined areas.", careers: ["Architect", "Graphic Designer", "Pilot", "Sculptor", "Surgeon"] },
  BK: { name: "Bodily-Kinesthetic", icon: Run, description: "The potential of using one's whole body or parts of the body to solve problems or fashion products.", careers: ["Athlete", "Dancer", "Physical Therapist", "Mechanic", "Craftsperson"] },
  M: { name: "Musical", icon: Music, description: "The capacity to discern pitch, rhythm, timbre, and tone.", careers: ["Musician", "Composer", "Sound Engineer", "Music Teacher", "Acoustician"] },
  I: { name: "Interpersonal", icon: Users, description: "The ability to understand the intentions, motivations, and desires of other people.", careers: ["Counselor", "Teacher", "Manager", "Salesperson", "HR Specialist"] },
  IA: { name: "Intrapersonal", icon: Brain, description: "The capacity to understand oneself, including fears, strengths, and goals.", careers: ["Philosopher", "Researcher", "Theorist", "Entrepreneur", "Psychotherapist"] },
  N: { name: "Naturalistic", icon: Leaf, description: "The ability to recognize, categorize, and utilize features of the environment.", careers: ["Biologist", "Forester", "Veterinarian", "Geologist", "Environmental Scientist"] },
};

type Intelligence = {
  name: string;
  icon: LucideIcon;
  description: string;
  careers: string[];
}

const QUESTIONS_POOL = [
  { text: "I enjoy reading books and writing stories or poetry.", intelligence: "L" },
  { text: "I can easily recognize and remember melodies and rhythms.", intelligence: "M" },
  { text: "I am good at understanding other people's feelings and motivations.", intelligence: "I" },
  { text: "I like solving complex problems, puzzles, or mathematical equations.", intelligence: "LM" },
  { text: "I enjoy quiet time for reflection and understanding my own goals and feelings.", intelligence: "IA" },
  { text: "I am skilled at manipulating objects with my hands, such as fixing things or playing sports.", intelligence: "BK" },
  { text: "I can easily visualize objects in three dimensions and enjoy drawing or mapping.", intelligence: "S" },
  { text: "I like spending time in nature, observing plants, animals, or weather patterns.", intelligence: "N" },
  { text: "I communicate effectively and enjoy debating or public speaking.", intelligence: "L" },
  { text: "I often hum or sing to myself and notice when music is out of tune.", intelligence: "M" },
  { text: "I enjoy working in teams and mediating disagreements.", intelligence: "I" },
  { text: "I use clear logic and reasoning to make decisions.", intelligence: "LM" },
  { text: "I am very aware of my strengths, weaknesses, and inner emotional state.", intelligence: "IA" },
  { text: "I have good coordination and enjoy physical activities like running, dancing, or building.", intelligence: "BK" },
  { text: "I find it easy to create mental images or sketches when solving a problem.", intelligence: "S" },
  { text: "I enjoy learning about different species and natural ecosystems.", intelligence: "N" },
  { text: "I am persuasive and enjoy using words to influence others.", intelligence: "L" },
  { text: "I appreciate subtle differences in musical works or instruments.", intelligence: "M" },
  { text: "I am empathetic and people often come to me for advice.", intelligence: "I" },
  { text: "I can easily spot patterns and sequences in data or numbers.", intelligence: "LM" },
  { text: "I set realistic personal goals and work independently to achieve them.", intelligence: "IA" },
  { text: "I learn best by doing, moving, or hands-on experience.", intelligence: "BK" },
  { text: "I enjoy designing, decorating, or arranging spaces visually.", intelligence: "S" },
  { text: "I am concerned about environmental issues and conservation.", intelligence: "N" },
  { text: "I like playing word games, solving crosswords, and expanding my vocabulary.", intelligence: "L" },
  { text: "I can keep time and rhythm accurately.", intelligence: "M" },
  { text: "I prefer teaching or guiding others rather than working alone.", intelligence: "I" },
  { text: "I enjoy experimenting with logic and testing hypotheses.", intelligence: "LM" },
  { text: "I value my privacy and enjoy analyzing my thoughts and beliefs.", intelligence: "IA" },
  { text: "I express myself well through physical movement (dance, acting, mime).", intelligence: "BK" },
  { text: "I am good at reading maps and directions.", intelligence: "S" },
  { text: "I feel comfortable in the wilderness and can identify various natural formations.", intelligence: "N" },
];

const OPTIONS = [
  { label: "Strongly Disagree", value: 1 },
  { label: "Disagree", value: 2 },
  { label: "Neutral", value: 3 },
  { label: "Agree", value: 4 },
  { label: "Strongly Agree", value: 5 },
];

// Utility to shuffle array (Fisher-Yates)
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


export default function AssessmentPage() {
  const [page, setPage] = useState('home'); // 'home', 'assessment', 'results'
  const [questions, setQuestions] = useState<typeof QUESTIONS_POOL>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Shuffle questions only once on component mount
    setQuestions(shuffleArray([...QUESTIONS_POOL]));
  }, []);

  const startAssessment = () => {
    const initialScores: Record<string, number> = {};
    Object.keys(INTELLIGENCES).forEach(key => initialScores[key] = 0);
    setScores(initialScores);
    setCurrentQuestionIndex(0);
    setPage('assessment');
  };

  const submitAnswer = (value: number) => {
    const q = questions[currentQuestionIndex];
    
    // Update Score
    setScores(prevScores => ({
      ...prevScores,
      [q.intelligence]: prevScores[q.intelligence] + value,
    }));
    
    setSelectedOption(value);
    setIsProcessing(true);

    // Move to next question after a short delay for UX
    setTimeout(() => {
      setSelectedOption(null);
      setIsProcessing(false);
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setPage('results');
      }
    }, 300);
  };
  
  const restart = () => {
      setPage('home');
  }

  const renderContent = () => {
    switch (page) {
      case 'home':
        return <HomePage onStart={startAssessment} />;
      case 'assessment':
        return (
          <Assessment
            question={questions[currentQuestionIndex]}
            index={currentQuestionIndex}
            total={questions.length}
            onSubmit={submitAnswer}
            selectedOption={selectedOption}
            isProcessing={isProcessing}
          />
        );
      case 'results':
        return <ResultsPage scores={scores} onRestart={restart} />;
      default:
        return <HomePage onStart={startAssessment} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-start">
        {renderContent()}
      </main>
    </div>
  );
}

const HomePage = ({ onStart }: { onStart: () => void }) => (
  <Card className="w-full max-w-2xl text-center animate-in fade-in-50">
    <CardHeader>
      <CardTitle className="text-3xl font-extrabold">Welcome to the Assessment</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-8">
        This assessment is based on Howard Gardner's theory of Multiple Intelligences. It helps identify your top strengths and recommends possible career pathways that align with those intelligences.
      </p>
      <Button onClick={onStart} size="lg">
        Start Assessment <ArrowRight className="ml-2" />
      </Button>
    </CardContent>
  </Card>
);

const Assessment = ({ question, index, total, onSubmit, selectedOption, isProcessing }: any) => {
  const progressPercentage = (index / total) * 100;
  
  if (!question) return null;

  return (
    <Card className="w-full max-w-3xl animate-in fade-in-50">
      <CardHeader>
        <CardTitle>Question {index + 1}</CardTitle>
        <p className="text-xl pt-4 text-foreground">{question.text}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progressPercentage} />
          <p className="text-sm text-right text-muted-foreground mt-2">
            Progress: {index} / {total}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-8">
          {OPTIONS.map(opt => (
            <Button
              key={opt.value}
              variant={selectedOption === opt.value ? 'default' : 'outline'}
              onClick={() => onSubmit(opt.value)}
              disabled={isProcessing}
              className="w-full"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


const ResultsPage = ({ scores, onRestart }: { scores: Record<string, number>, onRestart: () => void }) => {
    const TOTAL_QUESTIONS = QUESTIONS_POOL.length;
    const MAX_SCORE_PER_INTELLIGENCE = 5 * (TOTAL_QUESTIONS / Object.keys(INTELLIGENCES).length);
    
    const resultsArray = Object.keys(scores).map(key => ({
        key: key,
        name: INTELLIGENCES[key].name,
        score: scores[key],
        max: MAX_SCORE_PER_INTELLIGENCE,
        icon: INTELLIGENCES[key].icon,
        description: INTELLIGENCES[key].description,
        careers: INTELLIGENCES[key].careers,
    })).sort((a, b) => b.score - a.score);

    const topThree = resultsArray.slice(0, 3);
    
    return (
        <Card className="w-full max-w-3xl animate-in fade-in-50">
            <CardHeader>
                <CardTitle className="text-3xl font-extrabold text-primary">Your Results</CardTitle>
                <p className="text-muted-foreground">Below is a breakdown of your strengths across the eight Multiple Intelligence domains.</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 mb-8">
                    {resultsArray.map(item => {
                        const percentage = (item.score / item.max) * 100;
                        const Icon = item.icon;
                        return (
                            <div key={item.key}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-foreground flex items-center">
                                        <Icon className="mr-2 h-5 w-5 text-primary" />
                                        {item.name}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground">{item.score} / {item.max}</span>
                                </div>
                                <Progress value={percentage} />
                            </div>
                        )
                    })}
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4 border-b pb-2">Top Career Pathways</h3>
                <div className="space-y-4">
                    {topThree.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.key} className="p-4 border rounded-lg bg-secondary/30">
                                <h4 className="text-xl font-semibold text-primary mb-2 flex items-center">
                                    <span className="text-lg mr-2">#{index + 1}</span> {item.name} <Icon className="ml-2 h-5 w-5"/>
                                </h4>
                                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                <p className="font-medium text-foreground">Potential Careers:</p>
                                <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-1">
                                    {item.careers.map(career => <li key={career}>{career}</li>)}
                                </ul>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 pt-4 border-t text-center">
                    <Button variant="secondary" onClick={onRestart}>
                        <Redo className="mr-2"/> Take Assessment Again
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
