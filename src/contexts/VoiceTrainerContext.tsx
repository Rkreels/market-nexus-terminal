
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

  // Speak the given text
  const speak = (text: string) => {
    if (isMuted || isPaused || !text) return;
    
    // Stop any ongoing speech
    stopSpeaking();
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set properties - using a female voice if available
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('female') || 
      voice.name.includes('woman') || 
      voice.name.includes('girl') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Karen') ||
      voice.name.includes('Moira') ||
      voice.name.includes('Tessa')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
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
