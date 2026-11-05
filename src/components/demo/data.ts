// Dados fictícios de demonstração (não vêm de nenhum backend).
export type Category = {
  id: string;
  name: string;
  min: number;
  max: number;
  options: string[];
};

export const CATEGORIES: Category[] = [
  { id: 'tamanho', name: 'Tamanho', min: 1, max: 1, options: ['P', 'M', 'G', 'GG'] },
  { id: 'cor', name: 'Cor', min: 0, max: 2, options: ['Coral', 'Azul', 'Amarelo', 'Verde'] },
  { id: 'brindes', name: 'Brindes', min: 0, max: 3, options: ['Boné', 'Caneca', 'Adesivo', 'Chaveiro', 'Bottom'] },
];

export const COLOR_DOT: Record<string, string> = {
  Coral: 'bg-primary',
  Azul: 'bg-secondary',
  Amarelo: 'bg-accent',
  Verde: 'bg-leaf',
};

export function ruleLabel(c: Category) {
  if (c.min === c.max) return `Escolha ${c.max}`;
  return `Escolha até ${c.max}`;
}
