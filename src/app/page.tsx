import CareerGrid from '@/components/career-grid';
import Suggestions from '@/components/suggestions';

export default function Home() {
  return (
    <div className="p-4 sm:p-8 min-h-screen flex flex-col items-center">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl w-full mt-8">
        <h1 className="text-4xl font-extrabold text-primary-dark mb-2">
          Career Builder & Explorer (CBE)
        </h1>
        <p className="text-sm font-medium text-gray-500 mb-6">
          Navigate your career path with AI-powered suggestions.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">
          Explore Career Fields
        </h2>

        <CareerGrid />
        <Suggestions />
      </div>
    </div>
  );
}
