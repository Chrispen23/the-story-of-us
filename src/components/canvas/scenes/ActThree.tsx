'use client';

import { useStore } from '@/store/useStore';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Html } from '@react-three/drei';
import Image from 'next/image';

const LINES = [
  "The conversations that lasted longer than they needed to.",
  "The ordinary days that somehow became my favorites.",
  "Some memories don't look important when you're living them.<br/>Funny how that changes."
];

export default function ActThree() {
  const { narrativeStep, nextStep, setAct } = useStore();
  const { camera } = useThree();
  const textRef = useRef<HTMLDivElement>(null);
  const images0Ref = useRef<HTMLDivElement>(null);
  const images2Ref = useRef<HTMLDivElement>(null);
  const [canClick, setCanClick] = useState(false);

  useEffect(() => {
    camera.position.set(0, 0, 8);
    camera.rotation.set(0, 0, 0);
    gsap.to(camera.position, { z: 5, duration: 10, ease: 'power1.out' });
  }, [camera]);

  useEffect(() => {
    const runTextAnimation = () => {
      if (!textRef.current) {
        requestAnimationFrame(runTextAnimation);
        return;
      }
      
      setCanClick(false);
      
      if (narrativeStep < LINES.length) {
        if (narrativeStep === 0) {
          textRef.current.innerHTML = LINES[narrativeStep];
          gsap.to(textRef.current, { opacity: 1, duration: 2, delay: 0.5 });
          if (images0Ref.current) {
            gsap.to(images0Ref.current, { opacity: 1, duration: 2, delay: 0.5, onComplete: () => setCanClick(true) });
          } else {
            setTimeout(() => setCanClick(true), 2500);
          }
        } else {
          // fade out everything
          gsap.to(textRef.current, { opacity: 0, duration: 1 });
          if (images0Ref.current) gsap.to(images0Ref.current, { opacity: 0, duration: 1 });
          if (images2Ref.current) gsap.to(images2Ref.current, { opacity: 0, duration: 1 });

          setTimeout(() => {
            if (textRef.current) {
              textRef.current.innerHTML = LINES[narrativeStep];
              gsap.to(textRef.current, { opacity: 1, duration: 2, delay: 0.5 });
              
              if (narrativeStep === 2 && images2Ref.current) {
                gsap.to(images2Ref.current, { opacity: 1, duration: 2, delay: 0.5, onComplete: () => setCanClick(true) });
              } else {
                setTimeout(() => setCanClick(true), 2500);
              }
            }
          }, 1000);
        }
      } else {
        gsap.to(textRef.current, { opacity: 0, duration: 2 });
        if (images2Ref.current) gsap.to(images2Ref.current, { opacity: 0, duration: 2 });
        gsap.to(camera.position, { z: -5, duration: 3, ease: 'power2.inOut', onComplete: () => {
          setAct('act4');
        }});
      }
    };

    runTextAnimation();
  }, [narrativeStep, camera, setAct]);

  return (
    <group>
      <mesh 
        position={[0, 0, 0]} 
        onClick={() => { if (canClick) nextStep(); }}
        onPointerOver={() => { if (canClick) document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html position={[0, 0, 0]} center>
        <div className="w-[1000px] h-[800px] text-center flex flex-col items-center justify-center gap-12 pointer-events-none relative scale-[0.35] sm:scale-[0.5] md:scale-75 lg:scale-100 origin-center">
          
          <div ref={images0Ref} className="opacity-0 absolute top-0 left-0 w-full h-full pointer-events-none">
             <div className="absolute top-1/2 left-[-150px] -translate-y-1/2 w-[300px] h-[500px] rounded-lg overflow-hidden shadow-2xl border border-white/10 rotate-[-8deg]">
                <Image src="/media/images/act3/chat1.jpeg" alt="Chat 1" fill className="object-cover" />
             </div>
             <div className="absolute top-1/2 right-[-150px] -translate-y-1/2 w-[300px] h-[500px] rounded-lg overflow-hidden shadow-2xl border border-white/10 rotate-[6deg]">
                <Image src="/media/images/act3/chat2.jpeg" alt="Chat 2" fill className="object-cover" />
             </div>
          </div>

          <div ref={images2Ref} className="opacity-0 absolute top-0 left-0 w-full h-full pointer-events-none">
             {/* Left portrait (mem1) */}
             <div className="absolute top-1/2 left-[-200px] -translate-y-1/2 w-[250px] h-[350px] rounded-lg overflow-hidden shadow-2xl border border-white/10 rotate-[-4deg]">
                <Image src="/media/images/act3/mem1.jpg" alt="Memory 1" fill className="object-cover" />
             </div>
             
             {/* Right portrait (mem3) */}
             <div className="absolute top-1/2 right-[-200px] -translate-y-1/2 w-[250px] h-[350px] rounded-lg overflow-hidden shadow-2xl border border-white/10 rotate-[5deg]">
                <Image src="/media/images/act3/mem3.jpg" alt="Memory 3" fill className="object-cover" />
             </div>

             {/* Bottom landscape (mem2) */}
             <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-lg overflow-hidden shadow-2xl border border-white/10 rotate-[1deg]">
                <Image src="/media/images/act3/mem2.jpg" alt="Memory 2" fill className="object-cover" />
             </div>
          </div>

          <div ref={textRef} className="opacity-0 font-serif-text italic text-3xl leading-[1.6] text-white/90 drop-shadow-md tracking-wide z-10 max-w-[700px] mx-auto" />

          {canClick && (
            <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2">
              <div className="animate-pulse text-white/30 text-xs tracking-widest uppercase font-sans">
                Click anywhere to continue
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
