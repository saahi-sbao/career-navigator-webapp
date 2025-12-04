
import Logo from './logo';

export default function StartupAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground animate-in fade-in duration-1000">
      <div className="animate-pulse">
        <Logo />
      </div>
      <div className="mt-6 text-center">
        <h1 className="text-3xl font-bold text-primary">Career Navigator</h1>
        <p className="text-muted-foreground mt-1">Your Aid to a Bright Future</p>
      </div>
    </div>
  );
}
