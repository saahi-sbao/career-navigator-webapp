'use client';

import { useState } from 'react';
import CareerCard, { type CareerField } from './career-card';
import CareerDetailsDialog from './career-details-dialog';

const CAREER_FIELDS: CareerField[] = [
  {
    name: 'Technology & Software',
    description: 'Development, Data Science, AI/ML.',
    icon: '💻',
    theme: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      iconText: 'text-blue-600 dark:text-blue-400',
    },
    details: 'This field involves designing, developing, and maintaining software, applications, and systems. It covers a vast range of areas from web development and mobile apps to artificial intelligence and data science.',
    mainSubjects: ['Computer Science', 'Mathematics', 'Physics', 'Logic'],
    dominantIntelligence: 'Logical-Mathematical',
    careers: ['Software Engineer', 'Data Scientist', 'AI/ML Specialist', 'Cybersecurity Analyst', 'Cloud Architect'],
  },
  {
    name: 'Finance & Investment',
    description: 'Banking, Accounting, Wealth Management.',
    icon: '📈',
    theme: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      iconText: 'text-green-600 dark:text-green-400',
    },
    details: 'This sector deals with the management of money, banking, investments, and credit. Professionals in this field analyze financial markets, manage assets, and provide financial advice to individuals and organizations.',
    mainSubjects: ['Economics', 'Accounting', 'Mathematics', 'Business Studies'],
    dominantIntelligence: 'Logical-Mathematical',
    careers: ['Financial Analyst', 'Investment Banker', 'Accountant', 'Actuary', 'Wealth Manager'],
  },
  {
    name: 'Healthcare & Medicine',
    description: 'Nursing, Research, Public Health.',
    icon: '⚕️',
    theme: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      iconText: 'text-red-600 dark:text-red-400',
    },
    details: 'This vital field is focused on diagnosing, treating, and preventing illness, disease, and injury. It includes a wide variety of roles, from direct patient care to medical research and public health policy.',
    mainSubjects: ['Biology', 'Chemistry', 'Anatomy', 'Psychology'],
    dominantIntelligence: 'Naturalist',
    careers: ['Doctor', 'Nurse', 'Pharmacist', 'Medical Researcher', 'Public Health Officer'],
  },
  {
    name: 'Creative & Design',
    description: 'UX/UI, Graphic Design, Media Production.',
    icon: '🎨',
    theme: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      iconText: 'text-yellow-600 dark:text-yellow-400',
    },
    details: 'This field is all about visual communication and aesthetics. It includes creating graphics, designing user interfaces for websites and apps, producing videos, and developing brand identities.',
    mainSubjects: ['Art & Design', 'Media Studies', 'Psychology', 'Computer Graphics'],
    dominantIntelligence: 'Spatial',
    careers: ['Graphic Designer', 'UX/UI Designer', 'Animator', 'Photographer', 'Art Director'],
  },
  {
    name: 'Education & Training',
    description: 'Teaching, corporate training, curriculum.',
    icon: '🎓',
    theme: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-800 dark:text-purple-200',
      iconText: 'text-purple-600 dark:text-purple-400',
    },
    details: 'This sector focuses on facilitating learning and knowledge acquisition. It ranges from teaching in schools and universities to developing corporate training programs and creating educational content.',
    mainSubjects: ['Pedagogy', 'Psychology', 'Specific Subject Matter', 'Communication'],
    dominantIntelligence: 'Interpersonal',
    careers: ['Teacher', 'Lecturer', 'Corporate Trainer', 'Instructional Designer', 'Education Administrator'],
  },
  {
    name: 'Law & Public Policy',
    description: 'Legal services, government, public admin.',
    icon: '⚖️',
    theme: {
      bg: 'bg-gray-100 dark:bg-gray-800/50',
      border: 'border-gray-300 dark:border-gray-700',
      text: 'text-gray-800 dark:text-gray-200',
      iconText: 'text-gray-600 dark:text-gray-400',
    },
    details: 'This field involves the system of rules that a society or government develops in order to deal with crime, business agreements, and social relationships. It also includes the creation and implementation of government policies.',
    mainSubjects: ['History', 'Government', 'Ethics', 'Economics'],
    dominantIntelligence: 'Linguistic',
    careers: ['Lawyer', 'Paralegal', 'Policy Analyst', 'Diplomat', 'Lobbyist'],
  },
  {
    name: 'Skilled Trades & Construction',
    description: 'Electrician, plumbing, construction mgmt.',
    icon: '🛠️',
    theme: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-800 dark:text-orange-200',
      iconText: 'text-orange-600 dark:text-orange-400',
    },
    details: 'This hands-on field involves building and maintaining infrastructure. It includes specialized jobs like electricians, plumbers, carpenters, and welders, as well as construction management and project supervision.',
    mainSubjects: ['Technical Drawing', 'Physics', 'Mathematics', 'Workshop Practice'],
    dominantIntelligence: 'Bodily-Kinesthetic',
    careers: ['Electrician', 'Plumber', 'Carpenter', 'Construction Manager', 'Welder'],
  },
  {
    name: 'Marketing & Sales',
    description: 'Digital marketing, advertising, sales.',
    icon: '📢',
    theme: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      border: 'border-pink-200 dark:border-pink-800',
      text: 'text-pink-800 dark:text-pink-200',
      iconText: 'text-pink-600 dark:text-pink-400',
    },
    details: 'This field focuses on promoting and selling products or services. It includes activities like market research, advertising, content creation, social media management, and direct sales.',
    mainSubjects: ['Communication', 'Business', 'Psychology', 'Media Studies'],
    dominantIntelligence: 'Interpersonal',
    careers: ['Marketing Manager', 'SEO Specialist', 'Sales Representative', 'Public Relations Manager', 'Brand Manager'],
  },
  {
    name: 'Hospitality & Tourism',
    description: 'Hotel management, event planning, travel.',
    icon: '🏨',
    theme: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      border: 'border-cyan-200 dark:border-cyan-800',
      text: 'text-cyan-800 dark:text-cyan-200',
      iconText: 'text-cyan-600 dark:text-cyan-400',
    },
    details: 'This service industry includes lodging, food and drink service, event planning, theme parks, transportation, cruise lines, and other services for travelers and guests. Customer service is paramount.',
    mainSubjects: ['Business Management', 'Communication', 'Geography', 'Foreign Languages'],
    dominantIntelligence: 'Interpersonal',
    careers: ['Hotel Manager', 'Event Planner', 'Travel Agent', 'Chef', 'Tour Guide'],
  },
  {
    name: 'Agriculture & Environmental',
    description: 'Farming, conservation, sustainability.',
    icon: '🌿',
    theme: {
      bg: 'bg-lime-50 dark:bg-lime-900/20',
      border: 'border-lime-200 dark:border-lime-800',
      text: 'text-lime-800 dark:text-lime-200',
      iconText: 'text-lime-600 dark:text-lime-400',
    },
    details: 'This field is concerned with the cultivation of land, raising crops, and feeding, breeding, and raising livestock. It also includes environmental science, conservation, and sustainable resource management.',
    mainSubjects: ['Biology', 'Environmental Science', 'Chemistry', 'Economics'],
    dominantIntelligence: 'Naturalist',
    careers: ['Agronomist', 'Environmental Scientist', 'Farm Manager', 'Conservation Officer', 'Food Scientist'],
  },
  {
    name: 'Media & Communication',
    description: 'Journalism, public relations, broadcasting.',
    icon: '📡',
    theme: {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
      border: 'border-fuchsia-200 dark:border-fuchsia-800',
      text: 'text-fuchsia-800 dark:text-fuchsia-200',
      iconText: 'text-fuchsia-600 dark:text-fuchsia-400',
    },
    details: 'This broad field covers the creation and dissemination of information to a large audience. It includes journalism, public relations, film and television production, and digital media.',
    mainSubjects: ['Language & Literature', 'Sociology', 'Political Science', 'Media Studies'],
    dominantIntelligence: 'Linguistic',
    careers: ['Journalist', 'Public Relations Specialist', 'Broadcast Producer', 'Content Strategist', 'Filmmaker'],
  },
  {
    name: 'Human Services & Counseling',
    description: 'Social work, counseling, community support.',
    icon: '❤️',
    theme: {
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200 dark:border-rose-800',
      text: 'text-rose-800 dark:text-rose-200',
      iconText: 'text-rose-600 dark:text-rose-400',
    },
    details: 'This field is dedicated to helping individuals and communities function effectively. It includes roles like social workers, counselors, and community outreach coordinators who provide support and resources to those in need.',
    mainSubjects: ['Psychology', 'Sociology', 'Ethics', 'Human Development'],
    dominantIntelligence: 'Intrapersonal',
    careers: ['Social Worker', 'Therapist/Counselor', 'Community Organizer', 'Non-profit Director', 'Rehabilitation Specialist'],
  },
];

export default function CareerGrid() {
  const [selectedField, setSelectedField] = useState<CareerField | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {CAREER_FIELDS.map(field => (
          <CareerCard
            key={field.name}
            field={field}
            onOpenDetails={() => setSelectedField(field)}
          />
        ))}
      </div>
      {selectedField && (
        <CareerDetailsDialog
          field={selectedField}
          isOpen={!!selectedField}
          onClose={() => setSelectedField(null)}
        />
      )}
    </>
  );
}
