'use client';

import { useStore } from '@/store/useStore';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Html } from '@react-three/drei';

const LINES = [
  "The conversations that lasted longer than they needed to.",
  "The ordinary days that somehow became my favorites.",
  "The moments neither of us thought would matter.",
  "The little things I never want to forget."
];

export default function ActThree() {
  const { narrativeStep, nextStep, setAct } = useStore();
  const { camera } = useThree();
  const textRef = useRef<HTMLDivElement>(null);
  const [canClick, setCanClick] = useState(false);

  useEffect(() => {
    // Reset camera position for this act instantly
    camera.position.set(0, 0, 5);
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    if (!textRef.current) return;
    setCanClick(false);
    
    if (narrativeStep < LINES.length) {
      if (narrativeStep === 0) {
        // First line: appear immediately without waiting for fade-out
        if (textRef.current) {
          textRef.current.innerText = LINES[narrativeStep];
          gsap.to(textRef.current, { 
            opacity: 1, 
            duration: 2, 
            delay: 0.5,
            onComplete: () => setCanClick(true)
          });
        }
      } else {
        // Subsequent lines: fade out old text first
        gsap.to(textRef.current, { 
          opacity: 0, 
          duration: 1, 
          onComplete: () => {
            if (textRef.current) {
              textRef.current.innerText = LINES[narrativeStep];
              gsap.to(textRef.current, { 
                opacity: 1, 
                duration: 2, 
                delay: 0.5,
                onComplete: () => setCanClick(true)
              });
            }
          }
        });
      }
    } else {
      // Transition to Act 4
      gsap.to(textRef.current, { opacity: 0, duration: 2 });
      gsap.to(camera.position, { z: -5, duration: 3, ease: 'power2.inOut', onComplete: () => {
        setAct('act4');
      }});
    }
  }, [narrativeStep]);

  return (
    <group>
      {/* Invisible click plane to progress text */}
      <mesh 
        position={[0, 0, 0]} 
        onClick={() => { if (canClick) nextStep(); }}
        onPointerOver={() => { if (canClick) document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html position={[0, 0, 0]} center zIndexRange={[50, 0]}>
        <div className="w-[800px] text-center flex flex-col gap-8 pointer-events-none">
          <div ref={textRef} className="opacity-0 font-serif-text italic text-3xl text-white/90 drop-shadow-md tracking-wide" />
          {canClick && (
            <div className="animate-pulse text-white/30 text-xs tracking-widest uppercase font-sans mt-12">
              Click anywhere to continue
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
