import { useEffect, useState } from 'react';

export type MotionTier = 'full' | 'reduced' | 'min';

/** full: desktop/celular bom · reduced: aparelho modesto · min: prefers-reduced-motion */
export function useMotionTier(): MotionTier {
  const [tier, setTier] = useState<MotionTier>('full');
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 2;
    const update = () => setTier(mq.matches ? 'min' : weak ? 'reduced' : 'full');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return tier;
}
