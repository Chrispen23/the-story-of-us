'use client';

import { Html } from '@react-three/drei';
import PhysicalVideo from '../objects/PhysicalVideo';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function ChapterFour() {
  const groupRef = useRef<THREE.Group>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current && htmlRef.current) {
      const worldPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPosition);
      const dist = camera.position.z - worldPosition.z;
      
      let opacity = 0;
      // Keep it visible as the final chapter (doesn't fade out when close)
      if (dist < 15) {
        opacity = 1 - Math.max(0, (dist - 8.5) / 5);
      }
      
      htmlRef.current.style.opacity = Math.max(0, opacity).toString();
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -45]}>
      {/* Subtle HTML typography */}
      <Html center position={[0, 3, -1]} zIndexRange={[50, 0]} className="pointer-events-none">
        <div ref={htmlRef} className="flex flex-col items-center justify-center w-[800px] text-center transition-opacity duration-700">
          <h2 className="font-[family-name:var(--font-script)] text-7xl text-soft-ivory drop-shadow-sm mb-4">To be continued...</h2>
          <p className="font-serif-text text-muted-taupe text-lg tracking-widest uppercase">The Story of Us</p>
        </div>
      </Html>

      {/* Cinematic Videos - Chapter 4 */}
      <PhysicalVideo url="/media/chapter4/video1.mp4" position={[-2.5, 0, -2]} rotation={[0.02, 0.1, -0.02]} scale={0.9} />
      <PhysicalVideo url="/media/chapter4/video2.mp4" position={[2.5, -0.5, -3]} rotation={[-0.02, -0.1, 0.04]} scale={1.1} />
    </group>
  );
}
