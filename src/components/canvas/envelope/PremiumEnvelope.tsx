'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { Html, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import { useStore } from '@/store/useStore';

// === GEOMETRY GENERATOR ===
const createShapes = () => {
  const back = new THREE.Shape();
  back.moveTo(-2.4, -1.5);
  back.lineTo(2.4, -1.5);
  back.lineTo(2.4, 1.5);
  back.lineTo(-2.4, 1.5);
  back.lineTo(-2.4, -1.5);

  const left = new THREE.Shape();
  left.moveTo(-2.4, -1.5);
  left.lineTo(-2.4, 1.5);
  left.lineTo(-0.2, 0);
  left.lineTo(-2.4, -1.5);

  const right = new THREE.Shape();
  right.moveTo(2.4, -1.5);
  right.lineTo(2.4, 1.5);
  right.lineTo(0.2, 0);
  right.lineTo(2.4, -1.5);

  const bottom = new THREE.Shape();
  bottom.moveTo(-2.4, -1.5);
  bottom.lineTo(2.4, -1.5);
  bottom.lineTo(0.4, 0.4);
  bottom.quadraticCurveTo(0, 0.6, -0.4, 0.4);
  bottom.lineTo(-2.4, -1.5);

  // Hinged at y=0 locally, maps to y=1.5 on the envelope body
  const top = new THREE.Shape();
  top.moveTo(-2.4, 0);
  top.lineTo(2.4, 0);
  top.lineTo(0.4, -1.7);
  top.quadraticCurveTo(0, -1.9, -0.4, -1.7);
  top.lineTo(-2.4, 0);

  return { back, left, right, bottom, top };
};

const extrudeSettings = {
  depth: 0.002,
  bevelEnabled: true,
  bevelThickness: 0.005,
  bevelSize: 0.005,
  bevelSegments: 4,
};

// === MATERIALS ===
const paperMat = new THREE.MeshPhysicalMaterial({
  color: '#EAE3D6',
  roughness: 0.85,
  metalness: 0.05,
  clearcoat: 0.1,
  clearcoatRoughness: 0.8,
  side: THREE.DoubleSide
});

const paperDarkMat = new THREE.MeshPhysicalMaterial({
  color: '#D8CDBA', // slightly darker for folds/interior
  roughness: 0.9,
  metalness: 0.05,
  side: THREE.DoubleSide
});

const letterMat = new THREE.MeshPhysicalMaterial({
  color: '#F9F6F0',
  roughness: 0.5,
  clearcoat: 0.2,
  side: THREE.DoubleSide
});

const sealMat = new THREE.MeshPhysicalMaterial({
  color: '#5A2630',
  roughness: 0.2,
  metalness: 0.1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
});

