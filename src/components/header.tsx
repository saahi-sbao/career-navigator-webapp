'use client';

import { ThemeToggle } from './theme-toggle';
import AuthButton from './auth-button';
import Logo from './logo';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useFeatureFlag } from '@/hooks/use-feature-flag';

// A small component to conditionally render the Story Generator link based on its feature flag.
const StoryGeneratorLink = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { isEnabled, isLoading } = useFeatureFlag('storyGenerator');

  // Don't render anything if the flag is loading or the feature is disabled.
  if (isLoading || !isEnabled) {
    return null;
  }

  if (isMobile) {
    return (
      <SheetClose asChild>
        <Link
            href="/story-generator"
            className="transition-colors hover:text-foreground text-muted-foreground"
        >
            Story Generator
        </Link>
      </SheetClose>
    );
  }

  return (
    <Link
      href="/story-generator"
      className="transition-colors hover:text-foreground/80 text-foreground/60"
    >
      Story Generator
    </Link>
  );
};


export default function Header() {
  const navLinks = [
    { href: '/#home', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/assessment', label: 'Assessment' },
    { href: '/intelligence-analyst', label: 'Intelligences' },
    { href: '/subject-combination', label: 'Subjects' },
    { href: '/resources', label: 'Resources' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6">
              <Logo />
            </div>
            <span className="font-bold sm:inline-block">
              Career Navigator
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
            <StoryGeneratorLink />
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between md:justify-end">
            {/* Mobile Menu & Logo */}
            <div className="flex items-center gap-2 md:hidden">
                 <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-sm">
                        <nav className="grid gap-6 text-lg font-medium mt-8">
                            <Link href="/" className="flex items-center gap-2 font-semibold mb-4">
                                <div className="h-6 w-6">
                                    <Logo />
                                </div>
                                <span>Career Navigator</span>
                            </Link>
                            {navLinks.map((link) => (
                                <SheetClose asChild key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="transition-colors hover:text-foreground text-muted-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </SheetClose>
                            ))}
                            <StoryGeneratorLink isMobile={true} />
                        </nav>
                    </SheetContent>
                </Sheet>
                 <Link href="/" className="flex items-center space-x-2">
                    <div className="h-6 w-6">
                        <Logo />
                    </div>
                    <span className="font-bold">
                        Career Navigator
                    </span>
                </Link>
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
