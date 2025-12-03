import { ThemeToggle } from './theme-toggle';
import AuthButton from './auth-button';

export default function Header() {
  return (
    <header className="bg-card text-card-foreground shadow-md py-6 px-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Career Guidance System</h1>
            <p className="subtitle text-sm text-muted-foreground mt-1">Multiple Intelligence Assessment</p>
          </div>
          <div className="flex items-center gap-4">
            <AuthButton />
            <ThemeToggle />
          </div>
      </div>
    </header>
  );
}
