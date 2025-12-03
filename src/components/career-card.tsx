'use client';

import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Check, Plus, Loader2 } from 'lucide-react';

export type CareerField = {
  name: string;
  icon: LucideIcon;
  themeColor: `chart-${1 | 2 | 3 | 4 | 5}`;
};

type CareerCardProps = {
  field: CareerField;
};

export default function CareerCard({ field }: CareerCardProps) {
  const { user, addInterest, isLoading } = useUser();
  const isSelected = user?.interests.includes(field.name);

  const handleSelect = () => {
    if (!isSelected) {
      addInterest(field.name);
    }
  };

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
          disabled={!user || !!isSelected || isLoading}
          className="w-full"
          variant={isSelected ? "secondary" : "default"}
        >
          {isLoading && !isSelected ? (
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
