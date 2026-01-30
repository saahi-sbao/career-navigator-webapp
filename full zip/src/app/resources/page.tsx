import Header from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Globe, Video } from 'lucide-react';

const resources = [
  {
    title: 'Kenya Universities and Colleges Central Placement Service (KUCCPS)',
    description: 'The official portal for university and college placements in Kenya. Explore courses and institutions.',
    link: 'https://kuccps.net/',
    icon: <Globe className="h-8 w-8 text-primary" />,
    type: 'Official Portal'
  },
  {
    title: 'Career Options Kenya',
    description: 'A comprehensive guide to various careers available in the Kenyan market, including job descriptions and required skills.',
    link: 'https://www.careeroptionsafrica.com/',
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    type: 'Career Guide'
  },
  {
    title: 'Guide to the Competency-Based Curriculum (CBC)',
    description: 'An overview of the CBC system by the Kenya Institute of Curriculum Development (KICD).',
    link: 'https://kicd.ac.ke/cbc-materials/curriculum-designs/',
    icon: <Globe className="h-8 w-8 text-primary" />,
    type: 'Official Guide'
  },
  {
    title: 'Top Careers in Kenya for the Next Decade',
    description: 'A video exploring future-proof careers in Kenya, focusing on technology, healthcare, and green energy.',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    icon: <Video className="h-8 w-8 text-primary" />,
    type: 'Video'
  },
]

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Resources</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Explore these useful links and guides to help you on your career journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <a href={resource.link} target="_blank" rel="noopener noreferrer" key={index} className="block hover:-translate-y-1 transition-transform">
              <Card className="h-full hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  {resource.icon}
                  <div>
                    <CardTitle>{resource.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{resource.description}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
