'use client';

import { Suspense } from 'react';
import CameraRig from './camera/CameraRig';
import PostProcessing from './effects/PostProcessing';
import TimelineWorld from './scenes/TimelineWorld';
import { useStore } from '@/store/useStore';

export default function Scene() {
  const chapter = useStore((state) => state.chapter);

  return (
    <>
      <color attach="background" args={['#0B0A09']} />
      <fog attach="fog" args={['#0B0A09', 10, 25]} />
      
      {/* Cinematic global lighting */}
      <ambientLight intensity={1.2} color="#D9CDBA" />
      <directionalLight 
        position={[0, 2, 8]} 
        intensity={2.5} 
        color="#F3EEE5" 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
      />
      <spotLight 
        position={[-5, 5, 5]} 
        intensity={1.5} 
        color="#C8A875" 
        angle={0.5} 
        penumbra={1} 
      />

      <CameraRig />
      <PostProcessing />

      {chapter >= 1 && <TimelineWorld />}
    </>
  );
}
