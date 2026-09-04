'use client';

import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

export default function LoadingSequence() {
  const { progress, active, total } = useProgress();
  const [showButton, setShowButton] = useState(false);
  const currentAct = useStore((state) => state.currentAct);
  const setAct = useStore((state) => state.setAct);

  useEffect(() => {
    // If progress reaches 100, or if there's nothing to load at all (total === 0 after a short delay)
    if (progress === 100 || (!active && total === 0)) {
      const timer = setTimeout(() => setShowButton(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, active, total]);

  // Loading sequence is only for the loading state
  if (currentAct !== 'loading') return null;

  return (
    <AnimatePresence>
      <motion.div
        key="loading-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 3, ease: [0.4, 0, 0.2, 1] } }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-obsidian text-soft-ivory"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Subtle percentage */}
          <motion.div 
            className="font-serif-text italic text-muted-taupe text-lg tracking-widest mb-12"
            animate={{ opacity: progress === 100 ? 0 : 1 }}
            transition={{ duration: 1 }}
          >
            {Math.round(progress)}%
          </motion.div>

          <h1 className="font-serif-display text-5xl tracking-widest mb-4">THE STORY OF US</h1>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-taupe">A Cinematic Memory Archive</p>

          <motion.button
            animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setAct('prologue')}
            disabled={!showButton}
            className="mt-24 px-10 py-4 font-sans text-xs tracking-[0.2em] uppercase text-obsidian bg-soft-ivory hover:bg-white transition-all duration-700 ease-out disabled:pointer-events-none"
          >
            Enter Memory
          </motion.button>
        </motion.div>

        {/* Subtle noise overlay purely for HTML */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("/noise.png")' }}></div>
      </motion.div>
    </AnimatePresence>
  );
}
