import { ThemeToggle } from './theme-toggle';
import AuthButton from './auth-button';
import Logo from './logo';
import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block">
              Career Guidance
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/assessment"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Assessment
            </Link>
            <Link
              href="/#career-fields"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pathways
            </Link>
             <Link
              href="/resources"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Resources
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
            <Link
              href="/support"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Support
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* You can add a search bar here if needed */}
          </div>
          <nav className="flex items-center">
            <AuthButton />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
