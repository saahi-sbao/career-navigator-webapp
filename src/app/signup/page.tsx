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
import { useAuth, useFirestore, useUser } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const allowedAdmins: Record<string, string> = {
    'sidmadina@example.com': '0117448455sid',
    'sidmaryam@example.com': '0755262901sid',
};

const allowedUsernames: Record<string, string> = {
    'sidmadina@example.com': 'sidmadina',
    'sidmaryam@example.com': 'sidmaryam',
};


export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (allowedAdmins[email.toLowerCase()] !== password) {
        setError("Invalid credentials for admin sign up.");
        return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const username = allowedUsernames[email.toLowerCase()];

      // Create user document
      await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        username: username,
        careerInterestIds: [],
      });
      
      // Create admin role document
      await setDoc(doc(firestore, "roles_admin", user.uid), {
        id: user.uid,
        username: username,
      });

      toast({
        title: "Admin Account Created",
        description: `Admin user ${username} created successfully. You can now log in.`,
      });

      router.push('/login');
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            setError('This admin account has already been created. Please log in.');
        } else if (error.code === 'auth/invalid-email') {
            setError('The email address is not valid.');
        } else {
            setError(error.message);
        }
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Sign Up</CardTitle>
          <CardDescription>
            Create an administrator account. Only specific users are allowed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up as Admin'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
