import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { ClipboardCopy, FileDown, FileSpreadsheet, Pencil, Search } from 'lucide-react';

type Row = { id: number; nome: string; tam: string; cores: string[]; brindes: string[]; editado?: string };

// Dados fictícios de demonstração (sem nomes ou contatos reais).
const ROWS: Row[] = [
  { id: 1, nome: 'Participante A', tam: 'M', cores: ['Coral', 'Azul'], brindes: ['Caneca'] },
  { id: 2, nome: 'Participante B', tam: 'G', cores: ['Verde'], brindes: ['Boné', 'Adesivo'], editado: '10:16' },
  { id: 3, nome: 'Participante C', tam: 'M', cores: ['Azul'], brindes: [] },
  { id: 4, nome: 'Participante D', tam: 'P', cores: ['Coral', 'Amarelo'], brindes: ['Chaveiro', 'Bottom', 'Caneca'] },
  { id: 5, nome: 'Participante E', tam: 'G', cores: ['Coral'], brindes: ['Adesivo'], editado: '11:02' },
];

const SECTIONS: { k: string; get: (r: Row) => string[] }[] = [
  { k: 'Tamanho', get: (r) => [r.tam] },
  { k: 'Cor', get: (r) => r.cores },
  { k: 'Brindes', get: (r) => r.brindes },
];

export default function AdminPanel() {
  const [q, setQ] = useState('');
  const [onlyEdited, setOnlyEdited] = useState(false);
  const [view, setView] = useState<'part' | 'cons'>('part');
  const [msg, setMsg] = useState('');

  const rows = useMemo(
    () => ROWS.filter((r) => (!onlyEdited || r.editado) && r.nome.toLowerCase().includes(q.trim().toLowerCase())),
    [q, onlyEdited],
  );
  const itens = rows.reduce((s, r) => s + 1 + r.cores.length + r.brindes.length, 0);

  const consolidated = SECTIONS.map(({ k, get }) => {
    const m = new Map<string, string[]>();
    rows.forEach((r) => get(r).forEach((o) => m.set(o, [...(m.get(o) ?? []), r.nome])));
    return { k, list: [...m.entries()].sort((a, b) => b[1].length - a[1].length) };
  });

  const texto = `Pedidos consolidados (demonstração)\n${consolidated.map((s) => `${s.k}: ${s.list.map(([o, n]) => `${o} ${n.length}x`).join(', ') || '—'}`).join('\n')}`;
  const max = Math.max(1, ...consolidated.flatMap((s) => s.list.map(([, n]) => n.length)));

  return (
    <div className="pop-card pop-card-lg overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-[2.5px] border-ink bg-muted px-4 py-3">
        <p className="font-display text-3xl text-primary">Pedidos</p>
        <span className="rounded-full border-2 border-ink bg-accent px-2.5 py-0.5 text-xs font-bold uppercase">Demonstração</span>
      </div>

      <div className="space-y-4 p-4">
        <div className="grid grid-cols-3 gap-3">
          {[['Pedidos', rows.length, 'bg-secondary text-secondary-foreground'], ['Itens', itens, 'bg-accent'], ['Editados', rows.filter((r) => r.editado).length, 'bg-card']].map(([k, v, c]) => (
            <div key={k as string} className={`rounded-2xl border-[2.5px] border-ink px-3 py-2 shadow-[var(--shadow-pop)] ${c}`}>
              <p className="text-[11px] font-bold uppercase tracking-wide">{k}</p>
              <p className="font-display text-4xl leading-none" aria-live="polite">{v as number}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { n: 'PDF', i: FileDown, m: 'No app, isto gera o arquivo PDF dos pedidos.', c: 'bg-primary text-primary-foreground' },
            { n: 'Excel', i: FileSpreadsheet, m: 'No app, isto gera a planilha Excel dos pedidos.', c: 'bg-card' },
            { n: 'Copiar texto', i: ClipboardCopy, m: texto, c: 'bg-card' },
          ].map(({ n, i: Icon, m, c }) => (
            <button key={n} type="button" onClick={() => setMsg(m)} className={`pop-press flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${c}`}>
              <Icon className="size-4" aria-hidden="true" />{n}
            </button>
          ))}
        </div>
        {msg && <pre className="whitespace-pre-wrap rounded-2xl border-2 border-ink bg-card px-4 py-3 font-sans text-sm" role="status">{msg}</pre>}

        <div className="flex flex-wrap gap-3">
          <label className="flex min-w-[200px] flex-1 items-center gap-2 rounded-full border-[2.5px] border-ink bg-card px-4 py-2">
            <Search className="size-4 text-muted-foreground" aria-hidden="true" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nome" aria-label="Buscar nome" className="w-full bg-transparent text-sm font-semibold outline-none placeholder:font-medium" />
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border-[2.5px] border-ink bg-card px-4 py-2 text-sm font-semibold">
            <input type="checkbox" checked={onlyEdited} onChange={(e) => setOnlyEdited(e.target.checked)} className="size-4 accent-[var(--primary)]" />
            Só pedidos editados
          </label>
        </div>

        <div role="group" aria-label="Modo de visualização" className="inline-flex rounded-full border-[2.5px] border-ink bg-card p-1">
          {([['part', 'Por participante'], ['cons', 'Consolidado']] as const).map(([v, l]) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${view === v ? 'bg-primary text-primary-foreground' : ''}`}>{l}</button>
          ))}
        </div>

        {view === 'part' ? (
          <ul className="grid gap-3 md:grid-cols-2" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {rows.map((r) => (
                <motion.li key={r.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                  className="pop-card rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-2xl">{r.nome}</p>
                    {r.editado && <span className="flex items-center gap-1 rounded-full border-2 border-ink bg-accent px-2 py-0.5 text-xs font-bold"><Pencil className="size-3" aria-hidden="true" />Editado {r.editado}</span>}
                  </div>
                  {SECTIONS.map((s) => (
                    <div key={s.k} className="mt-2">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{s.k}</p>
                      <p className="text-sm font-medium">{s.get(r).join(', ') || '—'}</p>
                    </div>
                  ))}
                </motion.li>
              ))}
            </AnimatePresence>
            {rows.length === 0 && <li className="text-sm font-semibold text-muted-foreground">Nenhum pedido encontrado.</li>}
          </ul>
        ) : (
          <div className="space-y-4" aria-live="polite">
            {consolidated.map((s) => (
              <div key={s.k} className="pop-card rounded-2xl p-4">
                <p className="font-display text-2xl">{s.k}</p>
                <ul className="mt-2 space-y-3">
                  {s.list.map(([o, names]) => (
                    <li key={o}>
                      <div className="flex items-baseline justify-between"><span className="font-display text-lg">{o}</span><span className="font-display text-xl">{names.length}</span></div>
                      <div className="h-2.5 rounded-full bg-muted"><motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: `${(names.length / max) * 100}%` }} transition={{ duration: 0.4 }} /></div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{names.join(', ')}</p>
                    </li>
                  ))}
                  {s.list.length === 0 && <li className="text-sm text-muted-foreground">—</li>}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
