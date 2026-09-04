'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/components/canvas/Scene';
import LoadingSequence from '@/components/dom/overlays/LoadingSequence';
import AudioController from '@/components/audio/AudioController';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-obsidian">
      <AudioController />
      
      {/* 3D Canvas Environment */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <LoadingSequence />
        <Canvas 
          shadows
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </main>
  );
}
