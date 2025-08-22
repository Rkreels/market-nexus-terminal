
import React, { useEffect, useRef, useState } from 'react';
import { useVoiceTrainer } from '@/contexts/VoiceTrainerContext';
import { cn } from '@/lib/utils';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const VoiceTrainer: React.FC = () => {
  const { 
    isEnabled, 
    setIsEnabled, 
    currentMessage, 
    isListening, 
    setIsListening,
    speak,
    startListening,
    stopListening
  } = useVoiceTrainer();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Check for dark mode
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsVisible(true);
      
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      
      mouseTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    const handleKeydown = (e: KeyboardEvent) => {
      // Show controls on any key press
      setIsVisible(true);
      
      // Toggle voice trainer with Alt+V
      if (e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setIsEnabled(!isEnabled);
        speak(isEnabled ? 'Voice trainer disabled' : 'Voice trainer enabled', 'medium');
      }
      
      // Toggle listening with Alt+L
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeydown);
    
    // Show initially
    setIsVisible(true);
    mouseTimeoutRef.current = setTimeout(() => setIsVisible(false), 5000);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeydown);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
    };
  }, [isEnabled, isListening, setIsEnabled, speak, startListening, stopListening]);

  const toggleVoiceTrainer = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    speak(newState ? 'Voice trainer enabled' : 'Voice trainer disabled', 'medium');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      speak('Voice commands disabled', 'low');
    } else {
      startListening();
      speak('Voice commands enabled. Speak your command.', 'low');
    }
  };

  return (
    <>
      {/* Voice Trainer Controls */}
      <div className={cn(
        "fixed bottom-4 right-4 z-50 transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      )}>
        <Card className={cn(
          "shadow-lg border",
          isDarkMode ? "bg-zinc-800 border-zinc-700" : "bg-white border-gray-200"
        )}>
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={isEnabled ? "default" : "outline"}
                onClick={toggleVoiceTrainer}
                className="h-8 w-8 p-0"
                title={`Voice Trainer ${isEnabled ? 'Enabled' : 'Disabled'} (Alt+V)`}
              >
                {isEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                size="sm"
                variant={isListening ? "default" : "outline"}
                onClick={toggleListening}
                disabled={!isEnabled}
                className="h-8 w-8 p-0"
                title={`Voice Commands ${isListening ? 'Active' : 'Inactive'} (Alt+L)`}
              >
                {isListening ? (
                  <Mic className="h-4 w-4 text-red-500" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Message Display */}
      {currentMessage && isEnabled && (
        <div className={cn(
          "fixed bottom-20 right-4 z-40 max-w-sm transition-all duration-300",
          "opacity-90"
        )}>
          <Card className={cn(
            "shadow-lg border",
            isDarkMode ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-200"
          )}>
            <CardContent className="p-3">
              <div className="flex items-start space-x-2">
                <Volume2 className={cn(
                  "h-4 w-4 mt-0.5 flex-shrink-0",
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                )} />
                <p className={cn(
                  "text-sm leading-relaxed",
                  isDarkMode ? "text-zinc-200" : "text-gray-800"
                )}>
                  {currentMessage}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Listening Indicator */}
      {isListening && (
        <div className="fixed top-4 right-4 z-50">
          <Card className={cn(
            "shadow-lg border-2 border-red-500",
            isDarkMode ? "bg-zinc-800" : "bg-white"
          )}>
            <CardContent className="p-2">
              <div className="flex items-center space-x-2">
                <Mic className="h-4 w-4 text-red-500 animate-pulse" />
                <span className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  Listening...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Screen Reader Announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {currentMessage}
      </div>
    </>
  );
};

export default VoiceTrainer;
