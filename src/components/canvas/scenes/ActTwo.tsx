'use client';

import { useStore } from '@/store/useStore';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Html } from '@react-three/drei';
import InteractivePhoto from '../objects/InteractivePhoto';
import HiddenNote from '../objects/HiddenNote';
import * as THREE from 'three';

export default function ActTwo() {
  const { narrativeStep, nextStep, setAct } = useStore();
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Initialize camera position for this act
  useEffect(() => {
    gsap.to(camera.position, { x: 0, y: 0, z: 8, duration: 2, ease: 'power2.out' });
  }, []);

  // Handle textual transitions based on step
  useEffect(() => {
    if (!textRef.current) return;
    
    // Fade out text briefly, update content, fade in
    gsap.to(textRef.current, { 
      opacity: 0, 
      duration: 0.5, 
      onComplete: () => {
        if (textRef.current) {
          switch(narrativeStep) {
            case 0:
              textRef.current.innerHTML = "<p>05 September 2023</p><p style='font-family: var(--font-serif)'>I didn't know it yet, but this would become<br/>one of the dates I'd never forget.</p>";
              break;
            case 1:
              textRef.current.innerHTML = "<p style='font-family: var(--font-serif)'>We were just friends.</p><p style='font-family: var(--font-serif)'>At least, that's what we called it.</p>";
              break;
            case 2:
              textRef.current.innerHTML = ""; // Let the note speak
              break;
            case 3:
              textRef.current.innerHTML = "<p style='font-family: var(--font-serif)'>Some memories don't look important when you're living them.</p><p style='font-family: var(--font-serif)'>Funny how that changes.</p>";
              break;
          }
          gsap.to(textRef.current, { opacity: 1, duration: 1 });
        }
      }
    });

  }, [narrativeStep]);

  // Object choreography based on steps
  useEffect(() => {
    if (!groupRef.current) return;
    
    const p1 = groupRef.current.getObjectByName('photo1');
    const p2 = groupRef.current.getObjectByName('photo2');
    const note = groupRef.current.getObjectByName('note1');
    
    if (narrativeStep === 0) {
      if (p1) gsap.to(p1.position, { y: 0, z: 0, duration: 2, ease: 'power2.out' });
    }
    else if (narrativeStep === 1) {
      if (p1) gsap.to(p1.position, { x: -3, y: 1, z: -2, duration: 1.5, ease: 'power2.inOut' });
      if (p1) gsap.to(p1.rotation, { z: -0.2, duration: 1.5, ease: 'power2.inOut' });
      
      if (p2) {
        gsap.to(p2.position, { x: 0, y: 0, z: 0, duration: 1.5, ease: 'power2.out' });
      }
    }
    else if (narrativeStep === 2) {
      // User clicked photo2, revealing a note underneath
      if (p2) gsap.to(p2.position, { x: 3, y: -1, z: -2, duration: 1.5, ease: 'power2.inOut' });
      if (p2) gsap.to(p2.rotation, { z: 0.2, duration: 1.5, ease: 'power2.inOut' });
      
      if (note) gsap.to(note.position, { z: 0, duration: 1, ease: 'power2.out' });
    }
    else if (narrativeStep === 3) {
      // Camera pushes past into the darkness to transition to Act 3
      gsap.to(camera.position, { z: -10, duration: 3, ease: 'power2.inOut', onComplete: () => {
        setAct('act3');
      }});
      if (textRef.current) gsap.to(textRef.current, { opacity: 0, duration: 1 });
    }

  }, [narrativeStep]);

  return (
    <group ref={groupRef}>
      {/* HTML Narrative Layer */}
      <Html position={[0, 3, 0]} center zIndexRange={[50, 0]}>
        <div ref={textRef} className="w-[800px] text-center opacity-0 flex flex-col gap-4 text-white drop-shadow-md text-xl tracking-wide pointer-events-none" />
      </Html>

      {/* Memory Objects */}
      <group name="photo1" position={[0, -5, -5]}>
         <InteractivePhoto 
           url="/media/chapter1/photo1.jpg" 
           active={narrativeStep === 0} 
           onClick={() => nextStep()} 
         />
      </group>

      <group name="photo2" position={[0, -5, -5]}>
         <InteractivePhoto 
           url="/media/chapter1/photo2.jpg" 
           active={narrativeStep === 1} 
           onClick={() => nextStep()} 
           rotation={[0, 0, 0.1]}
         />
      </group>

      <group name="note1" position={[0, 0, -5]}>
         <HiddenNote 
           text="You probably don't remember this..." 
           active={narrativeStep === 2} 
           onClick={() => nextStep()}
           rotation={[0, 0, -0.1]}
         />
      </group>
    </group>
  );
}
