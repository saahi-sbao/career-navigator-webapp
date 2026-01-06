
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-extrabold">Contact Us</CardTitle>
                <CardDescription>
                Have questions or need technical help? We'd love to hear from you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                         <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <MapPin className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Our Location</h3>
                                <p className="text-muted-foreground">Mombasa, Kisimani</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Phone Number</h3>
                                <p className="text-muted-foreground">0117448455</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Email</h3>
                                <p className="text-muted-foreground">sadiq14526@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    
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
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
