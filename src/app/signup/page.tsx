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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithPhoneNumber,
    RecaptchaVerifier
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, useEffect } from "react";
import { Loader2, Chrome } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type Role = 'Student' | 'Teacher';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('email');
  const [role, setRole] = useState<Role>('Student');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Setup recaptcha
  useEffect(() => {
    if (!auth || typeof window === 'undefined' || (window as any).recaptchaVerifier) return;
    try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    } catch (e) {
        console.error("Error setting up recaptcha: ", e);
    }
  }, [auth]);

  const handleUserCreation = async (user: any, name?: string) => {
    await setDoc(doc(firestore, "users", user.uid), {
      id: user.uid,
      username: name || user.displayName || user.email,
      email: user.email,
      role: role,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: "Account Created",
      description: "Your account has been created successfully.",
    });
    router.push('/');
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleUserCreation(result.user);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEmailSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await handleUserCreation(userCredential.user);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const appVerifier = (window as any).recaptchaVerifier;

    try {
        const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setConfirmationResult(result);
        setError("OTP has been sent to your phone.");
    } catch (error: any) {
        setError(`Phone sign-up error: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  }

  const handleOtpVerification = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        const result = await confirmationResult.confirm(otp);
        await handleUserCreation(result.user, phoneNumber);
    } catch (error: any) {
        setError(`OTP verification failed: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create your Student or Teacher account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             <div className="grid gap-2">
                <Label>I am a...</Label>
                <RadioGroup defaultValue="Student" value={role} onValueChange={(value: Role) => setRole(value)} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Student" id="role-student" />
                        <Label htmlFor="role-student">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Teacher" id="role-teacher" />
                        <Label htmlFor="role-teacher">Teacher</Label>
                    </div>
                </RadioGroup>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={isLoading}>
              <Chrome className="mr-2 h-4 w-4" />
              Sign up with Google
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
            
            {signupMethod === 'email' && !confirmationResult && (
              <form onSubmit={handleEmailSignup}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign up with Email'}
                  </Button>
                </div>
              </form>
            )}

            {signupMethod === 'phone' && !confirmationResult &&(
                <form onSubmit={handlePhoneSignup}>
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
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Verify OTP & Sign Up'}
                     </Button>
                </form>
            )}

            <Button variant="link" size="sm" className="px-0" onClick={() => {
                setSignupMethod(signupMethod === 'email' ? 'phone' : 'email');
                setConfirmationResult(null);
                setError(null);
            }}>
              {signupMethod === 'email' ? 'Sign up with Phone Number' : 'Sign up with Email'}
            </Button>

            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
      <div id="recaptcha-container"></div>
    </div>
  );
}
