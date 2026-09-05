'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Html } from '@react-three/drei';

export default function Payoff() {
  const { camera } = useThree();
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start at a slight depth and pull back smoothly
    camera.position.set(0, 0, 0);
    gsap.to(camera.position, { z: 5, duration: 10, ease: 'power1.out' });

    const runTextAnimation = () => {
      if (!textRef.current) {
        requestAnimationFrame(runTextAnimation);
        return;
      }
      gsap.to(textRef.current, { opacity: 1, duration: 4, delay: 1 });
    };

    runTextAnimation();
  }, [camera]);

  return (
    <group>
      <Html position={[0, 0, 0]} center>
        <div 
          ref={textRef}
          className="w-[800px] text-center flex flex-col items-center gap-12 opacity-0 pointer-events-none"
        >
          <div className="font-sans text-sm tracking-[0.4em] text-muted-taupe border-b border-muted-taupe/30 pb-4">
            05 SEPTEMBER 2023 â€” 05 SEPTEMBER 2026
          </div>
          
          <h1 className="text-5xl font-serif-text text-white/90 tracking-wider">
            THREE YEARS OF US.
          </h1>

          <div className="font-serif italic text-2xl text-white/70 mt-8" style={{ fontFamily: 'var(--font-script)' }}>
            [ INSERT YOUR FINAL MESSAGE HERE ]
          </div>
        </div>
      </Html>
    </group>
  );
}
