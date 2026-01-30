
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Redo, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';


// --- DATA AND CONFIGURATION ---

const CAREER_PATHS = [
  { id: 'stem', name: 'STEM', description: 'Science, Technology, Engineering, Mathematics', subjects: ['Mathematics', 'Physics', 'Biology', 'Chemistry'], careers: ['Software Developer', 'Data Scientist', 'Engineer (Civil/Electrical)', 'Doctor', 'Architect'], requiredIntelligences: { logicalMathematical: 0.4, spatial: 0.25, naturalist: 0.15 } },
  { id: 'ass', name: 'Arts & Sports Science', description: 'Creative & physical disciplines', subjects: ['Physical Education', 'Music', 'Visual Arts', 'Performing Arts'], careers: ['Musician', 'Artist', 'Professional Athlete', 'Designer (Fashion/Interior)', 'Choreographer'], requiredIntelligences: { bodilyKinesthetic: 0.3, musical: 0.2, spatial: 0.2, intrapersonal: 0.1 } },
  { id: 'ss', name: 'Social Sciences', description: 'Business, Law, Society', subjects: ['History', 'Economics', 'Geography', 'Business Studies'], careers: ['Teacher', 'Lawyer', 'Psychologist', 'Politician/Civil Servant', 'Journalist', 'Financial Analyst'], requiredIntelligences: { interpersonal: 0.25, linguistic: 0.25, intrapersonal: 0.2 } }
];

