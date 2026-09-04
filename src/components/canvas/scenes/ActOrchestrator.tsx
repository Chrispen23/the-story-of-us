'use client';

import { useStore } from '@/store/useStore';
import PremiumEnvelope from '../envelope/PremiumEnvelope';
import ActTwo from './ActTwo';
import ActThree from './ActThree';
import ActFour from './ActFour';
import Payoff from './Payoff';
import CameraRig from '../camera/CameraRig';

export default function ActOrchestrator() {
  const currentAct = useStore(state => state.currentAct);

  return (
    <group>
      <CameraRig />
      {(currentAct === 'loading' || currentAct === 'prologue' || currentAct === 'act1') && <PremiumEnvelope onComplete={() => useStore.getState().setAct('act2')} />}
      {currentAct === 'act2' && <ActTwo />}
      {currentAct === 'act3' && <ActThree />}
      {currentAct === 'act4' && <ActFour />}
      {currentAct === 'payoff' && <Payoff />}
    </group>
  );
}
