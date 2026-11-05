import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { FileDown, FileSpreadsheet, ClipboardCopy, Pencil, ShoppingBag } from 'lucide-react';
import Stepper from '../ui/Stepper';
import { COLOR_DOT } from './data';

const STEPS = [
  { t: 'Cardápio por categorias', d: 'No painel, o admin monta categorias e produtos. Cada categoria vira uma etapa do pedido.' },
  { t: 'Regra de seleção', d: 'Cada categoria define o mínimo e o máximo de escolhas, direto no cadastro.' },
  { t: 'Escolha e avanço', d: 'O participante escolhe uma etapa por vez e vê quantas escolhas ainda cabem.' },
  { t: 'Revisão e confirmação', d: 'Antes de confirmar, o pedido inteiro aparece para conferir e editar.' },
  { t: 'Pedido no painel', d: 'O pedido confirmado entra organizado no painel, pronto para consolidar e exportar.' },
] as const;

const ease = [0.2, 0.8, 0.2, 1] as const;
const enter = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -24 }, transition: { duration: 0.4, ease } };
const PILL = 'rounded-full border-2 border-ink bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground';
const FIELD = 'rounded-full border-2 border-ink bg-card px-4 py-2 text-sm font-semibold';

function Toggle() {
  return <span className="inline-flex h-5 w-9 items-center justify-end rounded-full border-2 border-ink bg-primary px-0.5" aria-hidden="true"><span className="size-3 rounded-full bg-card" /></span>;
}

function AdminMenu() {
  return (
    <motion.div key="menu" {...enter} className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl">Cor</p>
        <span className={PILL}>Escolha até 2</span>
      </div>
      {['Coral', 'Azul', 'Amarelo', 'Verde'].map((n, i) => (
        <motion.div key={n} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.4, ease }}
          className="flex items-center justify-between rounded-full border-2 border-ink bg-card px-3 py-1.5">
          <span className="flex items-center gap-2 text-sm font-bold"><span className={`size-5 rounded-full border-2 border-ink ${COLOR_DOT[n]}`} />{n}</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold">Disponível <Toggle /></span>
        </motion.div>
      ))}
      <span className="pop-card inline-block bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground">+ Nova categoria</span>
    </motion.div>
  );
}

function RuleForm() {
  return (
    <motion.div key="form" {...enter} className="space-y-3">
      <p className="font-display text-2xl">Nova categoria</p>
      <div><p className="mb-1 text-xs font-bold">Nome</p><div className={FIELD}>Cor</div></div>
      <div className="grid grid-cols-2 gap-3">
        <div><p className="mb-1 text-xs font-bold">Mínimo de escolhas</p><div className={FIELD}>0</div></div>
        <div>
          <p className="mb-1 text-xs font-bold">Máximo de escolhas</p>
          <motion.div initial={{ boxShadow: '0 0 0 0 var(--ring)' }} animate={{ boxShadow: ['0 0 0 0 var(--ring)', '0 0 0 4px var(--ring)', '0 0 0 0 var(--ring)'] }} transition={{ delay: 0.4, duration: 1.2 }} className={FIELD}>2</motion.div>
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground">O limite conta opções diferentes. Mínimo 0 deixa a etapa opcional.</p>
      <div className="flex gap-2"><span className="pop-press rounded-full bg-card px-4 py-1.5 text-sm font-bold">Cancelar</span><span className="pop-press rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground">Salvar</span></div>
    </motion.div>
  );
}

const SW = ['Coral', 'Azul', 'Amarelo', 'Verde'] as const;

function PickScreen() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const a = setTimeout(() => setN(1), 700);
    const b = setTimeout(() => setN(2), 1400);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  return (
    <motion.div key="pick" {...enter} className="space-y-2.5">
      <Stepper steps={['Tamanho', 'Cor', 'Revisão']} current={1} />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Etapa 2 de 3</p>
        <p className="font-display text-3xl text-primary">Escolha até 2</p>
        <span className="mt-1 inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-bold">{n} de 2 selecionados</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {SW.map((c, i) => {
          const on = i < n;
          const locked = n >= 2 && !on;
          return (
            <motion.div key={c} animate={{ scale: on ? 1.04 : 1, opacity: locked ? 0.45 : 1 }} className={`overflow-hidden rounded-xl border-2 border-ink bg-card ${on ? 'shadow-[3px_3px_0_0_var(--foreground)]' : ''}`}>
              <span className={`block h-9 ${COLOR_DOT[c]}`} />
              <p className="px-1.5 pt-1 text-xs font-bold">{c}</p>
              <p className="px-1.5 pb-1 text-[10px] font-semibold text-muted-foreground">{on ? 'Selecionado' : 'Toque para escolher'}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-between rounded-full border-2 border-ink bg-card p-1.5 pr-1.5 shadow-[var(--shadow-pop)]">
        <span className="flex items-center gap-2 text-xs font-bold">
          <span className="relative grid size-8 place-items-center rounded-full border-2 border-ink bg-accent"><ShoppingBag className="size-4" aria-hidden="true" /><span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full border-2 border-ink bg-primary text-[9px] text-primary-foreground">{n}</span></span>
          Meu pedido
        </span>
        <span className={`rounded-full border-2 border-ink px-3 py-1 text-xs font-bold ${n >= 1 ? 'bg-primary text-primary-foreground' : 'bg-primary/40 text-primary-foreground'}`}>Continuar</span>
      </div>
    </motion.div>
  );
}

function Review() {
  return (
    <motion.div key="review" {...enter} className="space-y-2.5">
      <Stepper steps={['Tamanho', 'Cor', 'Revisão']} current={2} />
      <div><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Última etapa</p><p className="font-display text-3xl text-primary">Seu pedido</p></div>
      {[['Tamanho', 'M'], ['Cor', 'Coral, Azul']].map(([k, v], i) => (
        <motion.div key={k} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12, duration: 0.4, ease }} className="flex items-center justify-between rounded-2xl border-2 border-ink bg-card px-3 py-2">
          <div><p className="font-display text-lg leading-none">{k}</p><p className="text-sm font-bold">{v}</p></div>
          <span className="flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 text-xs font-bold"><Pencil className="size-3" aria-hidden="true" />Editar {k.toLowerCase()}</span>
        </motion.div>
      ))}
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, ease }} className="pop-card rounded-full bg-primary py-2 text-center text-sm font-bold text-primary-foreground">Confirmar pedido</motion.div>
    </motion.div>
  );
}