export default function PremiumEnvelope({ onComplete }: { onComplete: () => void }) {
  const { camera } = useThree();

  // Refs
  const groupRef = useRef<THREE.Group>(null);
  const flapRef = useRef<THREE.Group>(null);
  const sealRef = useRef<THREE.Mesh>(null);
  const letterRef = useRef<THREE.Group>(null);
  const cameraTargetRef = useRef<THREE.Group>(null);
  
  // State
  const [isOpened, setIsOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const shapes = useMemo(() => createShapes(), []);

  // Initial Camera Setup
  useEffect(() => {
    camera.position.set(0, 3, 9);
    camera.lookAt(0, 0, 0);
    
    // Initial cinematic settle
    gsap.fromTo(camera.position, 
      { y: 5, z: 12 }, 
      { y: 3, z: 9, duration: 4, ease: 'power2.out' }
    );
  }, [camera]);

  // Idle Animation & Parallax
  useFrame((state) => {
    if (groupRef.current && !isOpened) {
      // Very subtle organic floating
      const time = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.02;
      groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.005;

      // Subtle mouse parallax
      const targetRotX = (state.pointer.y * Math.PI) / 30;
      const targetRotY = (state.pointer.x * Math.PI) / 20;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX - 0.2, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
    }
    
    if (isOpened) {
      camera.lookAt(0, 0, 0);
    }
  });

  // Hover Anticipation
  useEffect(() => {
    if (isOpened) return;
    if (isHovered) {
      document.body.style.cursor = 'pointer';
      gsap.to(groupRef.current!.position, { z: 0.2, duration: 0.5, ease: 'power2.out' });
      gsap.to(sealRef.current!.material, { roughness: 0.1, duration: 0.5 });
    } else {
      document.body.style.cursor = 'auto';
      gsap.to(groupRef.current!.position, { z: 0, duration: 0.8, ease: 'power2.out' });
      gsap.to(sealRef.current!.material, { roughness: 0.2, duration: 0.8 });
    }
  }, [isHovered, isOpened]);

  // Click Sequence
  const handleOpen = (e: any) => {
    e.stopPropagation();
    if (isOpened) return;
    setIsOpened(true);
    document.body.style.cursor = 'auto';

    const tl = gsap.timeline();

    // PHASE 1: Anticipation & Camera push
    tl.to(camera.position, { y: 2.5, z: 7, duration: 1.5, ease: 'power2.inOut' }, 0);
    tl.to(groupRef.current!.rotation, { x: -0.1, y: 0, z: 0, duration: 1 }, 0); 
    tl.to(groupRef.current!.position, { x: 0, y: 0, z: 0, duration: 1 }, 0);

    // PHASE 2: Seal releases
    tl.to(sealRef.current!.position, { z: 0.1, y: "-=0.05", duration: 0.4, ease: 'power2.out' }, 1.2);
    tl.to(sealRef.current!.rotation, { x: 0.2, duration: 0.4 }, 1.2);
    tl.to(sealRef.current!.material, { opacity: 0, transparent: true, duration: 0.4 }, 1.4);

    // PHASE 3: Flap opens (real hinge)
    tl.to(flapRef.current!.rotation, { x: Math.PI * 0.92, duration: 1.4, ease: 'power2.inOut' }, 1.4);

    // PHASE 4: Letter emerges
    tl.to(letterRef.current!.position, { y: 2.6, z: 0.5, duration: 2, ease: 'power3.inOut' }, 2.0);
    tl.to(letterRef.current!.rotation, { x: -0.15, duration: 2, ease: 'power3.inOut' }, 2.0);

    // PHASE 5: Camera pushes to letter
    tl.to(camera.position, { y: 2.8, z: 4.5, duration: 2.5, ease: 'power2.inOut' }, 2.4);
    
    // PHASE 6: Transition to memory constellation
    tl.add(() => {
      onComplete();
    }, 4.5);
  };

  return (
    <>
      {/* ENVIRONMENT & LIGHTING */}
      <color attach="background" args={['#0F0D0C']} />
      
      {/* Soft warm key light */}
      <directionalLight position={[2, 5, 4]} intensity={2} color="#FCEBCC" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
      {/* Cool fill light */}
      <directionalLight position={[-4, 2, 2]} intensity={0.5} color="#D2D6DF" />
      {/* Subtle rim light */}
      <spotLight position={[0, 4, -4]} intensity={1.5} color="#E8DCC4" angle={0.6} penumbra={1} castShadow />
      
      <ambientLight intensity={0.4} color="#D9CDBA" />

      {/* Dark Editorial Table Surface */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#161311" roughness={1} metalness={0} />
      </mesh>

      {/* High Quality Contact Shadows */}
      <ContactShadows position={[0, -1.99, 0]} opacity={0.6} scale={15} blur={1.5} far={4} color="#000000" />

      {/* ENVELOPE ASSEMBLY */}
      <group 
        ref={groupRef}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onClick={handleOpen}
      >
        {/* Back Wall */}
        <mesh position={[0, 0, -0.02]} castShadow receiveShadow material={paperMat}>
          <extrudeGeometry args={[shapes.back, extrudeSettings]} />
        </mesh>

        {/* Letter (Inside) */}
        <group ref={letterRef} position={[0, -0.1, 0.01]}>
          <mesh castShadow receiveShadow material={letterMat}>
            <extrudeGeometry args={[shapes.back, { ...extrudeSettings, depth: 0.001 }]} />
          </mesh>
          <Html transform position={[0, 0, 0.003]} distanceFactor={2} zIndexRange={[100, 0]}>
            <div className="w-[450px] h-[280px] flex flex-col items-center justify-center pointer-events-none opacity-90 p-8">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-taupe mb-6 border-b border-muted-taupe/30 pb-2">05 September 2023</p>
              <h1 style={{ fontFamily: 'var(--font-script)' }} className="text-7xl text-deep-espresso drop-shadow-sm leading-tight">Viviana</h1>
              <p className="font-serif-text italic text-lg text-deep-espresso/70 mt-6">The beginning of us.</p>
            </div>
          </Html>
        </group>

        {/* Left Flap */}
        <mesh position={[0, 0, 0.02]} castShadow receiveShadow material={paperDarkMat}>
          <extrudeGeometry args={[shapes.left, extrudeSettings]} />
        </mesh>

        {/* Right Flap */}
        <mesh position={[0, 0, 0.022]} castShadow receiveShadow material={paperDarkMat}>
          <extrudeGeometry args={[shapes.right, extrudeSettings]} />
        </mesh>

        {/* Bottom Flap */}
        <mesh position={[0, 0, 0.025]} castShadow receiveShadow material={paperMat}>
          <extrudeGeometry args={[shapes.bottom, extrudeSettings]} />
        </mesh>

        {/* Top Flap (Hinged) */}
        <group ref={flapRef} position={[0, 1.5, 0.03]}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow material={paperMat}>
            <extrudeGeometry args={[shapes.top, extrudeSettings]} />
          </mesh>
          
          {/* Wax Seal - Attached to Flap */}
          <mesh ref={sealRef} position={[0, -1.5, 0.02]} castShadow receiveShadow material={sealMat}>
            {/* Organic, slightly squashed shape for realism */}
            <cylinderGeometry args={[0.35, 0.36, 0.04, 32]} rotation={[Math.PI/2, 0, 0]} />
            {/* Subtle inner depression mimicking a stamp */}
            <mesh position={[0, 0, 0.02]}>
               <cylinderGeometry args={[0.25, 0.3, 0.02, 32]} rotation={[Math.PI/2, 0, 0]} />
               <meshPhysicalMaterial color="#4A1E26" roughness={0.3} metalness={0.2} />
            </mesh>
          </mesh>
        </group>

      </group>
    </>
  );
}
