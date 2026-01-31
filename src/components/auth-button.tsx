'use client';

import { LogIn, LogOut, Loader2, UserCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useAdmin } from '@/hooks/use-admin';
import { doc } from 'firebase/firestore';

export default function AuthButton() {
  // Use "as any" to bypass strict type checking for the rollout
  const userResult = useUser() as any;
  const user = userResult.data;
  const isUserLoading = userResult.status === 'loading';
  
  const auth = useAuth();
  const firestore = useFirestore();
  
  const { isAdmin, isAdminLoading } = useAdmin() as any;

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );
  
  const { data: userDoc, isLoading: isDocLoading } = useDoc(userDocRef) as any;

  const handleLogout = async () => {
    await signOut(auth);
  };
  
  const isLoading = isUserLoading || (user && (isAdminLoading || isDocLoading));

  if (isLoading) {
    return (
      <Button disabled variant="outline" size="icon">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (user) {
    const userRole = (userDoc as any)?.role;
    const displayName = user.displayName || (userDoc as any)?.username || 'User';
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL ?? `https://i.pravatar.cc/150?u=${user.uid}`} alt={displayName} />
              <AvatarFallback>{displayName?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email || user.phoneNumber}
              </p>
              {userRole && <p className="text-xs leading-none text-blue-500 pt-1 font-semibold">{userRole}</p>}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild>
      <Link href="/login">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Link>
    </Button>
  );
}