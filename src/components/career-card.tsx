'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { Check, Plus, Loader2, BookOpen } from 'lucide-react';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import { useState } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export type CareerField = {
  name: string;
  description: string;
  icon: string;
  theme: {
    bg: string;
    border: string;
    text: string;
    iconText: string;
  };
  details: string;
  mainSubjects: string[];
  dominantIntelligence: string;
};

type CareerCardProps = {
  field: CareerField;
  onOpenDetails: () => void;
};

export default function CareerCard({ field, onOpenDetails }: CareerCardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isProcessing, setIsProcessing] = useState(false);

  const interestsCol = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/careerInterests`) : null),
    [user, firestore]
  );
  const { data: interests, isLoading: interestsLoading } = useCollection(interestsCol);

  const isSelected = interests?.some(interest => interest.id === field.name);

  const handleSelectToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (!user || !firestore) return;
    setIsProcessing(true);
    const interestRef = doc(firestore, `users/${user.uid}/careerInterests`, field.name);

    if (!isSelected) {
      setDoc(interestRef, {
        id: field.name,
        userId: user.uid,
        careerField: field.name,
      }).catch(err => {
        const contextualError = new FirestorePermissionError({
          operation: 'create',
          path: interestRef.path,
          requestResourceData: {
            id: field.name,
            userId: user.uid,
            careerField: field.name,
          }
        });
        errorEmitter.emit('permission-error', contextualError);
        console.error("Error creating interest:", err);
      }).finally(() => setIsProcessing(false));
    } else {
      deleteDoc(interestRef).catch(err => {
        const contextualError = new FirestorePermissionError({
          operation: 'delete',
          path: interestRef.path,
        });
        errorEmitter.emit('permission-error', contextualError);
        console.error("Error deleting interest:", err);
      }).finally(() => setIsProcessing(false));
    }
  };

  const isLoading = interestsLoading || isProcessing;

  return (
    <Card
      className={cn(
        'transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col overflow-hidden p-5 shadow-md relative',
        field.theme.bg,
        field.theme.border,
        isSelected && 'ring-4 ring-primary'
      )}
      onClick={onOpenDetails}
    >
      <div className="flex items-center space-x-4">
        <span className={cn('text-4xl', field.theme.iconText)}>{field.icon}</span>
        <div>
          <p className={cn('font-bold text-lg', field.theme.text)}>{field.name}</p>
          <p className="text-sm text-muted-foreground">{field.description}</p>
        </div>
      </div>
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-accent/50" onClick={onOpenDetails}>
            <BookOpen className="h-4 w-4" />
            <span className="sr-only">View Details</span>
        </Button>
        <Button
            variant={isSelected ? 'secondary' : 'outline'}
            size="icon"
            className="h-8 w-8"
            onClick={handleSelectToggle}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="animate-spin" /> : isSelected ? <Check /> : <Plus />}
            <span className="sr-only">{isSelected ? 'Remove interest' : 'Add interest'}</span>
        </Button>
      </div>
    </Card>
  );
}
