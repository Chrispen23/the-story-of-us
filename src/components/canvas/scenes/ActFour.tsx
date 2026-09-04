'use client';

import { useStore } from '@/store/useStore';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const PRE_LINES = [
  "You've seen where it began.",
  "You've seen the memories.",
  "But there's one thing I saved for you."
];

export default function ActFour() {
  const { narrativeStep, nextStep, setAct } = useStore();
  const { camera } = useThree();
  const textRef = useRef<HTMLDivElement>(null);
  const letterMeshRef = useRef<THREE.Mesh>(null);
  const letterHtmlRef = useRef<HTMLDivElement>(null);
  const [canClick, setCanClick] = useState(false);

  useEffect(() => {
    gsap.to(camera.position, { x: 0, y: 0, z: 5, duration: 0 });
    gsap.to(camera.rotation, { x: 0, y: 0, z: 0, duration: 0 });
    
    // Hide letter initially
    if (letterMeshRef.current) {
      letterMeshRef.current.position.y = -10;
      letterMeshRef.current.rotation.x = -Math.PI / 4;
    }
  }, []);

  useEffect(() => {
    setCanClick(false);
    
    if (narrativeStep < PRE_LINES.length) {
      if (!textRef.current) return;
      gsap.to(textRef.current, { 
        opacity: 0, 
        duration: 1, 
        onComplete: () => {
          if (textRef.current) {
            textRef.current.innerText = PRE_LINES[narrativeStep];
            gsap.to(textRef.current, { 
              opacity: 1, 
              duration: 2, 
              delay: 0.5,
              onComplete: () => setCanClick(true)
            });
          }
        }
      });
    } else if (narrativeStep === PRE_LINES.length) {
      // Bring up the letter
      if (textRef.current) gsap.to(textRef.current, { opacity: 0, duration: 1 });
      
      if (letterMeshRef.current) {
        gsap.to(letterMeshRef.current.position, { y: 0, duration: 3, ease: 'power3.out' });
        gsap.to(letterMeshRef.current.rotation, { x: 0, duration: 3, ease: 'power3.out' });
        gsap.to(camera.position, { z: 3, duration: 4, ease: 'power2.inOut', onComplete: () => {
          if (letterHtmlRef.current) {
            gsap.to(letterHtmlRef.current, { opacity: 1, duration: 2 });
            setCanClick(true);
          }
        }});
      }
    } else if (narrativeStep > PRE_LINES.length) {
      // Transition to Payoff
      gsap.to(camera.position, { z: 0, duration: 3, ease: 'power2.in' });
      if (letterHtmlRef.current) gsap.to(letterHtmlRef.current, { opacity: 0, duration: 1 });
      if (letterMeshRef.current) gsap.to(letterMeshRef.current.material, { opacity: 0, duration: 2, transparent: true, onComplete: () => {
        setAct('payoff');
      }});
    }
  }, [narrativeStep]);

  return (
    <group>
      {/* Invisible click plane */}
      <mesh 
        position={[0, 0, 1]} 
        onClick={() => { if (canClick) nextStep(); }}
        onPointerOver={() => { if (canClick) document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>

      <Html position={[0, 0, 0]} center zIndexRange={[50, 0]}>
        <div className="w-[800px] text-center flex flex-col gap-8 pointer-events-none">
          <div ref={textRef} className="opacity-0 font-serif-text italic text-3xl text-white/90 drop-shadow-md tracking-wide" />
          {canClick && narrativeStep < PRE_LINES.length && (
            <div className="animate-pulse text-white/30 text-xs tracking-widest uppercase font-sans mt-12">
              Click to continue
            </div>
          )}
        </div>
      </Html>

      {/* The Physical Letter */}
      <mesh ref={letterMeshRef} castShadow receiveShadow position={[0, -10, -0.5]}>
        <planeGeometry args={[4, 6]} />
        <meshStandardMaterial color="#F9F6F0" roughness={0.9} metalness={0.1} />
        
        <Html transform position={[0, 0, 0.01]} distanceFactor={2} zIndexRange={[100, 0]}>
          <div 
            ref={letterHtmlRef}
            className="w-[500px] h-[750px] opacity-0 flex flex-col items-center justify-center p-12 text-center pointer-events-none"
            style={{ 
              fontFamily: 'var(--font-serif)',
              color: '#3A2E28',
              background: 'transparent'
            }}
          >
            <h2 className="text-4xl mb-8" style={{ fontFamily: 'var(--font-script)' }}>My Dearest,</h2>
            <div className="text-lg leading-loose space-y-6 flex-1 text-deep-espresso/80">
              <p>[ INSERT YOUR PERSONAL LETTER HERE ]</p>
              <p>This is where the actual letter will go. It will be revealed beautifully and physically onto the page.</p>
              <p>For now, click anywhere to see the final payoff.</p>
            </div>
            {canClick && narrativeStep === PRE_LINES.length && (
              <div className="animate-pulse text-deep-espresso/40 text-xs tracking-widest uppercase font-sans mt-8">
                Click to fold away
              </div>
            )}
          </div>
        </Html>
      </mesh>
    </group>
  );
}