function AdminOrders() {
  return (
    <motion.div key="admin" {...enter} className="space-y-2.5">
      <div className="grid grid-cols-3 gap-2 text-center">
        {[['Pedidos', '3', 'bg-secondary text-secondary-foreground'], ['Itens', '7', 'bg-accent'], ['Editados', '0', 'bg-card']].map(([k, v, c]) => (
          <div key={k} className={`rounded-2xl border-2 border-ink px-2 py-1.5 text-left shadow-[3px_3px_0_0_var(--foreground)] ${c}`}>
            <p className="text-[9px] font-bold uppercase tracking-wide">{k}</p><p className="font-display text-2xl leading-none">{v}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 text-xs font-bold">
        <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-primary px-2.5 py-1 text-primary-foreground"><FileDown className="size-3.5" aria-hidden="true" />PDF</span>
        <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-card px-2.5 py-1"><FileSpreadsheet className="size-3.5" aria-hidden="true" />Excel</span>
        <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-card px-2.5 py-1"><ClipboardCopy className="size-3.5" aria-hidden="true" />Copiar texto</span>
      </div>
      {[['Participante A', 'G · Verde', false], ['Participante B', 'P · Coral, Azul', false], ['Seu pedido', 'M · Coral, Azul', true]].map(([n, d, mine], i) => (
        <motion.div key={n as string} layout initial={{ opacity: 0, x: mine ? -30 : 0, scale: mine ? 0.92 : 1 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: mine ? 0.45 : i * 0.08, duration: 0.5, ease }}
          className={`rounded-2xl border-2 border-ink px-3 py-1.5 ${mine ? 'bg-accent' : 'bg-card'}`}>
          <p className="font-display text-lg leading-none">{n as string}</p><p className="text-xs font-semibold">{d as string}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function Screen({ step }: { step: number }) {
  return (
    <AnimatePresence mode="wait">
      {step === 0 ? <AdminMenu key="s0" /> : step === 1 ? <RuleForm key="s1" /> : step === 2 ? <PickScreen key="s2" /> : step === 3 ? <Review key="s3" /> : <AdminOrders key="s4" />}
    </AnimatePresence>
  );
}

export default function Journey() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setStep(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))));

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / STEPS.length) * span });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="relative h-[420svh]">
        <div className="sticky top-14 flex h-[calc(100svh-3.5rem)] items-center">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-4 px-4 md:grid-cols-[1fr_400px] md:gap-12">
            <ol className="order-2 space-y-1.5 md:order-1 md:space-y-3" aria-label="Etapas da demonstração">
              {STEPS.map((s, i) => (
                <li key={s.t}>
                  <button type="button" onClick={() => goTo(i)} aria-current={i === step ? 'step' : undefined}
                    className={`w-full rounded-2xl border-2 px-3 py-1.5 text-left transition-colors md:px-4 md:py-3 ${i === step ? 'border-ink bg-card shadow-[var(--shadow-pop)]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <span className="flex items-center gap-3">
                      <span className={`grid size-8 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-lg ${i === step ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{i + 1}</span>
                      <span className="font-display text-xl md:text-2xl">{s.t}</span>
                    </span>
                    {i === step && <span className="mt-1 block pl-11 text-sm font-medium text-muted-foreground md:text-base">{s.d}</span>}
                  </button>
                </li>
              ))}
            </ol>
            <div className="order-1 md:order-2">
              <div className="pop-card pop-card-lg relative min-h-[330px] overflow-hidden p-4 md:min-h-[400px]" aria-live="polite">
                <span className="absolute right-3 top-2 rounded-full border-2 border-ink bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase">Demonstração</span>
                <div className="pt-5"><Screen step={step} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
