'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';

interface InteractivePhotoProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onClick?: () => void;
  active?: boolean;
}

export default function InteractivePhoto({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onClick,
  active = true,
}: InteractivePhotoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(url);
  const [hovered, setHovered] = useState(false);

  // Get image aspect ratio
  const img = texture.image as any;
  const aspect = img ? img.width / img.height : 1;
  const width = aspect > 1 ? 3 : 3 * aspect;
  const height = aspect > 1 ? 3 / aspect : 3;

  const { springScale, springRot, springPos } = useSpring({
    springScale: hovered && active ? scale * 1.05 : scale,
    springRot: hovered && active ? [rotation[0] - 0.05, rotation[1] + 0.05, rotation[2]] : rotation,
    springPos: hovered && active ? [position[0], position[1], position[2] + 0.2] : position,
    config: { mass: 2, tension: 170, friction: 40 },
  });

  // Physical drift
  useFrame((state) => {
    if (groupRef.current && !hovered) {
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.0005;
    }
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
      {/* Paper backing */}
      <mesh castShadow receiveShadow position={[0, 0, -0.02]}>
        <planeGeometry args={[width + 0.2, height + 0.2]} />
        <meshStandardMaterial color="#D9CDBA" roughness={0.9} transparent opacity={1} />
      </mesh>

      {/* The photograph */}
      <mesh castShadow position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={0.9} metalness={0.1} transparent opacity={1} />
      </mesh>
    </a.group>
  );
}
