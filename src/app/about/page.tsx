import Header from '@/components/header';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-center">About The Career Guidance System</h1>
          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              This Career Guidance System is a modern tool designed to assist students within Kenya's Competency-Based Curriculum (CBE) framework. Our primary goal is to empower learners to discover their innate interests and aptitudes, providing a clear and insightful path toward a fulfilling career.
            </p>
            <p>
              By leveraging established educational theories like Howard Gardner's Multiple Intelligences, our system offers a simple yet scientifically-grounded assessment. The results provide students with personalized career pathway suggestions that are carefully aligned with their natural talents and strengths.
            </p>
            <p>
              Whether you are a student exploring the exciting possibilities that lie ahead, a teacher guiding your class toward their future, or a parent supporting your child's journey, this system serves as an invaluable starting point for meaningful career conversations and planning.
            </p>
            <p className="font-semibold text-foreground">
              Our mission is to illuminate the path for every student, helping them navigate their educational journey with confidence and purpose.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
