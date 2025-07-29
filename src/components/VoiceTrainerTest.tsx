import React, { useEffect } from 'react';
import { useVoiceTrainer } from '@/contexts/VoiceTrainerContext';

// Test component to verify voice trainer functionality
const VoiceTrainerTest: React.FC = () => {
  const { speak, isMuted, toggleMute } = useVoiceTrainer();

  useEffect(() => {
    // Test speech synthesis on component mount
    const timer = setTimeout(() => {
      if (!isMuted) {
        console.log('Voice Trainer Test: Testing speech synthesis...');
        speak('Voice trainer is now active and ready to provide guidance.', 'high');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [speak, isMuted]);

  const handleTestSpeech = () => {
    speak('This is a test of the voice trainer system. Hover over interface elements to hear detailed guidance.', 'high');
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px', borderRadius: '5px' }}>
      <button onClick={handleTestSpeech} style={{ marginRight: '10px', padding: '5px 10px' }}>
        Test Voice
      </button>
      <button onClick={toggleMute} style={{ padding: '5px 10px' }}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
};

export default VoiceTrainerTest;