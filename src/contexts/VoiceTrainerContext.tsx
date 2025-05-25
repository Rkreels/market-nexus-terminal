
import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';

interface VoiceTrainerContextProps {
  isMuted: boolean;
  toggleMute: () => void;
  speak: (text: string, priority?: 'low' | 'medium' | 'high') => void;
  stopSpeaking: () => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  speakingText: string | null;
  setCurrentContext: (context: string) => void;
  currentContext: string | null;
}

const VoiceTrainerContext = createContext<VoiceTrainerContextProps | undefined>(undefined);

export const VoiceTrainerProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const spokenContextsRef = useRef<Set<string>>(new Set());

  // Initialize voices when available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const synth = window.speechSynthesis;
      
      const handleVoicesChanged = () => {
        const voices = synth.getVoices();
        console.log(`Loaded ${voices.length} voices`);
      };
      
      synth.onvoiceschanged = handleVoicesChanged;
      synth.getVoices();
      
      return () => {
        synth.onvoiceschanged = null;
      };
    }
  }, []);

  // Clear spoken contexts when context changes
  useEffect(() => {
    if (currentContext) {
      spokenContextsRef.current.clear();
    }
  }, [currentContext]);

  const toggleMute = () => {
    setIsMuted((prev) => {
      if (!prev) {
        stopSpeaking();
      }
      return !prev;
    });
  };

  const speak = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (isMuted || isPaused || !text) return;
    
    // Create unique key for this text and context
    const contextKey = `${currentContext || 'global'}-${text.slice(0, 50)}`;
    
    // For non-high priority messages, check if already spoken in this context
    if (priority !== 'high' && spokenContextsRef.current.has(contextKey)) {
      return;
    }
    
    // Always stop any ongoing speech immediately
    stopSpeaking();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced voice settings
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Find best voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = [
      'Samantha', 'Victoria', 'Moira', 'Tessa',
      'Microsoft Zira', 'Microsoft Hazel', 'Microsoft Susan',
      'Google UK English Female', 'Google US English Female'
    ];
    
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
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    setSpeakingText(text);
    
    utterance.onend = () => {
      speechSynthRef.current = null;
      setSpeakingText(null);
      // Mark as spoken for this context
      spokenContextsRef.current.add(contextKey);
    };
    
    utterance.onerror = () => {
      speechSynthRef.current = null;
      setSpeakingText(null);
    };
    
    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    speechSynthRef.current = null;
    setSpeakingText(null);
  };
  
  return (
    <VoiceTrainerContext.Provider 
      value={{ 
        isMuted, 
        toggleMute, 
        speak, 
        stopSpeaking,
        isPaused,
        setPaused,
        speakingText,
        setCurrentContext,
        currentContext
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