const QUESTIONS = [
    // Verbal-Linguistic
    { id: 'q1', text: 'How easily can you learn new words and integrate them into your everyday vocabulary when speaking or writing?', intelligence: 'linguistic' },
    { id: 'q2', text: 'Do you enjoy reading a wide range of materials, such as books, magazines, and newspapers, for pleasure?', intelligence: 'linguistic' },
    { id: 'q3', text: 'Are you skilled at explaining complex ideas clearly and concisely to others, both in writing and verbally?', intelligence: 'linguistic' },
    { id: 'q4', text: 'Do you often enjoy word games, riddles, puns, or writing creative pieces like poems or stories?', intelligence: 'linguistic' },
    { id: 'q5', text: 'When you need to remember information, do you find that writing it down or talking through it out loud helps the most?', intelligence: 'linguistic' },
    
    // Logical-Mathematical
    { id: 'q6', text: 'Do you enjoy solving brain teasers, puzzles, or logic problems that require deductive reasoning?', intelligence: 'logicalMathematical' },
    { id: 'q7', text: 'How comfortable are you working with abstract concepts, symbols, or numerical patterns?', intelligence: 'logicalMathematical' },
    { id: 'q8', text: 'Do you tend to look for patterns, categories, or relationships between things in your environment?', intelligence: 'logicalMathematical' },
    { id: 'q9', text: 'When faced with a complex problem, do you naturally break it down into smaller, sequential steps to find a solution?', intelligence: 'logicalMathematical' },
    { id: 'q10', text: 'Do you prefer subjects in school or work that involve calculations, statistics, or scientific experimentation?', intelligence: 'logicalMathematical' },
    
    // Visual-Spatial
    { id: 'q11', text: 'Can you easily read and interpret maps, charts, graphs, or diagrams?', intelligence: 'spatial' },
    { id: 'q12', text: 'Do you enjoy activities like drawing, painting, sculpting, or graphic design?', intelligence: 'spatial' },
    { id: 'q13', text: 'Are you good at mentally rotating an object or imagining what something would look like from a different perspective?', intelligence: 'spatial' },
    { id: 'q14', text: 'Do you find it easy to navigate new places, or do you have a strong sense of direction?', intelligence: 'spatial' },
    { id: 'q15', text: 'When assembling furniture or following complex instructions, do you rely more on the visual diagrams than the written text?', intelligence: 'spatial' },
    
    // Bodily-Kinesthetic
    { id: 'q16', text: 'Do you learn best by doing (hands-on activities, role-playing, building) rather than by reading or listening?', intelligence: 'bodilyKinesthetic' },
    { id: 'q17', text: 'Do you possess good physical coordination, agility, and balance, which shows up in sports, dancing, or manual skills?', intelligence: 'bodilyKinesthetic' },
    { id: 'q18', text: 'Do you often use hand gestures, facial expressions, or other body language to communicate your thoughts and feelings?', intelligence: 'bodilyKinesthetic' },
    { id: 'q19', text: 'Are you skilled at manipulating small objects and tools, such as in crafts, surgery, or fine motor tasks?', intelligence: 'bodilyKinesthetic' },
    { id: 'q20', text: 'Do you feel restless or need to move around when you have to sit for long periods of time?', intelligence: 'bodilyKinesthetic' },
    
    // Musical
    { id: 'q21', text: 'Can you easily remember the melody and lyrics of songs you\'ve heard only once or twice?', intelligence: 'musical' },
    { id: 'q22', text: 'Do you have a keen sensitivity to different rhythms, tones, and patterns in your environment (e.g., distinguishing between different sounds)?', intelligence: 'musical' },
    { id: 'q23', text: 'Do you often find yourself humming, singing, or tapping out rhythms, even when you aren\'t trying to?', intelligence: 'musical' },
    { id: 'q24', text: 'Are you able to tell when a note is slightly off-key or when an instrument is out of tune?', intelligence: 'musical' },
    { id: 'q25', text: 'Does listening to music significantly affect your mood or concentration for better or worse?', intelligence: 'musical' },
    
    // Interpersonal
    { id: 'q26', text: 'Do people often seek you out for advice or to mediate conflicts between friends or colleagues?', intelligence: 'interpersonal' },
    { id: 'q27', text: 'Are you good at sensing the feelings, moods, or unstated intentions of others, even when they aren\'t explicitly expressed?', intelligence: 'interpersonal' },
    { id: 'q28', text: 'Do you enjoy working in groups or teams, and are you effective in a leadership or coordinating role?', intelligence: 'interpersonal' },
    { id: 'q29', text: 'How comfortable are you starting conversations and building rapport with new people?', intelligence: 'interpersonal' },
    { id: 'q30', text: 'Do you have many friends or acquaintances, and do you put effort into maintaining those relationships?', intelligence: 'interpersonal' },
    
    // Intrapersonal
    { id: 'q31', text: 'Do you often spend time reflecting on your own feelings, goals, and personal motivations?', intelligence: 'intrapersonal' },
    { id: 'q32', text: 'Are you aware of your own personal strengths and weaknesses, and do you use this knowledge to set realistic goals?', intelligence: 'intrapersonal' },
    { id: 'q33', text: 'Do you keep a journal, write reflective essays, or engage in practices like meditation or self-analysis?', intelligence: 'intrapersonal' },
    { id: 'q34', text: 'How well can you self-regulate your emotions, staying calm or focused when under pressure?', intelligence: 'intrapersonal' },
    { id: 'q35', text: 'Do you prefer working alone on projects where you can set your own pace and direction?', intelligence: 'intrapersonal' },

    // Naturalist
    { id: 'q36', text: 'Do you enjoy spending time outdoors, such as hiking, gardening, or observing the environment?', intelligence: 'naturalist' },
    { id: 'q37', text: 'Can you easily identify and categorize different types of plants, animals, rocks, or cloud formations?', intelligence: 'naturalist' },
    { id: 'q38', text: 'Do you notice small details or changes in your natural surroundings, such as changes in the weather or seasons?', intelligence: 'naturalist' },
    { id: 'q39', text: 'Are you interested in subjects like biology, ecology, geology, or environmental conservation?', intelligence: 'naturalist' },
    { id: 'q40', text: 'Do you enjoy collecting and classifying objects from nature, like leaves, stones, or shells?', intelligence: 'naturalist' },
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
  const { user } = useUser();
  const firestore = useFirestore();


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

  const submitAssessment = async () => {
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
                
                matchScore += (studentScore / 100) * (weight ?? 0);
                totalWeight += (weight ?? 0);
            }

            const normalizedMatchScore = totalWeight > 0 ? matchScore / totalWeight : 0;

            if (normalizedMatchScore > highestMatchScore) {
                highestMatchScore = normalizedMatchScore;
                bestMatch = path;
            } else if (normalizedMatchScore === highestMatchScore) {
                if (bestMatch) {
                    const primaryMI = Object.keys(path.requiredIntelligences).sort((a,b) => (path.requiredIntelligences as any)[b] - (path.requiredIntelligences as any)[a])[0];
                    const currentPrimaryScore = miScores[primaryMI] || 0;
                    
                    const bestPrimaryMI = Object.keys(bestMatch.requiredIntelligences).sort((a,b) => (bestMatch.requiredIntelligences as any)[b] - (bestMatch.requiredIntelligences as any)[a])[0];
                    const bestPrimaryScore = miScores[bestPrimaryMI] || 0;

                    if (currentPrimaryScore > bestPrimaryScore) {
                        bestMatch = path;
                    }
                }
            }
        });

        if (!bestMatch) {
          throw new Error("Could not determine a career pathway.");
        }

        return {
            pathway: bestMatch,
            confidence: Math.round(highestMatchScore * 100)
        };
    }

    const miScores = calculateMIScores();
    const recommendation = determinePathway(miScores);
    
    // Find dominant intelligence
    const dominantIntelligence = Object.entries(miScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const assessmentResults: AssessmentResults = {
        info: studentInfo!,
        miScores: miScores,
        recommendation: recommendation,
        timestamp: new Date().toISOString()
    };
    
    if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        await setDoc(userRef, {
            assessment: {
                ...assessmentResults,
                dominantIntelligence,
            }
        }, { merge: true });
    }
    
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
    <div className="flex flex-col min-h-screen bg-background">
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
        <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-extrabold">Career Guidance Assessment</CardTitle>
                <CardDescription className="text-xl pt-2">
                    Discover your strengths and the career path that's right for you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-8 text-center">
                    Enter your details below to begin the Multiple Intelligence (MI) quiz. This will help us recommend a suitable career pathway.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
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

  const answerOptions = {
    1: 'Strongly Disagree',
    2: 'Disagree',
    3: 'Neutral',
    4: 'Agree',
    5: 'Strongly Agree',
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Question {index + 1}</CardTitle>
            <span className="text-sm text-muted-foreground">{index + 1} of {total}</span>
        </div>
        <p className="text-xl pt-4 font-semibold text-foreground">{question.text}</p>
      </CardHeader>
      <CardContent>
        <div className="my-6">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-8">
            {Object.entries(answerOptions).map(([value, label]) => (
                <Button
                    key={value}
                    variant={answer === parseInt(value) ? "default" : "outline"}
                    onClick={() => onAnswer(question.id, parseInt(value))}
                    className="flex flex-col h-auto py-3 text-center"
                >
                    <span className="text-lg font-bold">{value}</span>
                    <span className="text-xs text-wrap">{label}</span>
                </Button>
            ))}
        </div>

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
        const pageHeight = doc.internal.pageSize.getHeight();

        const addPageBackground = () => {
            const pageHeight = doc.internal.pageSize.getHeight();
            const pageWidth = doc.internal.pageSize.getWidth();

            // A subtle, professional two-tone background.
            // Top color - a very light, neutral blue-grey.
            doc.setFillColor(249, 250, 251);
            doc.rect(0, 0, pageWidth, pageHeight / 2, 'F');

            // Bottom color - a very light, calming green.
            doc.setFillColor(245, 253, 249);
            doc.rect(0, pageHeight / 2, pageWidth, pageHeight / 2, 'F');
        };

        // Draw background on the first page
        addPageBackground();
        
        const addTextAndCheckPage = (textArray: string[], x: number, spacing = 0) => {
            textArray.forEach(line => {
                if (y + 7 > doc.internal.pageSize.getHeight() - margin) {
                    doc.addPage();
                    addPageBackground(); // Add background to the new page
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
        addTextAndCheckPage(safeSplit(`Essential Subjects: ${recommendation.pathway.subjects.join(', ')}`, pageWidth - margin * 2), margin);
        y += 14;

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 128);
        doc.text('3. Multiple Intelligence Profile (MI Scores)', margin, y);
        doc.line(margin, y + 1, pageWidth - margin, y + 1);
        y += 10.5;

        doc.setFontSize(12);
        sortedMiScores.forEach(([mi, score]) => {
            if (y + 7 > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                addPageBackground();
                y = margin;
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

        if (y > pageHeight - 50) {
            doc.addPage();
            addPageBackground();
            y = margin;
        }
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
                <div className="border rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg mb-2">Student Summary</h3>
                    <p><strong>Name:</strong> {info.name}</p>
                    <p><strong>Age:</strong> {info.age}</p>
                    <p><strong>School:</strong> {info.school}</p>
                </div>

                <div className="border bg-primary/5 border-primary/20 text-primary-foreground rounded-lg p-6 mb-8 shadow-sm">
                     <h3 className="text-xl font-bold text-primary mb-2">Your Recommended Pathway is:</h3>
                     <h2 className="text-4xl font-extrabold text-primary">{recommendation.pathway.name} Pathway</h2>
                     <p className="mt-2 text-lg">Match Confidence: <strong>{recommendation.confidence}%</strong></p>
                     <p className="mt-4 text-muted-foreground">{recommendation.pathway.description}.</p>

                     <div className="mt-4">
                        <h4 className="font-semibold">Essential Subjects:</h4>
                        <p className="text-muted-foreground">{recommendation.pathway.subjects.join(', ')}</p>
                     </div>
                     <div className="mt-4">
                        <h4 className="font-semibold">Suggested Careers:</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {recommendation.pathway.careers.map(c => <span key={c} className="bg-primary/20 text-primary font-medium px-3 py-1 rounded-full text-sm">{c}</span>)}
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
                                    <Progress value={score} className="h-2" />
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t flex flex-wrap justify-center gap-4">
                    <Button onClick={downloadPDF}><Download className="mr-2" /> Download PDF Report</Button>
                    <Button variant="secondary" onClick={onRestart}><Redo className="mr-2" /> Start New Assessment</Button>
                </div>
            </CardContent>
        </Card>
    );
};

    
    
