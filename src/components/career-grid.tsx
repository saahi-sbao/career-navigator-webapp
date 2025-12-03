'use client';

import { CodeXml, Palette, Megaphone, DatabaseZap, BrainCircuit, Landmark } from 'lucide-react';
import CareerCard from './career-card';
import type { CareerField } from './career-card';

const CAREER_FIELDS: CareerField[] = [
  { name: 'Software Engineering', icon: CodeXml, themeColor: 'chart-1' },
  { name: 'UI/UX Design', icon: Palette, themeColor: 'chart-5' },
  { name: 'Digital Marketing', icon: Megaphone, themeColor: 'chart-2' },
  { name: 'Data Science', icon: DatabaseZap, themeColor: 'chart-4' },
  { name: 'AI & ML', icon: BrainCircuit, themeColor: 'chart-3' },
  { name: 'Finance', icon: Landmark, themeColor: 'chart-1' },
];

export default function CareerGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {CAREER_FIELDS.map((field) => (
        <CareerCard key={field.name} field={field} />
      ))}
    </div>
  );
}
