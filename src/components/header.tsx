
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
            <div className="h-6 w-6">
              <Logo />
            </div>
            <span className="hidden font-bold sm:inline-block">
              Career Navigator
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/#home"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
             <Link
              href="/#faq"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              FAQ
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              href="/assessment"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Assessment
            </Link>
            <Link
              href="/subject-combination"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Subjects
            </Link>
             <Link
              href="/story-generator"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Story Generator
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
              href="/contact"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Contact
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
