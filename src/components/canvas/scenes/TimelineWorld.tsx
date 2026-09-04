'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/store/useStore';
import ChapterOne from './ChapterOne';
import ChapterTwo from './ChapterTwo';
import ChapterThree from './ChapterThree';
import ChapterFour from './ChapterFour';

gsap.registerPlugin(ScrollTrigger);

export default function TimelineWorld() {
  const worldRef = useRef<THREE.Group>(null);
  const scrollEnabled = useStore((state) => state.scrollEnabled);

  useEffect(() => {
    if (!scrollEnabled || !worldRef.current) return;

    // Map 0 -> 550vh to Z: 0 -> 55
    // Chapter 1: 0, Chapter 2: -15, Chapter 3: -30, Chapter 4: -45
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
      }
    });

    tl.to(worldRef.current.position, {
      z: 55,
      ease: 'none'
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [scrollEnabled]);

  return (
    <group ref={worldRef}>
      <ChapterOne />
      <ChapterTwo />
      <ChapterThree />
      <ChapterFour />
    </group>
  );
}
