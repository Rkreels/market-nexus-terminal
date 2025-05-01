
import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

interface VoiceTrainerContextProps {
  isMuted: boolean;
  toggleMute: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
}

const VoiceTrainerContext = createContext<VoiceTrainerContextProps | undefined>(undefined);

export const VoiceTrainerProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted((prev) => {
      if (!prev) {
        stopSpeaking(); // Stop any ongoing speech when muting
      }
      return !prev;
    });
  };

  // Speak the given text with advanced natural language processing
  const speak = (text: string) => {
    if (isMuted || isPaused || !text) return;
    
    // Stop any ongoing speech
    stopSpeaking();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced voice settings for more natural sound
    utterance.rate = 0.95; // Slightly slower for better comprehension
    utterance.pitch = 1.05; // Slightly higher pitch for female voice
    utterance.volume = 1.0;
    
    // Try to find an ideal female voice with good articulation
    const voices = window.speechSynthesis.getVoices();
    
    // Prioritized list of preferred voices
    const preferredVoices = [
      // Apple voices
      'Samantha', 'Victoria', 'Moira', 'Tessa',
      // Microsoft voices
      'Microsoft Zira', 'Microsoft Hazel', 'Microsoft Susan',
      // Google voices 
      'Google UK English Female', 'Google US English Female',
      // General descriptors
      'female', 'woman'
    ];
    
    // Find the best available voice from our preferences
    let selectedVoice = null;
    for (const preferredVoice of preferredVoices) {
      const found = voices.find(voice => 
        voice.name.includes(preferredVoice) ||
        voice.name.toLowerCase().includes(preferredVoice.toLowerCase())
      );
      if (found) {
        selectedVoice = found;
        break;
      }
    }
    
    // If we found a preferred voice, use it
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      // Fallback to any female voice
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('woman') || 
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman')
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    }
    
    // Handle speech ending event
    utterance.onend = () => {
      speechSynthRef.current = null;
    };
    
    // Store the utterance in ref for future cancellation
    speechSynthRef.current = utterance;
    
    // Speak
    window.speechSynthesis.speak(utterance);
  };
  
  // Stop any ongoing speech
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    speechSynthRef.current = null;
  };
  
  return (
    <VoiceTrainerContext.Provider 
      value={{ 
        isMuted, 
        toggleMute, 
        speak, 
        stopSpeaking,
        isPaused,
        setPaused
      }}
    >
      {children}
    </VoiceTrainerContext.Provider>
  );
};

export const useVoiceTrainer = (): VoiceTrainerContextProps => {
  const context = useContext(VoiceTrainerContext);
  if (context === undefined) {
    throw new Error('useVoiceTrainer must be used within a VoiceTrainerProvider');
  }
  return context;
};
