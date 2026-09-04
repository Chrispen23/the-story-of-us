'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import * as THREE from 'three';
import { Html, RoundedBox } from '@react-three/drei';

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [opened, setOpened] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const letterRef = useRef<THREE.Mesh>(null);

  // Cinematic springs for the opening sequence
  const { flapRot, paperY, paperZ, paperRotX, groupZ, groupRotX, sealScale, sealY } = useSpring({
    flapRot: opened ? Math.PI * 0.9 : 0, // Opens up, slightly over 180 degrees
    paperY: opened ? 2.5 : 0, // Letter pulls out
    paperZ: opened ? 1.5 : -0.01, // Letter moves forward towards camera
    paperRotX: opened ? -Math.PI / 16 : 0, // Letter tilts towards user
    groupZ: opened ? -1 : 0, // Envelope pushes back slightly
    groupRotX: opened ? Math.PI / 8 : 0, // Envelope tilts away
    sealScale: opened ? 0 : 1, // Seal shrinks/pops
    sealY: opened ? 0.2 : 0.05,
    config: { mass: 2, tension: 70, friction: 20 },
    onRest: () => {
      if (opened) setTimeout(onOpen, 800);
    }
  });

  useFrame((state) => {
    if (groupRef.current && !opened) {
      // 3D Parallax effect reacting to mouse
      const targetX = (state.pointer.y * Math.PI) / 8;
      const targetY = (state.pointer.x * Math.PI) / 6;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
      
      // Gentle breathing
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  const handleInteract = (e: any) => {
    e.stopPropagation();
    if (!opened) setOpened(true);
  };

  // Create elegant triangle shapes for the flaps
  const topFlapShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-2.05, 0); // slightly wider to cover edges
    shape.lineTo(2.05, 0);
    shape.lineTo(0.2, -1.3);
    shape.quadraticCurveTo(0, -1.4, -0.2, -1.3); // rounded tip
    shape.lineTo(-2.05, 0);
    return shape;
  }, []);

  const bottomFlapShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-2, -1.5);
    shape.lineTo(2, -1.5);
    shape.lineTo(0.2, 0.4);
    shape.quadraticCurveTo(0, 0.5, -0.2, 0.4);
    shape.lineTo(-2, -1.5);
    return shape;
  }, []);

  return (
    <a.group 
      ref={groupRef} 
      position-z={groupZ} 
      rotation-x={groupRotX as any}
      onClick={handleInteract}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* Main Body (Back of the envelope) */}
      <RoundedBox args={[4.1, 2.6, 0.02]} radius={0.05} position={[0, -0.25, -0.05]} castShadow receiveShadow>
        <meshStandardMaterial color="#C8A875" roughness={0.8} />
      </RoundedBox>

      {/* The Letter inside */}
      <a.mesh position-y={paperY} position-z={paperZ} rotation-x={paperRotX as any} castShadow>
        <planeGeometry args={[3.8, 2.4]} />
        <meshPhysicalMaterial 
          color="#F9F6F0" 
          roughness={0.5} 
          clearcoat={0.2} 
        />
        <Html transform position={[0, 0, 0.01]} distanceFactor={2}>
          <div className="w-[300px] h-[200px] flex flex-col items-center justify-center p-4">
            <p className="font-[family-name:var(--font-script)] text-5xl text-deep-espresso opacity-90 drop-shadow-sm mb-4">Viviana</p>
            <p className="font-sans uppercase tracking-[0.2em] text-[8px] text-muted-taupe">05 September 2026</p>
          </div>
        </Html>
      </a.mesh>

      {/* Bottom Flap (stationary) */}
      <mesh position={[0, 0.5, 0.01]} receiveShadow castShadow>
        <shapeGeometry args={[bottomFlapShape]} />
        <meshStandardMaterial color="#D9CDBA" roughness={0.9} />
      </mesh>

      {/* Top Flap (animates open) */}
      <a.group position={[0, 1.25, 0.02]} rotation-x={flapRot as any}>
        {/* We need to offset the geometry so it hinges at the top edge */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <shapeGeometry args={[topFlapShape]} />
          <meshStandardMaterial color="#E9E0D1" roughness={0.8} />
        </mesh>
      </a.group>

      {/* Wax Seal */}
      <a.mesh position-x={0} position-y={sealY} position-z={0.03} scale={sealScale} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 32]} />
        <meshPhysicalMaterial 
          color="#5A2630" // Deep Burgundy
          roughness={0.2} 
          metalness={0.3} 
          clearcoat={1}
        />
      </a.mesh>

      {/* Interactive CTA */}
      {!opened && (
        <Html center position={[0, -2, 0]}>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-soft-ivory animate-pulse pointer-events-none drop-shadow-md">
            Click to Open
          </p>
        </Html>
      )}
    </a.group>
  );
}
