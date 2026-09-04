'use client';

import { EffectComposer, Noise, Vignette, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export default function PostProcessing() {
  return (
    <EffectComposer multisampling={0} autoClear={false}>
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
      <Vignette eskil={false} offset={0.1} darkness={0.6} blendFunction={BlendFunction.MULTIPLY} />
    </EffectComposer>
  );
}
