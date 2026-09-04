'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';

interface PhysicalVideoProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export default function PhysicalVideo({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PhysicalVideoProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Track hover state for micro-interactions
  const [hovered, setHovered] = useState(false);
  
  // Interactive spring for hover
  const { scale: springScale, hoverRotation } = useSpring({
    scale: hovered ? scale * 1.05 : scale,
    hoverRotation: hovered ? 0.02 : 0,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  // Use Drei's robust video texture loader
  const videoTexture = useVideoTexture(url, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: 'Anonymous'
  });

  // Calculate dimensions based on video aspect ratio
  const img = videoTexture?.image as any;
  const aspect = img ? img.videoWidth / img.videoHeight : 1;
  const width = aspect > 1 ? 4 : 3 * aspect;
  const height = aspect > 1 ? 4 / aspect : 3;

  // Apply subtle continuous drifting if not hovered
  useFrame((state) => {
    if (groupRef.current && !hovered) {
      const time = state.clock.elapsedTime;
      // Very slow sine wave drifting based on unique positions to avoid sync
      groupRef.current.position.y += Math.sin(time * 0.5 + position[0]) * 0.001;
      groupRef.current.rotation.z = Math.sin(time * 0.3 + position[1]) * 0.02;
    }
  });

  return (
    <a.group 
      ref={groupRef}
      position={position} 
      rotation={rotation}
      scale={springScale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <a.mesh
        ref={meshRef}
        castShadow
        receiveShadow
        rotation-x={hoverRotation}
        rotation-y={hoverRotation}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          map={videoTexture}
          roughness={0.9} 
          metalness={0.1}
          side={THREE.FrontSide}
        />
      </a.mesh>

      {/* Subtle border to give it physical thickness without complex geometry */}
      <a.mesh 
        position={[0, 0, -0.02]} 
        receiveShadow
        rotation-x={hoverRotation}
        rotation-y={hoverRotation}
      >
        <planeGeometry args={[width + 0.2, height + 0.2]} />
        <meshStandardMaterial color="#EAE3D6" roughness={1} metalness={0} />
      </a.mesh>
    </a.group>
  );
}
