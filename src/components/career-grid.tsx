'use client';

import { useState } from 'react';
import CareerCard, { type CareerField } from './career-card';
import CareerDetailsDialog from './career-details-dialog';

const CAREER_FIELDS: CareerField[] = [
  {
    name: 'Technology & Software',
    description: 'Development, Data Science, AI/ML.',
    icon: '💻',
    details: 'This field involves designing, developing, and maintaining software, applications, and systems. It covers a vast range of areas from web development and mobile apps to artificial intelligence and data science.',
    mainSubjects: ['Computer Science', 'Mathematics', 'Physics', 'Logic'],
    dominantIntelligence: 'Logical-Mathematical',
    careers: ['Software Engineer', 'Data Scientist', 'AI/ML Specialist', 'Cybersecurity Analyst', 'Cloud Architect'],
  },
  {
    name: 'Finance & Investment',
    description: 'Banking, Accounting, Wealth Management.',
    icon: '📈',
    details: 'This sector deals with the management of money, banking, investments, and credit. Professionals in this field analyze financial markets, manage assets, and provide financial advice to individuals and organizations.',
    mainSubjects: ['Economics', 'Accounting', 'Mathematics', 'Business Studies'],
    dominantIntelligence: 'Logical-Mathematical',
    careers: ['Financial Analyst', 'Investment Banker', 'Accountant', 'Actuary', 'Wealth Manager'],
  },
  {
    name: 'Healthcare & Medicine',
    description: 'Nursing, Research, Public Health.',
    icon: '⚕️',
    details: 'This vital field is focused on diagnosing, treating, and preventing illness, disease, and injury. It includes a wide variety of roles, from direct patient care to medical research and public health policy.',
    mainSubjects: ['Biology', 'Chemistry', 'Anatomy', 'Psychology'],
    dominantIntelligence: 'Naturalist',
    careers: ['Doctor', 'Nurse', 'Pharmacist', 'Medical Researcher', 'Public Health Officer'],
  },
  {
    name: 'Creative & Design',
    description: 'UX/UI, Graphic Design, Media Production.',
    icon: '🎨',
    details: 'This field is all about visual communication and aesthetics. It includes creating graphics, designing user interfaces for websites and apps, producing videos, and developing brand identities.',
    mainSubjects: ['Art & Design', 'Media Studies', 'Psychology', 'Computer Graphics'],
    dominantIntelligence: 'Spatial',
    careers: ['Graphic Designer', 'UX/UI Designer', 'Animator', 'Photographer', 'Art Director'],
  },
  {
    name: 'Education & Training',
    description: 'Teaching, corporate training, curriculum.',
    icon: '🎓',
    details: 'This sector focuses on facilitating learning and knowledge acquisition. It ranges from teaching in schools and universities to developing corporate training programs and creating educational content.',
    mainSubjects: ['Pedagogy', 'Psychology', 'Specific Subject Matter', 'Communication'],
    dominantIntelligence: 'Interpersonal',
    careers: ['Teacher', 'Lecturer', 'Corporate Trainer', 'Instructional Designer', 'Education Administrator'],
  },
  {
    name: 'Law & Public Policy',
    description: 'Legal services, government, public admin.',
    icon: '⚖️',
    details: 'This field involves the system of rules that a society or government develops in order to deal with crime, business agreements, and social relationships. It also includes the creation and implementation of government policies.',
    mainSubjects: ['History', 'Government', 'Ethics', 'Economics'],
    dominantIntelligence: 'Linguistic',
    careers: ['Lawyer', 'Paralegal', 'Policy Analyst', 'Diplomat', 'Lobbyist'],
  },
  {
    name: 'Skilled Trades & Construction',
    description: 'Electrician, plumbing, construction mgmt.',
    icon: '🛠️',
    details: 'This hands-on field involves building and maintaining infrastructure. It includes specialized jobs like electricians, plumbers, carpenters, and welders, as well as construction management and project supervision.',
    mainSubjects: ['Technical Drawing', 'Physics', 'Mathematics', 'Workshop Practice'],
    dominantIntelligence: 'Bodily-Kinesthetic',
    careers: ['Electrician', 'Plumber', 'Carpenter', 'Construction Manager', 'Welder'],
  },
  {
    name: 'Marketing & Sales',
    description: 'Digital marketing, advertising, sales.',
    icon: '📢',
    details: 'This field focuses on promoting and selling products or services. It includes activities like market research, advertising, content creation, social media management, and direct sales.',
    mainSubjects: ['Communication', 'Business', 'Psychology', 'Media Studies'],
    dominantIntelligence: 'Interpersonal',
    careers: ['Marketing Manager', 'SEO Specialist', 'Sales Representative', 'Public Relations Manager', 'Brand Manager'],
  },
  {
    name: 'Hospitality & Tourism',
    description: 'Hotel management, event planning, travel.',
    icon: '🏨',
    details: 'This service industry includes lodging, food and drink service, event planning, theme parks, transportation, cruise lines, and other services for travelers and guests. Customer service is paramount.',
    mainSubjects: ['Business Management', 'Communication', 'Geography', 'Foreign Languages'],
    dominantIntelligence: 'Interpersonal',
    careers: ['Hotel Manager', 'Event Planner', 'Travel Agent', 'Chef', 'Tour Guide'],
  },
  {
    name: 'Agriculture & Environmental',
    description: 'Farming, conservation, sustainability.',
    icon: '🌿',
    details: 'This field is concerned with the cultivation of land, raising crops, and feeding, breeding, and raising livestock. It also includes environmental science, conservation, and sustainable resource management.',
    mainSubjects: ['Biology', 'Environmental Science', 'Chemistry', 'Economics'],
    dominantIntelligence: 'Naturalist',
    careers: ['Agronomist', 'Environmental Scientist', 'Farm Manager', 'Conservation Officer', 'Food Scientist'],
  },
  {
    name: 'Media & Communication',
    description: 'Journalism, public relations, broadcasting.',
    icon: '📡',
    details: 'This broad field covers the creation and dissemination of information to a large audience. It includes journalism, public relations, film and television production, and digital media.',
    mainSubjects: ['Language & Literature', 'Sociology', 'Political Science', 'Media Studies'],
    dominantIntelligence: 'Linguistic',
    careers: ['Journalist', 'Public Relations Specialist', 'Broadcast Producer', 'Content Strategist', 'Filmmaker'],
  },
  {
    name: 'Human Services & Counseling',
    description: 'Social work, counseling, community support.',
    icon: '❤️',
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
