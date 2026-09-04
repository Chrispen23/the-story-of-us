'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';

interface PhysicalPhotoProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  caption?: string;
  depth?: number; // How much it floats away from the wall/background
}

export default function PhysicalPhoto({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  caption,
  depth = 0.1,
}: PhysicalPhotoProps) {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useTexture(url);
  const [hovered, setHovered] = useState(false);

  // Get image aspect ratio
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const width = aspect > 1 ? 3 : 3 * aspect;
  const height = aspect > 1 ? 3 / aspect : 3;

  const { springScale, springRot } = useSpring({
    springScale: hovered ? scale * 1.05 : scale,
    springRot: hovered ? [rotation[0] - 0.05, rotation[1] + 0.05, rotation[2]] : rotation,
    config: { mass: 2, tension: 170, friction: 40 },
  });

  // Physical drift
  useFrame((state) => {
    if (meshRef.current && !hovered) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.0005;
    }
  });

  return (
    <a.group
      ref={meshRef}
      position={position}
      rotation={springRot as any}
      scale={springScale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { setHovered(false); }}
    >
      {/* Paper backing */}
      <mesh castShadow receiveShadow position={[0, 0, -0.02]}>
        <planeGeometry args={[width + 0.2, height + 0.2]} />
        <meshStandardMaterial color="#D9CDBA" roughness={0.9} />
      </mesh>

      {/* The photograph */}
      <mesh castShadow position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        {/* We use a higher roughness so it acts like matte paper rather than a dark mirror reflecting the black void */}
        <meshStandardMaterial map={texture} roughness={0.9} metalness={0.1} />
      </mesh>
    </a.group>
  );
}
