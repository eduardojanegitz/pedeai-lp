import { useAnimate, useInView } from 'motion/react';
import { useEffect, useState } from 'react';
import { useMotionTier } from '../../hooks/useMotionTier';

const CHIPS = [
  { x: -90, y: -50, c: 'var(--primary)' }, { x: 90, y: -60, c: 'var(--secondary)' },
  { x: -120, y: 30, c: 'var(--accent)' }, { x: 120, y: 40, c: 'var(--chart-4)' },
  { x: -40, y: 70, c: 'var(--secondary)' }, { x: 50, y: 66, c: 'var(--primary)' },
];
const ease = [0.2, 0.8, 0.2, 1] as const;

/** Carrinho → partículas de interface → "PedeAí!" (o "!" entra por último). Roda uma única vez. */
export default function BrandReveal() {
  const tier = useMotionTier();
  const [scope, animate] = useAnimate();
  const inView = useInView(scope, { once: true, amount: 0.6 });
  const [done, setDone] = useState(false);
  const still = tier === 'min' || done;

  useEffect(() => {
    if (!inView) return;
    if (tier === 'min') { setDone(true); return; }
    let cancelled = false;
    (async () => {
      await animate('#cart', { x: [-260, 0], opacity: [0, 1] }, { duration: 0.9, ease });
      await Promise.all([
        animate('#cart', { scale: 0, rotate: 25, opacity: 0 }, { duration: 0.35 }),
        ...CHIPS.map((c, i) => animate(`#chip${i}`, { x: c.x, y: c.y, scale: 1, opacity: 1 }, { duration: 0.5, ease })),
      ]);
      await Promise.all([
        ...CHIPS.map((_, i) => animate(`#chip${i}`, { x: 0, y: 0, scale: 0, opacity: 0 }, { duration: 0.35, ease: 'easeIn' })),
        animate('#word', { opacity: 1, scale: [0.8, 1] }, { duration: 0.45, ease }),
      ]);
      if (cancelled) return;
      await animate('#bang', { opacity: 1, scale: [0, 1.5, 1], rotate: [-30, 8, 0] }, { duration: 0.6, ease });
      if (!cancelled) setDone(true);
    })();
    return () => { cancelled = true; };
  }, [inView, tier, animate]);

  return (
    <div ref={scope} className="relative mx-auto flex h-[220px] w-full max-w-xl items-center justify-center overflow-hidden" role="img" aria-label="PedeAí!">
      <svg id="cart" aria-hidden="true" width="96" height="76" viewBox="0 0 70 56" fill="none" stroke="var(--foreground)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        className="absolute" style={{ opacity: 0, display: still ? 'none' : undefined }}>
        <path d="M4 6h9l6 28h28l6-20H16" fill="var(--accent)" /><circle cx="24" cy="46" r="4" fill="var(--primary)" /><circle cx="42" cy="46" r="4" fill="var(--primary)" />
      </svg>
      {CHIPS.map((c, i) => (
        <span key={i} id={`chip${i}`} aria-hidden="true" className="absolute size-7 rounded-md border-[2.5px] border-ink"
          style={{ background: c.c, opacity: 0, transform: 'scale(0)', display: still ? 'none' : undefined }} />
      ))}
      <span id="word" className="font-display text-[clamp(4.5rem,18vw,8rem)] leading-none" aria-hidden="true" style={{ opacity: still ? 1 : 0 }}>
        Pede<span className="text-primary">Aí</span>
        <span id="bang" className={`inline-block ${done ? 'logo-bang' : ''}`} style={{ opacity: still ? 1 : 0, color: 'var(--secondary)' }}>!</span>
      </span>
    </div>
  );
}
