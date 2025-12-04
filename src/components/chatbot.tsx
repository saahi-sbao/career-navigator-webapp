
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
import { Mic, MicOff, Send, Loader2, Volume2, VolumeX, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateChatResponseAction, generateAudioAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import VoiceSelector from './voice-selector';
import Logo from './logo';

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
};

const INITIAL_MESSAGE: ChatMessage = {
    role: 'model',
    content: "Hello! I am your friendly career guidance assistant. How can I help you explore your future today?",
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [audioQueue, setAudioQueue] = useState<HTMLAudioElement[]>([]);
  const [voice, setVoice] = useState('Algenib'); // Default to a valid human voice

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Handle audio playback queue
  useEffect(() => {
    const playNextInQueue = () => {
      if (audioQueue.length > 0 && isTtsEnabled) {
        const audio = audioQueue[0];
        audioRef.current = audio;
        audio.play().catch(e => console.error("Audio playback error:", e));
        audio.onended = () => {
          audioRef.current = null;
          setAudioQueue(prev => prev.slice(1));
        };
      }
    };
    
    if(!audioRef.current){
        playNextInQueue();
    }
  }, [audioQueue, isTtsEnabled]);

  // Stop TTS when chat is closed or TTS is disabled
  useEffect(() => {
      return () => {
          if(audioRef.current) {
              audioRef.current.pause();
              audioRef.current = null;
          }
          setAudioQueue([]);
      }
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if(open && messages.length === 1) {
        setMessages([INITIAL_MESSAGE]);
    }
    // Stop any playing audio when dialog is closed
    if (!open && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setAudioQueue([]);
    }
  };

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
        // Use a timeout to allow state to update before sending
        setTimeout(() => handleSend(transcript), 100);
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
      setIsListening(false);
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
          } else {
            console.error("TTS generation failed:", audioResult.error);
          }
        }
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
        // Restore messages on failure
        setMessages(prev => prev.slice(0, prev.length -1));
      }
    });
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        onClick={() => handleOpenChange(true)}
      >
        <Bot className="h-8 w-8" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
                    <Avatar className="w-8 h-8 border bg-background flex items-center justify-center">
                       <div className="w-6 h-6"><Logo /></div>
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
                  <Avatar className="w-8 h-8 border bg-background flex items-center justify-center">
                     <div className="w-6 h-6"><Logo /></div>
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
