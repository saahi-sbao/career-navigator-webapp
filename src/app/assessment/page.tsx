'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Redo, Download } from 'lucide-react';
import jsPDF from 'jspdf';

// --- DATA AND CONFIGURATION ---

const CAREER_PATHS = [
  { id: 'stem', name: 'STEM', description: 'Science, Technology, Engineering, Mathematics', subjects: ['Mathematics', 'Physics', 'Biology', 'Chemistry'], careers: ['Software Developer', 'Data Scientist', 'Engineer (Civil/Electrical)', 'Doctor', 'Architect'], requiredIntelligences: { logicalMathematical: 0.4, spatial: 0.25, naturalist: 0.15 } },
  { id: 'ass', name: 'Arts & Sports Science', description: 'Creative & physical disciplines', subjects: ['Physical Education', 'Music', 'Visual Arts', 'Performing Arts'], careers: ['Musician', 'Artist', 'Professional Athlete', 'Designer (Fashion/Interior)', 'Choreographer'], requiredIntelligences: { bodilyKinesthetic: 0.3, musical: 0.2, spatial: 0.2, intrapersonal: 0.1 } },
  { id: 'ss', name: 'Social Sciences', description: 'Business, Law, Society', subjects: ['History', 'Economics', 'Geography', 'Business Studies'], careers: ['Teacher', 'Lawyer', 'Psychologist', 'Politician/Civil Servant', 'Journalist', 'Financial Analyst'], requiredIntelligences: { interpersonal: 0.25, linguistic: 0.25, intrapersonal: 0.2 } }
];

const QUESTIONS = [
  { id: 'q1', text: 'I enjoy writing stories, poems, or detailed reports.', intelligence: 'linguistic' },
  { id: 'q2', text: 'I can easily explain complex ideas to others using clear language.', intelligence: 'linguistic' },
  { id: 'q3', text: 'I am good at remembering names, dates, and trivia.', intelligence: 'linguistic' },
  { id: 'q4', text: 'I prefer to read a book or newspaper in my free time.', intelligence: 'linguistic' },
  { id: 'q5', text: 'Debating and discussing topics comes naturally to me.', intelligence: 'linguistic' },
  { id: 'q6', text: 'I am good at solving puzzles, mazes, and logical problems.', intelligence: 'logicalMathematical' },
  { id: 'q7', text: 'I enjoy performing complex calculations in my head.', intelligence: 'logicalMathematical' },
  { id: 'q8', text: 'I look for patterns and relationships in numerical data.', intelligence: 'logicalMathematical' },
  { id: 'q9', text: 'I like to conduct simple experiments to understand how things work.', intelligence: 'logicalMathematical' },
  { id: 'q10', text: 'I enjoy computer programming or dealing with logical systems.', intelligence: 'logicalMathematical' },
  { id: 'q11', text: 'I can easily read maps, charts, and diagrams.', intelligence: 'spatial' },
  { id: 'q12', text: 'I enjoy drawing, painting, or sculpting.', intelligence: 'spatial' },
  { id: 'q13', text: 'I am good at visualizing objects from different angles (3D thinking).', intelligence: 'spatial' },
  { id: 'q14', text: 'I notice details and artistic composition in visual things.', intelligence: 'spatial' },
  { id: 'q15', text: 'I enjoy playing games like chess or geometry puzzles.', intelligence: 'spatial' },
  { id: 'q16', text: 'I excel at one or more sports or physical activities.', intelligence: 'bodilyKinesthetic' },
  { id: 'q17', text: 'I prefer to learn by doing things hands-on rather than reading about them.', intelligence: 'bodilyKinesthetic' },
  { id: 'q18', text: 'I am generally well-coordinated and rarely bump into things.', intelligence: 'bodilyKinesthetic' },
  { id: 'q19', text: 'I enjoy working with my hands, such as crafting or carpentry.', intelligence: 'bodilyKinesthetic' },
  { id: 'q20', text: 'I use body language and gestures frequently when I speak.', intelligence: 'bodilyKinesthetic' },
  { id: 'q21', text: 'I can easily detect when a musical note is off-key.', intelligence: 'musical' },
  { id: 'q22', text: 'I enjoy singing or playing a musical instrument.', intelligence: 'musical' },
  { id: 'q23', text: 'I often hum or tap rhythms unconsciously.', intelligence: 'musical' },
  { id: 'q24', text: 'Music has a powerful effect on my mood.', intelligence: 'musical' },
  { id: 'q25', text: 'I can remember melodies and songs easily.', intelligence: 'musical' },
  { id: 'q26', text: 'I am good at mediating conflicts between friends.', intelligence: 'interpersonal' },
  { id: 'q27', text: 'I enjoy being part of a team or group project.', intelligence: 'interpersonal' },
  { id: 'q28', text: 'Friends often come to me for advice on personal matters.', intelligence: 'interpersonal' },
  { id: 'q29', text: 'I can easily sense the feelings and moods of others.', intelligence: 'interpersonal' },
  { id: 'q30', text: 'I enjoy teaching or explaining things to a group of people.', intelligence: 'interpersonal' },
  { id: 'q31', text: 'I am highly aware of my own emotions and motivations.', intelligence: 'intrapersonal' },
  { id: 'q32', text: 'I enjoy working on projects alone and setting my own goals.', intelligence: 'intrapersonal' },
  { id: 'q33', text: 'I spend time thinking about the meaning of life and philosophical questions.', intelligence: 'intrapersonal' },
  { id: 'q34', text: 'I can learn from my mistakes and adjust my plans.', intelligence: 'intrapersonal' },
  { id: 'q35', text: 'I have a realistic understanding of my strengths and weaknesses.', intelligence: 'intrapersonal' },
  { id: 'q36', text: 'I enjoy spending time outdoors in nature (gardening, hiking, camping).', intelligence: 'naturalist' },
  { id: 'q37', text: 'I can easily identify different types of trees, birds, or flowers.', intelligence: 'naturalist' },
  { id: 'q38', text: 'I am interested in environmental issues and conservation.', intelligence: 'naturalist' },
  { id: 'q39', text: 'I enjoy sorting and classifying objects into different categories.', intelligence: 'naturalist' },
  { id: 'q40', text: 'I find comfort and peace in natural settings.', intelligence: 'naturalist' },
];

