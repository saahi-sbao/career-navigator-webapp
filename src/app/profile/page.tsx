'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Loader2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, `users/${user.uid}`) : null),
    [user, firestore]
  );
  const { data: userDoc, isLoading: isDocLoading } = useDoc(userDocRef);

  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfilePicture = async () => {
    if (!previewImage || !user || !auth || !auth.currentUser) return;

    setIsUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `avatars/${user.uid}/profile.png`);

    try {
      await uploadString(storageRef, previewImage, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      
      toast({ title: 'Profile Picture Updated!', description: 'Your new avatar is now active.' });
      router.refresh(); 

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setIsUploading(false);
      setPreviewImage(null);
    }
  };

  if (isUserLoading || !user || isDocLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const displayName = user.displayName || userDoc?.username || 'User';
  const userRole = userDoc?.role;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center items-center">
             <Avatar className="h-32 w-32 ring-4 ring-primary ring-offset-4 ring-offset-background">
                <AvatarImage src={previewImage || user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} alt={displayName} />
                <AvatarFallback className="text-4xl">{displayName?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
            <CardTitle className="pt-4 text-3xl">{displayName}</CardTitle>
            {userRole && <Badge variant="secondary" className="mt-2">{userRole}</Badge>}
            <CardDescription>{user.email || user.phoneNumber}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center gap-6">
              {previewImage && (
                <div className="flex gap-4">
                  <Button onClick={handleSaveProfilePicture} disabled={isUploading}>
                    {isUploading ? <Loader2 className="mr-2 animate-spin" /> : null}
                    Save as Profile Picture
                  </Button>
                  <Button variant="outline" onClick={() => setPreviewImage(null)}>Cancel</Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-center">Update Profile Picture</h3>
              <div className="grid gap-4">
                <Label htmlFor="picture-upload">Upload an Image</Label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2" /> Choose File
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {fileInputRef.current?.files?.[0]?.name || "No file chosen"}
                  </span>
                  <input
                    id="picture-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/gif"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </main>
    </div>
  );
}
