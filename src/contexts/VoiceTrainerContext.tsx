
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
  clearSpokenContexts: () => void;
}

const VoiceTrainerContext = createContext<VoiceTrainerContextProps | undefined>(undefined);

export const VoiceTrainerProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const spokenContextsRef = useRef<Set<string>>(new Set());
  const speechQueueRef = useRef<Array<{ text: string; priority: 'low' | 'medium' | 'high' }>>([]);
  const isProcessingRef = useRef<boolean>(false);

  // Initialize voices when available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const synth = window.speechSynthesis;
      
      const handleVoicesChanged = () => {
        const voices = synth.getVoices();
        console.log(`Voice Trainer: Loaded ${voices.length} voices`);
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
      console.log(`Voice Trainer: Context changed to ${currentContext}`);
      spokenContextsRef.current.clear();
      speechQueueRef.current = [];
      stopSpeaking();
    }
  }, [currentContext]);

  const clearSpokenContexts = () => {
    spokenContextsRef.current.clear();
    console.log('Voice Trainer: Cleared spoken contexts');
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      console.log(`Voice Trainer: ${newMuted ? 'Muted' : 'Unmuted'}`);
      if (newMuted) {
        stopSpeaking();
        speechQueueRef.current = [];
      }
      return newMuted;
    });
  };

  const processQueue = () => {
    if (isProcessingRef.current || speechQueueRef.current.length === 0 || isMuted || isPaused) {
      return;
    }

    isProcessingRef.current = true;
    const nextItem = speechQueueRef.current.shift();
    
    if (nextItem) {
      speakImmediate(nextItem.text, nextItem.priority);
    }
  };

  const speakImmediate = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (isMuted || isPaused || !text) {
      isProcessingRef.current = false;
      return;
    }
    
    // Create unique key for this text and context
    const contextKey = `${currentContext || 'global'}-${text.slice(0, 50)}`;
    
    // For non-high priority messages, check if already spoken in this context
    if (priority !== 'high' && spokenContextsRef.current.has(contextKey)) {
      isProcessingRef.current = false;
      processQueue();
      return;
    }
    
    // Always stop any ongoing speech immediately
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced voice settings
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
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
    console.log(`Voice Trainer: Speaking - ${text.slice(0, 100)}...`);
    
    utterance.onend = () => {
      speechSynthRef.current = null;
      setSpeakingText(null);
      isProcessingRef.current = false;
      // Mark as spoken for this context
      spokenContextsRef.current.add(contextKey);
      // Process next item in queue
      setTimeout(processQueue, 100);
    };
    
    utterance.onerror = () => {
      speechSynthRef.current = null;
      setSpeakingText(null);
      isProcessingRef.current = false;
      console.error('Voice Trainer: Speech error occurred');
      setTimeout(processQueue, 100);
    };
    
    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const speak = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (isMuted || isPaused || !text) return;
    
    // For high priority, clear queue and speak immediately
    if (priority === 'high') {
      speechQueueRef.current = [];
      stopSpeaking();
      setTimeout(() => speakImmediate(text, priority), 50);
    } else {
      // Add to queue for lower priority items
      speechQueueRef.current.push({ text, priority });
      if (!isProcessingRef.current) {
        setTimeout(processQueue, 100);
      }
    }
  };
  
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    speechSynthRef.current = null;
    setSpeakingText(null);
    isProcessingRef.current = false;
    console.log('Voice Trainer: Stopped speaking');
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
        currentContext,
        clearSpokenContexts
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