type UserAnswers = { [key: string]: number };
type StudentInfo = { name: string; age: number; school: string };
type MIScores = { [key: string]: number };
type AssessmentResults = {
  info: StudentInfo;
  miScores: MIScores;
  recommendation: {
    pathway: typeof CAREER_PATHS[0];
    confidence: number;
  };
  timestamp: string;
};


export default function AssessmentPage() {
  const [page, setPage] = useState('info'); // 'info', 'assessment', 'results'
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedInfo = localStorage.getItem('studentInfo');
    const savedAnswers = localStorage.getItem('userAnswers');
    const savedResults = localStorage.getItem('assessmentResults');

    if (savedResults) {
      setResults(JSON.parse(savedResults));
      setPage('results');
    } else {
      if (savedInfo) setStudentInfo(JSON.parse(savedInfo));
      if (savedAnswers) setUserAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const startAssessment = (info: StudentInfo) => {
    if (!info.name || !info.age || !info.school) {
      setError("Please fill in your Full Name, Age, and School/Institution before starting the quiz.");
      return;
    }
    setError(null);
    setStudentInfo(info);
    localStorage.setItem('studentInfo', JSON.stringify(info));

    const savedAnswers = localStorage.getItem('userAnswers');
    if (savedAnswers) {
        const parsedAnswers = JSON.parse(savedAnswers);
        setUserAnswers(parsedAnswers);
        const lastAnsweredIndex = QUESTIONS.findLastIndex(q => parsedAnswers[q.id] !== undefined);
        setCurrentQuestionIndex(lastAnsweredIndex !== -1 ? lastAnsweredIndex : 0);
    } else {
        setUserAnswers({});
        setCurrentQuestionIndex(0);
    }
    setPage('assessment');
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    const newAnswers = { ...userAnswers, [questionId]: value };
    setUserAnswers(newAnswers);
    localStorage.setItem('userAnswers', JSON.stringify(newAnswers));
    
    // Auto-advance
    setTimeout(() => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    }, 200);
  };
  
  const navigateQuestion = (direction: 'next' | 'prev') => {
      if(direction === 'next') {
        if(currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
      } else {
        if(currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
      }
  }

  const submitAssessment = () => {
    if (Object.keys(userAnswers).length !== QUESTIONS.length) {
      setError("Please answer all 40 questions before submitting.");
      const firstUnanswered = QUESTIONS.findIndex(q => userAnswers[q.id] === undefined);
      if(firstUnanswered !== -1) setCurrentQuestionIndex(firstUnanswered);
      return;
    }
    setError(null);

    const calculateMIScores = (): MIScores => {
        const scores: {[key: string]: number} = {
            linguistic: 0, logicalMathematical: 0, spatial: 0, bodilyKinesthetic: 0,
            musical: 0, interpersonal: 0, intrapersonal: 0, naturalist: 0
        };
        const counts = { ...scores };

        QUESTIONS.forEach(q => {
            const score = userAnswers[q.id];
            if (score !== undefined) {
                scores[q.intelligence] += score;
                counts[q.intelligence]++;
            }
        });

        const MAX_SCORE_PER_MI = 5 * 5; 
        const normalizedScores: MIScores = {};

        for (const mi in scores) {
            if (counts[mi] > 0) {
                normalizedScores[mi] = Math.round((scores[mi] / MAX_SCORE_PER_MI) * 100);
            } else {
                normalizedScores[mi] = 0;
            }
        }
        return normalizedScores;
    }

    const determinePathway = (miScores: MIScores) => {
        let bestMatch: typeof CAREER_PATHS[0] | null = null;
        let highestMatchScore = -1;

        CAREER_PATHS.forEach(path => {
            let matchScore = 0;
            let totalWeight = 0;
            
            for (const mi in path.requiredIntelligences) {
                const weight = path.requiredIntelligences[mi as keyof typeof path.requiredIntelligences];
                const studentScore = miScores[mi] || 0;
                
                matchScore += (studentScore / 100) * weight;
                totalWeight += weight;
            }

            const normalizedMatchScore = totalWeight > 0 ? matchScore / totalWeight : 0;

            if (normalizedMatchScore > highestMatchScore) {
                highestMatchScore = normalizedMatchScore;
                bestMatch = path;
            } else if (normalizedMatchScore === highestMatchScore && bestMatch) {
                const primaryMI = Object.keys(path.requiredIntelligences)[0];
                const currentPrimaryScore = miScores[primaryMI] || 0;
                const bestPrimaryMI = Object.keys(bestMatch.requiredIntelligences)[0];
                const bestPrimaryScore = miScores[bestPrimaryMI] || 0;

                if (currentPrimaryScore > bestPrimaryScore) {
                    bestMatch = path;
                }
            }
        });

        return {
            pathway: bestMatch!,
            confidence: Math.round(highestMatchScore * 100)
        };
    }

    const miScores = calculateMIScores();
    const recommendation = determinePathway(miScores);

    const assessmentResults: AssessmentResults = {
        info: studentInfo!,
        miScores: miScores,
        recommendation: recommendation,
        timestamp: new Date().toISOString()
    };
    
    setResults(assessmentResults);
    localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
    setPage('results');
  };

  const startNewAssessment = () => {
    localStorage.removeItem('assessmentResults');
    localStorage.removeItem('studentInfo');
    localStorage.removeItem('userAnswers'); 
    
    setStudentInfo(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setResults(null);
    setError(null);
    setPage('info');
  }

  const renderContent = () => {
    switch (page) {
      case 'info':
        return <InfoPage onStart={startAssessment} initialInfo={studentInfo} error={error} />;
      case 'assessment':
        return (
          <Assessment
            question={QUESTIONS[currentQuestionIndex]}
            index={currentQuestionIndex}
            total={QUESTIONS.length}
            answer={userAnswers[QUESTIONS[currentQuestionIndex]?.id]}
            onAnswer={handleAnswerChange}
            onNavigate={navigateQuestion}
            onSubmit={submitAssessment}
            error={error}
          />
        );
      case 'results':
        return <ResultsPage results={results!} onRestart={startNewAssessment} />;
      default:
        return <InfoPage onStart={startAssessment} error={error} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10 flex justify-center items-start">
        {renderContent()}
      </main>
    </div>
  );
}

const InfoPage = ({ onStart, initialInfo, error }: { onStart: (info: StudentInfo) => void, initialInfo?: StudentInfo | null, error: string | null }) => {
    const [info, setInfo] = useState({
        name: initialInfo?.name || '',
        age: initialInfo?.age || '',
        school: initialInfo?.school || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onStart({ ...info, age: Number(info.age) });
    }

    return (
        <Card className="w-full max-w-2xl text-center">
            <CardHeader>
                <CardTitle className="text-3xl font-extrabold">Career Guidance Assessment</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-8">
                Enter your details below to begin the Multiple Intelligence (MI) quiz. This will help us recommend a suitable career pathway for you.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <Label htmlFor="student-name">Full Name</Label>
                        <Input id="student-name" name="name" value={info.name} onChange={handleChange} placeholder="e.g., John Doe" required />
                    </div>
                    <div>
                        <Label htmlFor="student-age">Age</Label>
                        <Input id="student-age" name="age" type="number" value={info.age} onChange={handleChange} placeholder="e.g., 16" required />
                    </div>
                    <div>
                        <Label htmlFor="student-school">School / Institution</Label>
                        <Input id="student-school" name="school" value={info.school} onChange={handleChange} placeholder="e.g., Kenya High School" required />
                    </div>
                    {error && <p className="text-destructive text-sm font-medium">{error}</p>}
                    <Button type="submit" size="lg" className="w-full text-lg mt-4">
                        Start MI Quiz <ArrowRight className="ml-2" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
};

const Assessment = ({ question, index, total, answer, onAnswer, onNavigate, onSubmit, error }: any) => {
  const progressPercentage = ((index + 1) / total) * 100;
  if (!question) return null;

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Question {index + 1} of {total}</CardTitle>
        <p className="text-xl pt-4 font-semibold text-foreground">{question.text}</p>
      </CardHeader>
      <CardContent>
        <div className="my-6">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <RadioGroup
          value={answer?.toString()}
          onValueChange={(value) => onAnswer(question.id, parseInt(value))}
          className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-8"
        >
          {[1, 2, 3, 4, 5].map(value => (
            <div key={value} className="flex items-center">
              <RadioGroupItem value={value.toString()} id={`${question.id}-${value}`} />
              <Label htmlFor={`${question.id}-${value}`} className="ml-2 cursor-pointer">
                {value}{' '}
                <span className="text-muted-foreground text-xs">
                  ({ {1: 'Strongly Disagree', 2: 'Disagree', 3: 'Neutral', 4: 'Agree', 5: 'Strongly Agree'}[value] })
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {error && <p className="text-destructive text-sm font-medium mt-4 text-center">{error}</p>}

        <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => onNavigate('prev')} disabled={index === 0}>Previous</Button>
            {index === total - 1 ? (
                <Button onClick={onSubmit}>Submit Results</Button>
            ) : (
                <Button onClick={() => onNavigate('next')} disabled={answer === undefined}>Next</Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

const ResultsPage = ({ results, onRestart }: { results: AssessmentResults, onRestart: () => void }) => {
    const { info, miScores, recommendation, timestamp } = results;
    const sortedMiScores = Object.entries(miScores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    const downloadPDF = () => {
        const doc = new jsPDF();
        const margin = 20;
        let y = margin;
        const pageWidth = doc.internal.pageSize.getWidth();

        const addTextAndCheckPage = (textArray: string[], x: number, spacing = 0) => {
            textArray.forEach(line => {
                if (y + 7 > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, x, y);
                y += 7 + spacing;
            });
        };

        doc.setFontSize(22);
        doc.setTextColor(44, 123, 229);
        doc.text('Career Guidance Report', pageWidth / 2, y, { align: 'center' });
        y += 7;
        doc.setFontSize(14);
        doc.setTextColor(108, 117, 125);
        doc.text('Kenya Competency-Based Education (CBE)', pageWidth / 2, y, { align: 'center' });
        y += 14;

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 128);
        doc.text('1. Student Information', margin, y);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);
        y += 7;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        addTextAndCheckPage([
            `Name: ${info.name}`, `Age: ${info.age}`, `School: ${info.school}`,
            `Date: ${new Date(timestamp).toLocaleDateString()}`
        ], margin);
        y += 7;

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 128);
        doc.text('2. Pathway Recommendation', margin, y);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);
        y += 7;
        
        doc.setFontSize(14);
        doc.setTextColor(44, 123, 229);
        addTextAndCheckPage([`Recommended Pathway: ${recommendation.pathway.name} Pathway`], margin);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const safeSplit = (text: string, maxWidth: number) => doc.splitTextToSize(text, maxWidth);
        addTextAndCheckPage(safeSplit(`Confidence Score: ${recommendation.confidence}%`, pageWidth - margin * 2), margin);
        y += 3.5;
        addTextAndCheckPage(safeSplit(`Description: ${recommendation.pathway.description}`, pageWidth - margin * 2), margin);
        y += 3.5;
        addTextAndCheckPage(safeSplit(`Key Subjects: ${recommendation.pathway.subjects.join(', ')}`, pageWidth - margin * 2), margin);
        y += 14;

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 128);
        doc.text('3. Multiple Intelligence Profile (MI Scores)', margin, y);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);
        y += 10.5;

        doc.setFontSize(12);
        sortedMiScores.forEach(([mi, score]) => {
            if (y + 7 > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage(); y = margin;
            }
            const miDisplay = mi.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            doc.text(`${miDisplay}:`, margin, y);
            const barX = margin + 60;
            const barWidth = 80;
            const fillWidth = (score / 100) * barWidth;
            doc.setFillColor(230, 230, 230);
            doc.rect(barX, y - 4, barWidth, 5, 'F');
            doc.setFillColor(44, 123, 229);
            doc.rect(barX, y - 4, fillWidth, 5, 'F');
            doc.text(`${score}%`, barX + barWidth + 5, y);
            y += 7;
        });
        y += 7;

        if (y > doc.internal.pageSize.getHeight() - 50) { doc.addPage(); y = margin; }
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 128);
        doc.text('4. Suggested Career Paths', margin, y);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);
        y += 7;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const careersText = recommendation.pathway.careers.join(', ');
        addTextAndCheckPage(safeSplit(careersText, pageWidth - margin * 2), margin, 2);
        
        doc.setFontSize(10);
        doc.setTextColor(139, 0, 0);
        doc.text('Disclaimer: This report is for guidance only. Consult with a qualified career counselor for personalized advice.', margin, doc.internal.pageSize.getHeight() - margin);

        doc.save(`Career_Report_${info.name.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <Card className="w-full max-w-4xl animate-in fade-in-50">
            <CardHeader>
                <CardTitle className="text-3xl font-extrabold text-primary">Your Career Guidance Report</CardTitle>
                <CardDescription>Generated on {new Date(timestamp).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-lg mb-2">Student Summary</h3>
                    <p><strong>Name:</strong> {info.name}</p>
                    <p><strong>Age:</strong> {info.age}</p>
                    <p><strong>School:</strong> {info.school}</p>
                </div>

                <div className="border bg-primary/5 border-primary/20 text-primary-foreground rounded-xl p-6 mb-8">
                     <h3 className="text-xl font-bold text-primary mb-2">Your Recommended Pathway is:</h3>
                     <h1 className="text-4xl font-extrabold text-primary">{recommendation.pathway.name} Pathway</h1>
                     <p className="mt-2 text-lg">Match Confidence: <strong>{recommendation.confidence}%</strong></p>
                     <p className="mt-4 text-muted-foreground">{recommendation.pathway.description}.</p>

                     <div className="mt-4">
                        <h4 className="font-semibold">Key Subjects:</h4>
                        <p className="text-muted-foreground">{recommendation.pathway.subjects.join(', ')}</p>
                     </div>
                     <div className="mt-4">
                        <h4 className="font-semibold">Suggested Careers:</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {recommendation.pathway.careers.map(c => <span key={c} className="bg-primary/20 text-primary-dark font-medium px-3 py-1 rounded-full text-sm">{c}</span>)}
                        </div>
                     </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold mb-4">Your Multiple Intelligence Profile</h3>
                    <div className="space-y-4">
                        {sortedMiScores.map(([mi, score]) => {
                            const miDisplay = mi.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());
                            return (
                                <div key={mi}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold">{miDisplay}</span>
                                        <span className="text-sm font-bold text-primary">{score}%</span>
                                    </div>
                                    <Progress value={score} className="h-3" />
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t flex justify-center gap-4">
                    <Button onClick={downloadPDF}><Download className="mr-2" /> Download PDF Report</Button>
                    <Button variant="secondary" onClick={onRestart}><Redo className="mr-2" /> Start New Assessment</Button>
                </div>
            </CardContent>
        </Card>
    );
};
