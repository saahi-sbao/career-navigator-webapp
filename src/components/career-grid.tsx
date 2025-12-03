'use client';

import CareerCard from './career-card';
import type { CareerField } from './career-card';

const CAREER_FIELDS: CareerField[] = [
  {
    name: 'Technology & Software',
    description: 'Development, Data Science, AI/ML.',
    icon: '💻',
    theme: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconText: 'text-blue-600',
    },
  },
  {
    name: 'Finance & Investment',
    description: 'Banking, Accounting, Wealth Management.',
    icon: '📈',
    theme: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconText: 'text-green-600',
    },
  },
  {
    name: 'Healthcare & Medicine',
    description: 'Nursing, Research, Public Health.',
    icon: '⚕️',
    theme: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconText: 'text-red-600',
    },
  },
  {
    name: 'Creative & Design',
    description: 'UX/UI, Graphic Design, Media Production.',
    icon: '🎨',
    theme: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconText: 'text-yellow-600',
    },
  },
];

export default function CareerGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {CAREER_FIELDS.map((field) => (
        <CareerCard key={field.name} field={field} />
      ))}
    </div>
  );
}
