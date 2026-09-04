'use client';

import { useState, useEffect, useRef } from 'react';
import { useSpring, a } from '@react-spring/three';
import { Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import PremiumEnvelope from '../envelope/PremiumEnvelope';
import PhysicalPhoto from '../objects/PhysicalPhoto';
import { useStore } from '@/store/useStore';

export default function ChapterOne() {
  const [phase, setPhase] = useState<'envelope' | 'transition' | 'memories'>('envelope');
  const { camera } = useThree();
  const setScrollEnabled = useStore((state) => state.setScrollEnabled);
  const groupRef = useRef<THREE.Group>(null);
  const htmlRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (groupRef.current && htmlRef.current) {
      const worldPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPosition);
      const dist = camera.position.z - worldPosition.z;
      
      let opacity = 0;
      if (dist > 4 && dist < 12) {
        opacity = 1 - Math.abs(dist - 8.5) / 3.5; // peaks at 8.5, fades out at 5 and 12
      }
      
      htmlRef.current.style.opacity = Math.max(0, opacity).toString();
    }
  });

  const handleEnvelopeOpened = () => {
    setPhase('transition');
    setTimeout(() => {
      setPhase('memories');
      setScrollEnabled(true);
    }, 1000);
  };

  useEffect(() => {
    if (phase === 'memories') {
      // Smoothly drift the camera to frame the constellation perfectly
      gsap.to(camera.position, {
        x: 0,
        y: 0.3,
        z: 8.5, // Pull further back to ensure text fits on laptop screens
        duration: 4,
        ease: 'power2.out',
      });
      // Gently look at the center
      gsap.to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 4,
        ease: 'power2.out',
      });
    }
  }, [phase, camera]);

  return (
    <group>
      {/* Phase 1: The Envelope */}
      {(phase === 'envelope' || phase === 'transition') && (
        <a.group>
           <PremiumEnvelope onComplete={handleEnvelopeOpened} />
        </a.group>
      )}

      {/* Phase 2: The Memories */}
      {phase === 'memories' && (
        <a.group ref={groupRef}>
          {/* Subtle HTML typography */}
          <Html center position={[0, 2.1, -1]} zIndexRange={[50, 0]} className="pointer-events-none">
            <div ref={htmlRef} className="flex flex-col items-center justify-center w-[800px] animate-fade-in-slow text-center transition-opacity duration-300">
              <h2 className="font-serif-display text-5xl text-soft-ivory tracking-wide mb-4">Before We Knew</h2>
              <p className="font-serif-text text-muted-taupe text-xl italic">05 September 2023</p>
            </div>
          </Html>

          {/* Drifting Constellation - Adjusted Y positions so they aren't hidden off-screen */}
          <PhysicalPhoto url="/media/chapter1/photo1.jpg" position={[-3.5, 0.5, -2]} rotation={[0.05, 0.1, -0.02]} scale={0.85} />
          <PhysicalPhoto url="/media/chapter1/photo2.jpg" position={[0, -0.5, -0.5]} rotation={[-0.02, -0.05, 0.05]} scale={1.1} />
          <PhysicalPhoto url="/media/chapter1/photo3.jpg" position={[3.5, 0.8, -3]} rotation={[0.1, -0.1, -0.04]} scale={0.9} />
          <PhysicalPhoto url="/media/chapter1/chat1.jpg" position={[-1.8, -2.0, -1.5]} rotation={[-0.1, 0.15, 0.02]} scale={0.7} />
          <PhysicalPhoto url="/media/chapter1/chat2.jpg" position={[2.2, -1.8, -2]} rotation={[0.05, -0.05, -0.05]} scale={0.75} />
        </a.group>
      )}
    </group>
  );
}
