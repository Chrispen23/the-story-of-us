'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';

export default function AudioController() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { audioStarted, currentAct } = useStore();

  useEffect(() => {
    // Create audio instance once
    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new Audio('/media/audio/bgm.mp3');
      audioRef.current.loop = true; // Let it play on loop
      audioRef.current.volume = 0; // Start at 0 to fade in
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioStarted && audioRef.current) {
      audioRef.current.play().catch(console.error);
      
      // Fade in over 3 seconds
      let vol = 0;
      const interval = setInterval(() => {
        if (vol < 0.5) {
          vol += 0.05;
          if (audioRef.current) audioRef.current.volume = Math.min(vol, 0.5);
        } else {
          clearInterval(interval);
        }
      }, 300);
    }
  }, [audioStarted]);

  // Audio dynamic mixing based on Act
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Example: quiet down during the letter (Act 4)
    if (currentAct === 'act4') {
      let vol = audioRef.current.volume;
      const interval = setInterval(() => {
        if (vol > 0.15) {
          vol -= 0.05;
          if (audioRef.current) audioRef.current.volume = Math.max(vol, 0.15);
        } else {
          clearInterval(interval);
        }
      }, 300);
    }
  }, [currentAct]);

  return null;
}
