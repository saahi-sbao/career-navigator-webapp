
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import Link from 'next/link';

import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, CheckCircle, ArrowRight, BookOpen, Users, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import TimeTable from '@/components/time-table';


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );
  const { data: userData, isLoading: isUserDocLoading } = useDoc(userDocRef);

  const interestsColRef = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/careerInterests`) : null),
    [user, firestore]
  );
  const { data: careerInterests, isLoading: areInterestsLoading } = useCollection(interestsColRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || isUserDocLoading || areInterestsLoading;

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const displayName = user.displayName || userData?.username || 'Student';
  const hasCompletedAssessment = !!userData?.assessment;

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback><User /></AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {displayName}!</h1>
                <p className="text-muted-foreground">Here's a summary of your progress.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- Left Column --- */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className={`h-6 w-6 ${hasCompletedAssessment ? 'text-green-500' : 'text-muted-foreground'}`} />
                            Career Assessment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {hasCompletedAssessment ? (
                             <div>
                                <p className="text-lg text-muted-foreground mb-4">You have completed the assessment. Your recommended pathway is:</p>
                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <h3 className="text-2xl font-bold text-primary">{userData?.assessment.recommendation.pathway.name}</h3>
                                    <p className="font-semibold">{userData?.assessment.dominantIntelligence.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())} Intelligence</p>
                                </div>
                             </div>
                        ) : (
                            <div>
                                <p className="text-lg text-muted-foreground mb-4">You haven't completed the career assessment yet. Discover your strengths and get a personalized career pathway recommendation.</p>
                                <Button asChild>
                                    <Link href="/assessment">Take Assessment <ArrowRight className="ml-2 h-4 w-4"/></Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {hasCompletedAssessment && userData?.assessment && <TimeTable user={user} pathway={userData.assessment.recommendation.pathway} />}

                <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                            <Star className="h-6 w-6 text-yellow-500" />
                            Your Saved Career Interests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {careerInterests && careerInterests.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {careerInterests.map(interest => (
                                    <Badge key={interest.id} variant="secondary" className="text-base px-3 py-1">{interest.careerField}</Badge>
                                ))}
                            </div>
                        ) : (
                             <div>
                                <p className="text-muted-foreground mb-4">You have not saved any career interests yet. Explore different fields to get personalized suggestions.</p>
                                 <Button variant="outline" asChild>
                                    <Link href="/#career-fields">Explore Careers <BookOpen className="ml-2 h-4 w-4"/></Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            {/* --- Right Column / Next Steps --- */}
            <div className="space-y-8">
                <Card className="bg-primary/5 border-primary/20">
                     <CardHeader>
                        <CardTitle>Next Steps</CardTitle>
                        <CardDescription>Continue your career journey.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!hasCompletedAssessment ? (
                           <Button asChild className="w-full justify-start">
                             <Link href="/assessment"><ArrowRight className="mr-2 h-4 w-4" />Take the MI Assessment</Link>
                           </Button>
                        ) : (
                            <>
                                 <Button asChild variant="secondary" className="w-full justify-start">
                                    <Link href="/#career-fields"><BookOpen className="mr-2 h-4 w-4" />Explore Career Fields</Link>
                                </Button>
                                 <Button asChild className="w-full justify-start">
                                    <Link href="/subject-combination"><Users className="mr-2 h-4 w-4" />Subject Explorer</Link>
                                </Button>
                            </>
                        )}
                       
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
