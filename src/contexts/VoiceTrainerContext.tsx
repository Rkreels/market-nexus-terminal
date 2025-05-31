
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
  const voicesLoadedRef = useRef<boolean>(false);
  const lastSpeechTimeRef = useRef<number>(0);

  // Initialize voices when available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const synth = window.speechSynthesis;
      
      const loadVoices = () => {
        const voices = synth.getVoices();
        if (voices.length > 0 && !voicesLoadedRef.current) {
          voicesLoadedRef.current = true;
          console.log(`Voice Trainer: Loaded ${voices.length} voices successfully`);
        }
      };
      
      // Load voices immediately if available
      loadVoices();
      
      // Also listen for the event
      synth.onvoiceschanged = loadVoices;
      
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

  const stopSpeaking = () => {
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (speechSynthRef.current) {
        speechSynthRef.current.onend = null;
        speechSynthRef.current.onerror = null;
        speechSynthRef.current = null;
      }
      setSpeakingText(null);
      isProcessingRef.current = false;
      console.log('Voice Trainer: Speech stopped successfully');
    } catch (error) {
      console.error('Voice Trainer: Error stopping speech:', error);
    }
  };

  const speakImmediate = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (isMuted || isPaused || !text || !voicesLoadedRef.current) {
      isProcessingRef.current = false;
      return;
    }

    // Prevent rapid-fire speech attempts
    const now = Date.now();
    if (now - lastSpeechTimeRef.current < 100) {
      isProcessingRef.current = false;
      return;
    }
    lastSpeechTimeRef.current = now;
    
    // Create unique key for this text and context
    const contextKey = `${currentContext || 'global'}-${text.slice(0, 50)}`;
    
    // For non-high priority messages, check if already spoken in this context
    if (priority !== 'high' && spokenContextsRef.current.has(contextKey)) {
      isProcessingRef.current = false;
      processQueue();
      return;
    }
    
    // Stop any ongoing speech
    stopSpeaking();
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced voice settings for better quality
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Find the best available voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = [
        'Microsoft Zira Desktop - English (United States)',
        'Google US English',
        'Samantha',
        'Victoria',
        'Alex'
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
      
      // Fallback to first English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.localService
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      setSpeakingText(text);
      console.log(`Voice Trainer: Speaking (${priority}) - ${text.slice(0, 100)}...`);
      
      utterance.onend = () => {
        speechSynthRef.current = null;
        setSpeakingText(null);
        isProcessingRef.current = false;
        spokenContextsRef.current.add(contextKey);
        setTimeout(processQueue, 200);
      };
      
      utterance.onerror = (event) => {
        console.error('Voice Trainer: Speech error:', event.error);
        speechSynthRef.current = null;
        setSpeakingText(null);
        isProcessingRef.current = false;
        setTimeout(processQueue, 300);
      };
      
      speechSynthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Voice Trainer: Error creating speech:', error);
      isProcessingRef.current = false;
      setSpeakingText(null);
    }
  };

  const processQueue = () => {
    if (isProcessingRef.current || speechQueueRef.current.length === 0 || isMuted || isPaused) {
      return;
    }

    isProcessingRef.current = true;
    const nextItem = speechQueueRef.current.shift();
    
    if (nextItem) {
      setTimeout(() => speakImmediate(nextItem.text, nextItem.priority), 100);
    } else {
      isProcessingRef.current = false;
    }
  };

  const speak = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (isMuted || isPaused || !text) return;
    
    // For high priority, clear queue and speak immediately
    if (priority === 'high') {
      speechQueueRef.current = [];
      stopSpeaking();
      setTimeout(() => speakImmediate(text, priority), 150);
    } else {
      // Add to queue for lower priority items
      speechQueueRef.current.push({ text, priority });
      if (!isProcessingRef.current) {
        setTimeout(processQueue, 200);
      }
    }
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
