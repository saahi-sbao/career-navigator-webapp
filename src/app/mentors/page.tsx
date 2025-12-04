
'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import Header from '@/components/header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Mail, User, MapPin, Phone, LogIn, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAdmin } from '@/hooks/use-admin';

interface Mentor {
    id: string;
    name: string;
    email: string;
    phone?: string;
    county: string;
}

export default function MentorsPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { isAdmin } = useAdmin();

    // Only create the query if the user is logged in.
    const mentorsQuery = useMemoFirebase(
        () => (user ? query(collection(firestore, 'mentors')) : null),
        [user, firestore]
    );
    const { data: mentors, isLoading: mentorsLoading } = useCollection<Mentor>(mentorsQuery);
    
    const isLoading = isUserLoading || (user && mentorsLoading);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            );
        }

        if (!user) {
             return (
                <Card className="text-center py-12">
                    <CardContent className="flex flex-col items-center gap-4">
                        <LogIn className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Please log in to view available mentors.</p>
                        <Button asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        if (!mentors || mentors.length === 0) {
            return (
                 <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No mentors are available at this time. Please check back later.</p>
                    </CardContent>
                </Card>
            );
        }
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mentors.map((mentor) => (
                    <Card key={mentor.id} className="flex flex-col">
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4 ring-2 ring-primary ring-offset-2">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${mentor.id}`} alt={mentor.name} />
                                <AvatarFallback>
                                    <User className="h-12 w-12" />
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle>{mentor.name}</CardTitle>
                            <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                <MapPin className="h-4 w-4" />
                                <span>{mentor.county}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2 text-center">
                            <a href={`mailto:${mentor.email}`} className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
                                <Mail className="h-4 w-4" />
                                <span>{mentor.email}</span>
                            </a>
                            {mentor.phone && (
                                <a href={`tel:${mentor.phone}`} className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
                                    <Phone className="h-4 w-4" />
                                    <span>{mentor.phone}</span>
                                </a>
                            )}
                        </CardContent>
                        <CardFooter className="flex-col items-stretch">
                            <a href={`mailto:${mentor.email}`}>
                                <Button className="w-full">
                                    <Mail className="mr-2 h-4 w-4" /> Contact
                                </Button>
                            </a>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-secondary/20">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">Connect with a Mentor</h1>
                    <p className="mt-4 text-xl text-muted-foreground">
                        Get guidance and advice from experienced professionals in various fields.
                    </p>
                </div>
                {renderContent()}
            </main>
            {isAdmin && (
                <Button asChild className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" aria-label="Add Mentor">
                    <Link href="/admin/mentors">
                        <Plus className="h-8 w-8" />
                    </Link>
                </Button>
            )}
        </div>
    );
}
