import { motion, useAnimate } from 'motion/react';
import { useState } from 'react';
import { CATEGORIES, COLOR_DOT, ruleLabel, type Category } from './data';

function CategoryCard({ cat, picked, toggle }: { cat: Category; picked: string[]; toggle: (o: string) => void }) {
  const [scope, animate] = useAnimate();
  const full = picked.length >= cat.max;
  const ok = picked.length >= cat.min;

  const click = (o: string) => {
    const on = picked.includes(o);
    if (!on && full && cat.max > 1) {
      animate(scope.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.35 });
      return;
    }
    toggle(o);
  };

  return (
    <div ref={scope} className="pop-card p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-2xl">{cat.name}</h3>
        <span className="rounded-full border-2 border-ink bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">{ruleLabel(cat)}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`${cat.name}: ${ruleLabel(cat)}`}>
        {cat.options.map((o) => {
          const on = picked.includes(o);
          const locked = !on && full;
          return (
            <button key={o} type="button" aria-pressed={on} onClick={() => click(o)}
              className={`pop-press flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${on ? 'bg-ink text-background' : 'bg-card'} ${locked ? 'opacity-40' : ''}`}>
              {COLOR_DOT[o] && <span className={`size-3 rounded-full border-2 border-ink ${COLOR_DOT[o]}`} aria-hidden="true" />}{o}
            </button>
          );
        })}
      </div>
      <p className={`mt-3 text-sm font-bold ${ok ? 'text-secondary' : 'text-destructive'}`} aria-live="polite">
        {picked.length} de {cat.max} {ok ? '· ok' : `· faltam ${cat.min - picked.length}`}
        {full && cat.max > 1 ? ' · limite atingido' : ''}
      </p>
    </div>
  );
}

export default function Rules() {
  const [sel, setSel] = useState<Record<string, string[]>>({ tamanho: [], cor: ['Coral'], brindes: [] });

  const toggle = (cat: Category) => (o: string) =>
    setSel((s) => {
      const cur = s[cat.id];
      if (cur.includes(o)) return { ...s, [cat.id]: cur.filter((x) => x !== o) };
      // máximo 1: troca a escolha (comportamento de seleção única)
      if (cat.max === 1) return { ...s, [cat.id]: [o] };
      return { ...s, [cat.id]: [...cur, o] };
    });

  const valid = CATEGORIES.every((c) => sel[c.id].length >= c.min);

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {CATEGORIES.map((c) => <CategoryCard key={c.id} cat={c} picked={sel[c.id]} toggle={toggle(c)} />)}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <motion.button type="button" disabled={!valid} animate={{ scale: valid ? 1 : 0.96, opacity: valid ? 1 : 0.5 }}
          className="pop-press rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground disabled:cursor-not-allowed">
          Próxima etapa →
        </motion.button>
        <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">
          {valid ? 'Todas as regras cumpridas.' : 'Cumpra as regras para avançar — é assim que o app guia o participante.'}
        </p>
      </div>
      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Demonstração interativa · exemplos fictícios</p>
    </div>
  );
}
