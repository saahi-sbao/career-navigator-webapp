'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { CareerField } from './career-card';
import { BrainCircuit, Book, Briefcase } from 'lucide-react';

type CareerDetailsDialogProps = {
  field: CareerField | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function CareerDetailsDialog({ field, isOpen, onClose }: CareerDetailsDialogProps) {
  if (!field) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <span className="text-4xl">{field.icon}</span>
            <span>{field.name}</span>
          </DialogTitle>
          <DialogDescription className="pt-2">{field.details}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Main Subjects
            </h3>
            <div className="flex flex-wrap gap-2">
              {field.mainSubjects.map(subject => (
                <Badge key={subject} variant="secondary">{subject}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Suggested Careers
            </h3>
            <div className="flex flex-wrap gap-2">
              {field.careers.map(career => (
                <Badge key={career} variant="outline">{career}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Dominant Intelligence
            </h3>
            <Badge variant="default">{field.dominantIntelligence}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
