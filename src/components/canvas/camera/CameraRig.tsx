'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function CameraRig() {
  const rigRef = useRef<THREE.Group>(null);
  
  // A subtle noise or breathing effect for the camera to keep it alive
  useFrame((state) => {
    // Instead of moving the camera directly, we can move a rig holding the camera, 
    // but GSAP is animating the camera position. To avoid conflicts, we just don't do anything 
    // or we apply breathing to rotation slightly.
    state.camera.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.005;
  });

  return null;
}
