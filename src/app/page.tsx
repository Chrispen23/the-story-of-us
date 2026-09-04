'use client';

import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from '@/components/canvas/Scene';
import LoadingSequence from '@/components/dom/overlays/LoadingSequence';
import { useStore } from '@/store/useStore';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const scrollEnabled = useStore((state) => state.scrollEnabled);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      if (scrollEnabled) {
        lenisRef.current.start();
        document.body.style.overflow = 'auto';
      } else {
        lenisRef.current.stop();
        document.body.style.overflow = 'hidden';
      }
    }
  }, [scrollEnabled]);

  return (
    <main className="relative w-full bg-obsidian">
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <LoadingSequence />
        <Canvas 
          shadows
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]} // Performance optimization
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* DOM Scroll Timeline - Only active after prologue */}
      <div 
        className="relative z-10 w-full pointer-events-none" 
        style={{ height: scrollEnabled ? '550vh' : '100vh' }}
      >
        {/* Scroll markers for Chapter 2, 3 could go here */}
        <div id="chapter2-trigger" className="absolute top-[100vh] w-full h-px" />
        <div id="chapter3-trigger" className="absolute top-[200vh] w-full h-px" />
      </div>
    </main>
  );
}
