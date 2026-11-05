import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import { CheckCircle2, Clock, FileDown, ListChecks } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMotionTier } from '../../hooks/useMotionTier';
import Stepper from '../ui/Stepper';

function Floating({
  mx, my, depth, className, delay, floatClass, children,
}: {
  mx: MotionValue<number>; my: MotionValue<number>; depth: number;
  className: string; delay: number; floatClass: string; children: ReactNode;
}) {
  const x = useTransform(mx, (v) => v * depth * 70);
  const y = useTransform(my, (v) => v * depth * 70);
  return (
    <motion.div className={`absolute ${className}`} style={{ x, y }}>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className={floatClass}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroVisual() {
  const tier = useMotionTier();
  const raw = { x: useMotionValue(0), y: useMotionValue(0) };
  const mx = useSpring(raw.x, { stiffness: 80, damping: 18 });
  const my = useSpring(raw.y, { stiffness: 80, damping: 18 });
  const parallax = tier === 'full';
  const float = tier === 'min' ? '' : 'float-slow';

  return (
    <div
      className="relative h-[430px] w-full sm:h-[500px]"
      role="img"
      aria-label="Representação animada de telas do PedeAí!: progresso por etapas, regra de escolha, resumo e exportação"
      onPointerMove={(e) => {
        if (!parallax) return;
        const r = e.currentTarget.getBoundingClientRect();
        raw.x.set((e.clientX - r.left) / r.width - 0.5);
        raw.y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { raw.x.set(0); raw.y.set(0); }}
    >
      <div className="dot-grid absolute inset-0 rounded-[var(--radius)]" aria-hidden="true" />
      <span className="absolute right-2 top-2 z-10 rounded-full border-2 border-ink bg-accent px-3 py-0.5 text-xs font-bold uppercase tracking-wide">
        Demonstração
      </span>

      {/* Progresso */}
      <Floating mx={mx} my={my} depth={0.5} delay={0.1} floatClass={float} className="left-0 top-6 w-[58%] sm:w-[46%]">
        <div className="pop-card p-3">
          <Stepper steps={['Tamanho', 'Cor', 'Revisão']} current={1} />
        </div>
      </Floating>

      {/* Categoria com regra */}
      <Floating mx={mx} my={my} depth={1} delay={0.25} floatClass={float} className="left-[16%] top-[30%] z-10 w-[72%] sm:left-[24%] sm:w-[52%]">
        <div className="pop-card pop-card-lg p-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-2xl">Cor</p>
            <span className="rounded-full border-2 border-ink bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">Escolha até 2</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ['Coral', 'bg-primary', true],
              ['Azul', 'bg-secondary', true],
              ['Amarelo', 'bg-accent', false],
              ['Verde', 'bg-leaf', false],
            ].map(([n, c, on]) => (
              <span key={n as string} className={`flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-sm font-semibold ${on ? 'bg-ink text-background' : 'bg-card opacity-60'}`}>
                <span className={`size-3 rounded-full border-2 border-ink ${c}`} />{n as string}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">2 de 2 selecionadas</p>
        </div>
      </Floating>

      {/* Resumo */}
      <Floating mx={mx} my={my} depth={1.4} delay={0.4} floatClass={float} className="bottom-2 right-0 w-[60%] sm:w-[44%]">
        <div className="pop-card p-4">
          <p className="flex items-center gap-2 font-display text-xl"><ListChecks className="size-5" aria-hidden="true" />Seu resumo</p>
          <ul className="mt-2 space-y-1 text-sm font-medium">
            <li className="flex justify-between"><span>Tamanho</span><span>M</span></li>
            <li className="flex justify-between"><span>Cor</span><span>Coral, Azul</span></li>
            <li className="flex justify-between"><span>Brindes</span><span>1 item</span></li>
          </ul>
          <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-secondary"><CheckCircle2 className="size-4" aria-hidden="true" />Pronto para confirmar</p>
        </div>
      </Floating>

      {/* Rodada */}
      <Floating mx={mx} my={my} depth={0.8} delay={0.55} floatClass={float} className="bottom-4 left-0 w-[50%] sm:w-[34%]">
        <div className="pop-card bg-accent p-3">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide"><Clock className="size-4" aria-hidden="true" />Rodada aberta</p>
          <p className="font-display text-xl">Encerra às 18h</p>
        </div>
      </Floating>

      {/* Exportação */}
      <Floating mx={mx} my={my} depth={1.2} delay={0.7} floatClass={float} className="right-1 top-14 hidden sm:block">
        <div className="pop-card flex items-center gap-2 bg-secondary px-3 py-2 text-secondary-foreground">
          <FileDown className="size-5" aria-hidden="true" />
          <span className="font-display text-lg">PDF · Excel · Copiar texto</span>
        </div>
      </Floating>
    </div>
  );
}
