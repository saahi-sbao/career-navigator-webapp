'use client';

import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { cn } from '@/lib/utils';
import { Check, Plus, Loader2 } from 'lucide-react';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import { useEffect, useState } from 'react';

export type CareerField = {
  name: string;
  icon: LucideIcon;
  themeColor: `chart-${1 | 2 | 3 | 4 | 5}`;
};

type CareerCardProps = {
  field: CareerField;
};

export default function CareerCard({ field }: CareerCardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isProcessing, setIsProcessing] = useState(false);

  const interestsCol = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/careerInterests`) : null),
    [user, firestore]
  );
  const { data: interests, isLoading: interestsLoading } = useCollection(interestsCol);

  const isSelected = interests?.some(interest => interest.id === field.name);

  const handleSelect = async () => {
    if (!user || !firestore) return;
    setIsProcessing(true);
    const interestRef = doc(firestore, `users/${user.uid}/careerInterests`, field.name);
    
    try {
      if (!isSelected) {
        await setDoc(interestRef, {
          id: field.name,
          userId: user.uid,
          careerField: field.name,
        });
      } else {
        await deleteDoc(interestRef);
      }
    } catch (e) {
      console.error("Error updating interest:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = interestsLoading || isProcessing;

  return (
    <Card 
      className={cn(
        'transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col overflow-hidden',
        isSelected && 'ring-2 ring-primary'
      )}
    >
      <CardHeader className="flex-row items-center gap-4 space-y-0">
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `hsl(var(--${field.themeColor}))` }}
        >
          <field.icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle>{field.name}</CardTitle>
      </CardHeader>
      <CardFooter className="mt-auto pt-4">
        <Button
          onClick={handleSelect}
          disabled={!user || isLoading}
          className="w-full"
          variant={isSelected ? "secondary" : "default"}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isSelected ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isSelected ? 'Selected' : 'Select Interest'}
        </Button>
      </CardFooter>
    </Card>
  );
}
