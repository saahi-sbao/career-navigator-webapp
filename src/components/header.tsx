import AuthButton from './auth-button';

export default function Header() {
  return (
    <header className="bg-primary text-white shadow-md py-6 px-4">
      <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Career Guidance System</h1>
            <p className="subtitle text-sm opacity-80 mt-1">Multiple Intelligence Assessment</p>
          </div>
          <AuthButton />
      </div>
    </header>
  );
}
