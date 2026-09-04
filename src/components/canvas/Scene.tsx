'use client';

import { Suspense } from 'react';
import PostProcessing from './effects/PostProcessing';
import ActOrchestrator from './scenes/ActOrchestrator';

import { useTexture } from '@react-three/drei';

export default function Scene() {
  // Preload textures to prevent Suspense fallback when switching acts
  useTexture.preload('/media/chapter1/photo1.jpg');
  useTexture.preload('/media/chapter1/photo2.jpg');
  
  return (
    <>
      <color attach="background" args={['#0B0A09']} />
      {/* Fog ensures distant objects fade naturally into darkness */}
      <fog attach="fog" args={['#0B0A09', 5, 20]} />
      
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

      <PostProcessing />

      <ActOrchestrator />
    </>
  );
}
