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
    // Set initial position and slowly push in
    camera.position.set(0, 0, 8);
    camera.rotation.set(0, 0, 0);
    gsap.to(camera.position, { z: 5, duration: 10, ease: 'power1.out' });
    
    // Hide letter initially
    if (letterMeshRef.current) {
      letterMeshRef.current.position.y = -10;
      letterMeshRef.current.rotation.x = -Math.PI / 4;
    }
  }, []);

  useEffect(() => {
    const runTextAnimation = () => {
      // Need both refs depending on the step
      if (narrativeStep < PRE_LINES.length && !textRef.current) {
        requestAnimationFrame(runTextAnimation);
        return;
      }
      
      setCanClick(false);
      
      if (narrativeStep < PRE_LINES.length) {
        if (narrativeStep === 0) {
          if (textRef.current) {
            textRef.current.innerText = PRE_LINES[narrativeStep];
            gsap.to(textRef.current, { 
              opacity: 1, 
              duration: 2, 
              delay: 0.5,
              onComplete: () => setCanClick(true)
            });
          }
        } else {
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
        }
      } else if (narrativeStep === PRE_LINES.length) {
        // Show letter
        if (textRef.current) gsap.to(textRef.current, { opacity: 0, duration: 2 });
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
    };

    runTextAnimation();
  }, [narrativeStep, camera, setAct]);

  return (
    <group>
      {/* Invisible click plane */}
      <mesh 
        position={[0, 0, 1]} 
        onClick={() => { if (canClick) nextStep(); }}
        onPointerOver={() => { if (canClick) document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html position={[0, 0, 0]} center>
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
            className="w-[500px] h-[750px] opacity-0 flex flex-col items-center justify-start p-12 text-center pointer-events-auto overflow-y-auto custom-scrollbar"
            style={{ 
              fontFamily: 'var(--font-serif)',
              color: '#3A2E28',
              background: 'transparent'
            }}
            onClick={(e) => e.stopPropagation()}
          >
              <h2 className="text-3xl mb-6 mt-2 text-center flex-shrink-0" style={{ fontFamily: 'var(--font-script)' }}>Dear Best Friend,</h2>
              <div className="text-[11.5px] leading-relaxed space-y-3 flex-1 text-deep-espresso/90 text-left">
                <p>This is for you. I cannot measure how much you have done for me and things you have sacrificed for me, your impact in my life is visible, your love is visible, your care is visible, your support is visible, your value is visible and I don't think I can match that value. Since the day we met on the 5th of September 2023, you have impacted me in a big way, your life speaks so much of Christ's transformation, and I admire that.</p>
                
                <p>You have been one of the few people to support me in everything, without ridicule and with no sense of half hearted-ness (if that's a word😂), and for that, I appreciate your value, your worth. Sure I cannot see it fully how God sees it, but I see the picture, and I thank God for allowing me to see it, its a beautiful picture, truly and genuinely crafted and painted by God Himself. I can only admire that picture and show love in the many ways I can, even if I am far, I still remember. Psalms 7:17 calls me to give thanks to the Lord due to His righteousness, and I thank God for you, for thinking about you, for crafting you, for making you who you are, for creating you, for protecting you, for everything He has done for you, God is really great to you and I am thankful to Him.</p>
                
                <p>And as His son, I hope I can love you and care for you according to His standards, if not, I pray He trains me, I would rather prefer prolonging the marriage to make sure He now calls me fit to be your life partner but I thank God for bringing you in my life. On this day, 3 years ago, whoever knew this girl in an orange dress who sat beside me would have this huge impact in my life and mean so much to me, I wouldn't have even imagined it, I always thought people come and go, apart from family, no one stayed, but you did, you did more than stay.</p>
                
                <p>I have flaws, many of them, things people would probably detach from because of them, but you stayed. I don't know what you saw, but I am glad you stayed, you helped heal a part of me that never kept people close. If you ask me honestly, you are way above my level, in Shona people would say, "arikutanha dzaasingasvikire" meaning, "he is trying to reach for what he cannot reach," and for me, I see you at the very top, at a height higher than the Burj Khalifa. I don't know where I am, but I want you to stay there, and go higher than that, be the best because you are the best.</p>
                
                <p>On this day, I acknowledge your value as my best friend, you mean so much to me, and I appreciate your value in my life. It's only 3 days till our 1 year and 7 months anniversary, and technically, today is our Best Friend Anniversary, so I will be your best friend today. Best friend, I am sorry if I am crossing boundaries, but I think I have a crush on you, better yet, I think it's more than that. I tried to hold it in, but I admire you so much, and your value and your walk with God and your love for Jesus, I tried being only your friend, but when it came to you, I couldn't help not protecting you and providing for you.</p>

                <p>I would really love to call you my amor, it's no pressure, I just want to convey my feelings to you, this is where I stand, I hope you get to enjoy this small gesture I prepared for you. I will end it here before it ends up a whole book website😂</p>
                
                <p className="mt-6 text-right italic font-serif text-sm">Love from Chris (Your Best Friend)</p>
              </div>
            {canClick && narrativeStep === PRE_LINES.length && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  nextStep();
                }}
                className="animate-pulse flex-shrink-0 text-deep-espresso/60 hover:text-deep-espresso text-xs tracking-widest uppercase font-sans mt-10 mb-4 py-3 px-6 border border-deep-espresso/20 rounded cursor-pointer transition-colors"
              >
                Click here to fold away
              </button>
            )}
          </div>
        </Html>
      </mesh>
    </group>
  );
}
