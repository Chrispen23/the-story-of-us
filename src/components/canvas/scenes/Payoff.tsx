'use client';

import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Html } from '@react-three/drei';
import Image from 'next/image';

export default function Payoff() {
  const { camera } = useThree();
  const textRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const rightImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start at a slight depth and pull back smoothly
    camera.position.set(0, 0, 0);
    gsap.to(camera.position, { z: 5, duration: 10, ease: 'power1.out' });

    const runTextAnimation = () => {
      if (!textRef.current || !leftImageRef.current || !rightImageRef.current) {
        requestAnimationFrame(runTextAnimation);
        return;
      }
      gsap.to(textRef.current, { opacity: 1, duration: 4, delay: 1 });
      gsap.to(leftImageRef.current, { opacity: 1, x: 0, duration: 4, delay: 2, ease: 'power2.out' });
      gsap.to(rightImageRef.current, { opacity: 1, x: 0, duration: 4, delay: 2.5, ease: 'power2.out' });
    };

    runTextAnimation();
  }, [camera]);

  return (
    <group>
      <Html position={[0, 0, 0]} center>
        <div className="w-[1200px] h-[600px] relative flex justify-center items-center pointer-events-none">
          
          <div 
            ref={leftImageRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[350px] h-[450px] opacity-0 -translate-x-12 rounded-lg overflow-hidden shadow-2xl border border-white/10 rotate-[-4deg]"
          >
             <Image src="/media/images/payoff/left.jpg" alt="Memory" fill className="object-cover" />
          </div>

          <div 
            ref={textRef}
            className="w-[600px] text-center flex flex-col items-center gap-12 opacity-0 z-10"
          >
            <div className="font-sans text-sm tracking-[0.4em] text-muted-taupe border-b border-muted-taupe/30 pb-4">
              05 SEPTEMBER 2023 — 05 SEPTEMBER 2026
            </div>
            
            <h1 className="text-5xl font-serif-text text-white/90 tracking-wider">
              THREE YEARS OF US.
            </h1>

            <div className="font-serif italic text-3xl text-white/90 mt-8" style={{ fontFamily: 'var(--font-script)' }}>
              Happy 3 Year Best Friend Anniversary Vivs
            </div>
          </div>

          <div 
            ref={rightImageRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[450px] opacity-0 translate-x-12 rounded-lg overflow-hidden shadow-2xl border border-white/10 rotate-[5deg]"
          >
             <Image src="/media/images/payoff/right.jpeg" alt="Memory" fill className="object-cover" />
          </div>

        </div>
      </Html>
    </group>
  );
}
