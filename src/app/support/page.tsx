import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold">Contact Support</CardTitle>
            <CardDescription>
              Have questions or need technical help? Fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="e.g., Jane Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Your Email</Label>
                <Input id="email" type="email" placeholder="e.g., jane.doe@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea id="message" placeholder="Please describe your question or issue in detail." className="min-h-[150px]" />
              </div>
              <Button type="submit" className="w-full" size="lg">Submit Inquiry</Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}
