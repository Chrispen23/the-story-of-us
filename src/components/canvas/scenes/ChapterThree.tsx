'use client';

import { Html } from '@react-three/drei';
import PhysicalPhoto from '../objects/PhysicalPhoto';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function ChapterThree() {
  const groupRef = useRef<THREE.Group>(null);
  const htmlRef = useRef<HTMLDivElement>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current && htmlRef.current) {
      const worldPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPosition);
      const dist = camera.position.z - worldPosition.z;
      
      let opacity = 0;
      if (dist > 4 && dist < 12) {
        opacity = 1 - Math.abs(dist - 8.5) / 3.5; // peaks at 8.5
      }
      
      htmlRef.current.style.opacity = Math.max(0, opacity).toString();
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -30]}>
      {/* Subtle HTML typography */}
      <Html center position={[0, 2.5, -1]} zIndexRange={[50, 0]} className="pointer-events-none">
        <div ref={htmlRef} className="flex flex-col items-center justify-center w-[800px] text-center transition-opacity duration-300">
          <h2 className="font-serif-display text-5xl text-soft-ivory tracking-wide mb-4">Now & Always</h2>
          <p className="font-serif-text text-muted-taupe text-xl italic">Present Day</p>
        </div>
      </Html>

      {/* Floating Constellation - Chapter 3 */}
      <PhysicalPhoto url="/media/chapter3/photo1.jpg" position={[-3.5, 0.5, -3]} rotation={[0.04, 0.15, -0.02]} scale={0.9} />
      <PhysicalPhoto url="/media/chapter3/photo2.jpg" position={[0, -0.5, -1]} rotation={[-0.03, -0.05, 0.04]} scale={1.2} />
      <PhysicalPhoto url="/media/chapter3/photo3.jpg" position={[3.5, 0.8, -4]} rotation={[0.08, -0.12, -0.05]} scale={0.8} />
      <PhysicalPhoto url="/media/chapter3/photo4.jpg" position={[-2.2, -2.5, -2]} rotation={[-0.1, 0.1, 0.03]} scale={0.75} />
      <PhysicalPhoto url="/media/chapter3/photo5.jpg" position={[2.2, -2.2, -2.5]} rotation={[0.05, -0.1, -0.02]} scale={0.85} />
      <PhysicalPhoto url="/media/chapter3/photo6.jpg" position={[0, 1.8, -5]} rotation={[0.02, -0.02, 0.05]} scale={1.0} />
    </group>
  );
}
