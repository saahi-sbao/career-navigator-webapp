
'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bot, User } from "lucide-react";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
}

const voices = [
  { value: 'en-US-Standard-E', label: 'Female (Standard)', icon: <User className="h-4 w-4" /> },
  { value: 'en-US-Standard-C', label: 'Male (Standard)', icon: <User className="h-4 w-4" /> },
  { value: 'Algenib', label: 'Female (Sweet)', icon: <Bot className="h-4 w-4" /> },
  { value: 'Achernar', label: 'Male (Deep)', icon: <Bot className="h-4 w-4" /> },
];

export default function VoiceSelector({ selectedVoice, onVoiceChange }: VoiceSelectorProps) {
  return (
    <Select value={selectedVoice} onValueChange={onVoiceChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a voice" />
      </SelectTrigger>
      <SelectContent>
        {voices.map((voice) => (
          <SelectItem key={voice.value} value={voice.value}>
            <div className="flex items-center gap-2">
              {voice.icon}
              <span>{voice.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
