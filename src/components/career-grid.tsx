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
  {
    name: 'Education & Training',
    description: 'Teaching, corporate training, curriculum.',
    icon: '🎓',
    theme: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      iconText: 'text-purple-600',
    },
  },
  {
    name: 'Law & Public Policy',
    description: 'Legal services, government, public admin.',
    icon: '⚖️',
    theme: {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-800',
      iconText: 'text-gray-600',
    },
  },
  {
    name: 'Skilled Trades & Construction',
    description: 'Electrician, plumbing, construction mgmt.',
    icon: '🛠️',
    theme: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      iconText: 'text-orange-600',
    },
  },
  {
    name: 'Marketing & Sales',
    description: 'Digital marketing, advertising, sales.',
    icon: '📢',
    theme: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-800',
      iconText: 'text-pink-600',
    },
  },
  {
    name: 'Hospitality & Tourism',
    description: 'Hotel management, event planning, travel.',
    icon: '🏨',
    theme: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      text: 'text-cyan-800',
      iconText: 'text-cyan-600',
    },
  },
  {
    name: 'Agriculture & Environmental',
    description: 'Farming, conservation, sustainability.',
    icon: '🌿',
    theme: {
      bg: 'bg-lime-50',
      border: 'border-lime-200',
      text: 'text-lime-800',
      iconText: 'text-lime-600',
    },
  },
  {
    name: 'Media & Communication',
    description: 'Journalism, public relations, broadcasting.',
    icon: '📡',
    theme: {
      bg: 'bg-fuchsia-50',
      border: 'border-fuchsia-200',
      text: 'text-fuchsia-800',
      iconText: 'text-fuchsia-600',
    },
  },
  {
    name: 'Human Services & Counseling',
    description: 'Social work, counseling, community support.',
    icon: '❤️',
    theme: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-800',
      iconText: 'text-rose-600',
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
