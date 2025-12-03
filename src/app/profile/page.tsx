'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth, useUser, useFirebase } from '@/firebase';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { Loader2, Sparkles, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import { generateAvatarAction } from '../actions';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [avatarPrompt, setAvatarPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerateAvatar = async () => {
    if (!avatarPrompt.trim()) {
      toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please enter a description for your avatar.' });
      return;
    }
    setIsGenerating(true);
    const result = await generateAvatarAction({ prompt: avatarPrompt });
    setIsGenerating(false);

    if (result.success && result.imageUrl) {
      setPreviewImage(result.imageUrl);
      toast({ title: 'Avatar Generated!', description: 'You can now save it as your profile picture.' });
    } else {
      toast({ variant: 'destructive', title: 'Avatar Generation Failed', description: result.error });
    }
  };

  const handleSaveProfilePicture = async () => {
    if (!previewImage || !user || !auth) return;

    setIsUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `avatars/${user.uid}/profile.png`);

    try {
      // Upload the new image (as a data URL)
      await uploadString(storageRef, previewImage, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);

      // Update the user's profile in Firebase Auth
      await updateProfile(auth.currentUser!, { photoURL: downloadURL });
      
      toast({ title: 'Profile Picture Updated!', description: 'Your new avatar is now active.' });
      // Force a refresh of the user object by reloading, not ideal but simple
      // A better solution would involve re-fetching the user state.
      router.refresh(); 

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
    } finally {
      setIsUploading(false);
      setPreviewImage(null);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
            <CardDescription>Update your avatar and personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center gap-6">
              <Avatar className="h-32 w-32 ring-4 ring-primary ring-offset-4 ring-offset-background">
                <AvatarImage src={previewImage || user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} alt={user.displayName || 'User'} />
                <AvatarFallback className="text-4xl">{user.displayName?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>

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
              <h3 className="font-semibold text-lg">Update Profile Picture</h3>
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
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="grid gap-4">
                <Label htmlFor="avatar-prompt">Generate an AI Avatar</Label>
                <div className="flex items-center gap-3">
                    <Input
                        id="avatar-prompt"
                        placeholder="e.g., A happy lion reading a book"
                        value={avatarPrompt}
                        onChange={(e) => setAvatarPrompt(e.target.value)}
                        disabled={isGenerating}
                    />
                    <Button onClick={handleGenerateAvatar} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles />}
                        Generate
                    </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
