'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';
import { Html } from '@react-three/drei';

interface HiddenNoteProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  text: string;
  onClick?: () => void;
  active?: boolean;
}

export default function HiddenNote({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  text,
  onClick,
  active = true,
}: HiddenNoteProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const { springScale, springRot, springPos } = useSpring({
    springScale: hovered && active ? scale * 1.05 : scale,
    springRot: hovered && active ? [rotation[0], rotation[1], rotation[2] + 0.05] : rotation,
    springPos: hovered && active ? [position[0], position[1], position[2] + 0.2] : position,
    config: { mass: 2, tension: 170, friction: 40 },
  });

  return (
    <a.group
      ref={groupRef}
      position={springPos as any}
      rotation={springRot as any}
      scale={springScale}
      onClick={(e) => {
        if (active && onClick) {
          e.stopPropagation();
          onClick();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }
      }}
      onPointerOver={(e) => { 
        if (active) {
          e.stopPropagation(); 
          setHovered(true); 
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={(e) => { 
        if (active) {
          setHovered(false); 
          document.body.style.cursor = 'auto';
        }
      }}
    >
      <mesh castShadow receiveShadow>
        <planeGeometry args={[2.5, 1.5]} />
        <meshStandardMaterial color="#F3EEE5" roughness={0.8} />
      </mesh>
      <Html transform position={[0, 0, 0.01]} distanceFactor={2} zIndexRange={[50, 0]} pointerEvents="none">
        <div className="w-[300px] text-center pointer-events-none opacity-80" style={{ fontFamily: 'var(--font-script)' }}>
          <p className="text-xl text-deep-espresso drop-shadow-sm leading-relaxed">{text}</p>
        </div>
      </Html>
    </a.group>
  );
}
