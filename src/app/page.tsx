import CareerGrid from '@/components/career-grid';
import Suggestions from '@/components/suggestions';
import AuthButton from '@/components/auth-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-4 sm:p-8 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-end mb-4">
        <AuthButton />
      </div>
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl font-extrabold text-primary-dark mb-2">
          Career Builder & Explorer (CBE)
        </h1>
        <p className="text-sm font-medium text-gray-500 mb-6">
          Navigate your career path with AI-powered suggestions.
        </p>

        <div className="my-8 text-center">
          <Button asChild size="lg">
            <Link href="/assessment">Start Career Assessment</Link>
          </Button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">
          Explore Career Fields
        </h2>

        <CareerGrid />
        <Suggestions />
      </div>
    </div>
  );
}
