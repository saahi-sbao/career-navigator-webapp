'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useUser } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendPasswordResetEmail
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Chrome } from "lucide-react"; // Using Chrome icon for Google

type View = 'login' | 'forgotPassword';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [view, setView] = useState<View>('login');
  
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);
  
  // Setup recaptcha
  useEffect(() => {
    if (view !== 'login' || loginMethod !== 'phone' || !auth || typeof window === 'undefined' || (window as any).recaptchaVerifier) return;
    try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    } catch (e) {
        // Errors during reCAPTCHA setup are often configuration-related.
        // It's not critical to show this to the user, but it's good to be aware of in dev.
    }
  }, [auth, view, loginMethod]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any)
      {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    const appVerifier = (window as any).recaptchaVerifier;

    try {
        const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setConfirmationResult(result);
        setMessage("OTP has been sent to your phone.");
        setError(null);
    } catch (error: any) {
        setError(`Phone sign-in error: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  }

  const handleOtpVerification = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
        await confirmationResult.confirm(otp);
        router.push('/');
    } catch (error: any) {
        setError(`OTP verification failed: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  }

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset link sent! Check your email inbox.");
        setError(null);
    } catch (error: any) {
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
  }


  if (user) {
    return null;
  }

  const renderContent = () => {
    if (view === 'forgotPassword') {
        return (
            <form onSubmit={handlePasswordReset}>
                <div className="grid gap-4">
                    <CardDescription>
                        Enter your email address to receive a password reset link.
                    </CardDescription>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Link'}
                    </Button>
                    <Button variant="link" size="sm" onClick={() => setView('login')}>
                        Back to Login
                    </Button>
                </div>
            </form>
        );
    }

    return (
        <div className="grid gap-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
              <Chrome className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            {loginMethod === 'email' && !confirmationResult && (
              <form onSubmit={handleEmailLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" size="sm" className="ml-auto inline-block text-xs underline" onClick={() => setView('forgotPassword')}>
                            Forgot your password?
                        </Button>
                    </div>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
                  </Button>
                </div>
              </form>
            )}

            {loginMethod === 'phone' && !confirmationResult &&(
                <form onSubmit={handlePhoneLogin}>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 650 555 1234" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                     <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                     </Button>
                </form>
            )}

            {confirmationResult && (
                 <form onSubmit={handleOtpVerification}>
                    <div className="grid gap-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input id="otp" type="text" placeholder="123456" required value={otp} onChange={(e) => setOtp(e.target.value)} />
                    </div>
                     <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                     </Button>
                </form>
            )}

            <Button variant="link" size="sm" className="px-0" onClick={() => {
                setLoginMethod(loginMethod === 'email' ? 'phone' : 'email');
                setConfirmationResult(null);
                setError(null);
                setMessage(null);
            }}>
              {loginMethod === 'email' ? 'Login with Phone Number' : 'Login with Email'}
            </Button>
          </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{view === 'login' ? 'Login' : 'Reset Password'}</CardTitle>
          {view === 'login' && <CardDescription>Choose your login method below</CardDescription>}
        </CardHeader>
        <CardContent>
          {renderContent()}

          {error && <p className="text-destructive text-sm mt-4">{error}</p>}
          {message && <p className="text-green-600 text-sm mt-4">{message}</p>}

          {view === 'login' && (
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
      <div id="recaptcha-container"></div>
    </div>
  );
}
