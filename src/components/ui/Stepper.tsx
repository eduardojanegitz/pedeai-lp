import { Check } from 'lucide-react';

/** Indicador de etapas como no app: círculos numerados, linha azul nas concluídas, coral na atual. */
export default function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-start" aria-label="Etapas do pedido">
      {steps.map((s, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <li key={s} className="contents" aria-current={now ? 'step' : undefined}>
            <div className="flex flex-col items-center gap-1">
              <span className={`grid size-8 place-items-center rounded-full border-2 border-ink text-sm font-bold ${
                done ? 'bg-secondary text-secondary-foreground' : now ? 'bg-primary text-primary-foreground shadow-[2px_2px_0_0_var(--foreground)]' : 'bg-card'}`}>
                {done ? <Check className="size-4" aria-hidden="true" /> : i + 1}
              </span>
              <span className="text-[10px] font-bold leading-none">{s}</span>
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className={`mx-1 mt-[15px] h-1 flex-1 rounded-full ${done ? 'bg-secondary' : 'bg-muted'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
