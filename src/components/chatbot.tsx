
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Mic, MicOff, Send, Loader2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateChatResponseAction, generateAudioAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from './ui/avatar';
import VoiceSelector from './voice-selector';

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [audioQueue, setAudioQueue] = useState<HTMLAudioElement[]>([]);
  const [voice, setVoice] = useState('en-US-Standard-E');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Play audio from the queue
    if (audioQueue.length > 0 && isTtsEnabled) {
      const audio = audioQueue[0];
      audio.play();
      audio.onended = () => {
        setAudioQueue(prev => prev.slice(1));
      };
    } else if (!isTtsEnabled) {
      // Clear queue if TTS is disabled
      setAudioQueue([]);
    }
  }, [audioQueue, isTtsEnabled]);

  const handleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ variant: 'destructive', title: 'Speech recognition not supported in this browser.' });
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        toast({ variant: 'destructive', title: 'Speech recognition error', description: event.error });
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');

    startTransition(async () => {
      const result = await generateChatResponseAction({ messages: newMessages });

      if (result.success && result.response) {
        setMessages(prev => [...prev, { role: 'model', content: result.response as string }]);
        
        if (isTtsEnabled) {
          const audioResult = await generateAudioAction({ text: result.response as string, voiceName: voice });
          if (audioResult.success && audioResult.audio) {
            const audio = new Audio(audioResult.audio);
            setAudioQueue(prev => [...prev, audio]);
          }
        }
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
        // Restore user message if AI fails
        setMessages(prev => prev.slice(0, -1));
      }
    });
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-8 w-8" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2 border-b">
            <DialogTitle className="flex justify-between items-center">
              Career Guidance Assistant
              <div className="flex items-center gap-2">
                <VoiceSelector selectedVoice={voice} onVoiceChange={setVoice} />
                <Button variant="ghost" size="icon" onClick={() => setIsTtsEnabled(p => !p)}>
                  {isTtsEnabled ? <Volume2 /> : <VolumeX />}
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow px-6" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4 py-4">
              {messages.map((message, index) => (
                <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : '')}>
                  {message.role === 'model' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2 max-w-[80%]',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 pt-2 border-t">
            <div className="flex w-full items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSpeechRecognition}
                className={cn(isListening ? 'text-destructive' : '')}
              >
                {isListening ? <MicOff /> : <Mic />}
              </Button>
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={isPending}
              />
              <Button onClick={() => handleSend()} disabled={isPending || !input}>
                {isPending ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
