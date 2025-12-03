import { Briefcase } from 'lucide-react';
import AuthButton from './auth-button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Briefcase className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold text-foreground">Career Navigator</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
