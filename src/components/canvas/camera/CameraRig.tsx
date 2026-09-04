'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export default function CameraRig() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  // A subtle noise or breathing effect for the camera to keep it alive
  useFrame((state) => {
    // We will hook this up to GSAP later for scroll choreography.
    // For now, just add a tiny cinematic breath.
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.15) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
