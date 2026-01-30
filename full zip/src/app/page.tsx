
import Header from '@/components/header';
import CareerGrid from '@/components/career-grid';
import Suggestions from '@/components/suggestions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, BarChart2, MessageSquare, Briefcase, Bot, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Assessments',
    description: 'Our Multiple Intelligence quiz accurately recommends a career pathway tailored to your strengths.',
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: 'Explore Career Fields',
    description: 'Browse a wide variety of career fields to discover your passions and save your interests.',
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    title: 'Personalized Dashboard',
    description: 'Track your assessment results, log study time, and get AI recommendations all in one place.',
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Mentor Connections',
    description: 'Connect with experienced professionals in your field of interest for guidance and advice.',
  },
];

const testimonials = [
  {
    name: 'Jane Doe',
    role: 'Student, Kenya High School',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    text: '“The assessment was surprisingly accurate! It helped me understand my strengths and gave me confidence in choosing the STEM pathway.”',
  },
  {
    name: 'John Omondi',
    role: 'Teacher, Alliance High School',
    avatar: 'https://i.pravatar.cc/150?u=john',
    text: '“A fantastic tool for career guidance. I recommend it to all my students to help them think about their future in a structured way.”',
  },
  {
    name: 'Amina Yusuf',
    role: 'Parent',
    avatar: 'https://i.pravatar.cc/150?u=amina',
    text: '“My son was unsure about his career choices, but this platform gave him clear direction and valuable resources to explore.”',
  },
];

const faqs = [
    {
        question: "What is the Career Navigator?",
        answer: "The Career Navigator is a platform designed for the Kenyan Competency-Based Education (CBE) system. It uses an AI-powered assessment based on Multiple Intelligence theory to help students identify their strengths and recommend suitable career pathways (STEM, Arts & Sports Science, or Social Sciences)."
    },
    {
        question: "Who can use this platform?",
        answer: "The platform is designed for students who are exploring their career options, as well as teachers and career counselors who are guiding them. Parents can also use the resources to support their children's career exploration journey."
    },
    {
        question: "How does the assessment work?",
        answer: "The assessment consists of a 40-question quiz that evaluates you on 8 different types of intelligence (e.g., Logical-Mathematical, Linguistic, Spatial). Based on your scores, our system matches your profile to the most suitable senior school pathway and suggests potential careers."
    },
    {
        question: "Is the assessment free?",
        answer: "Yes, the core assessment and pathway recommendation are completely free to use. Our goal is to make career guidance accessible to all students in Kenya."
    }
]


export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 py-16 md:py-24 lg:py-32 text-center" id="home">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              Discover Your Future Career Path
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Navigate your journey from student to professional with our AI-powered guidance system, built for the Kenyan CBE curriculum.
            </p>
            <div className="space-x-4 mt-6">
              <Button asChild size="lg">
                  <Link href="/assessment">Start Free Assessment</Link>
              </Button>
               <Button asChild size="lg" variant="outline">
                  <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary/50">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Why Choose Career Navigator?</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Everything you need to make informed career decisions.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center">
                            <CardHeader className="items-center">
                                {feature.icon}
                                <CardTitle className="mt-4">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">What Our Users Say</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Real stories from students, teachers, and parents.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="flex flex-col">
                           <CardContent className="pt-6">
                                <div className="flex mb-4">
                                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />)}
                                </div>
                                <p className="text-muted-foreground flex-grow">"{testimonial.text}"</p>
                            </CardContent>
                             <CardHeader className="flex-row gap-4 items-center pt-4">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>


        {/* Career Fields Section */}
        <section
          id="career-fields"
          className="container space-y-6 bg-slate-50/50 dark:bg-transparent py-8 md:py-12 lg:py-24 rounded-t-2xl"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
              Explore Career Fields
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Select the fields you are interested in to get personalized suggestions.
            </p>
          </div>
          <CareerGrid />
          <Suggestions />
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24 bg-secondary/50">
            <div className="container max-w-4xl">
                 <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about the Career Navigator platform.</p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index + 1}`}>
                            <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
      </main>
    </>
  );
}
