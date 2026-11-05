// Planos exibidos na landing. Fica vazio de propósito: nenhum plano, preço ou benefício foi definido.
// Enquanto estiver vazio, a seção mostra só o convite para conversar.
// Para publicar planos, preencha a lista (sem `price` o card mostra "Fale conosco para valores"):
//
// export const plans: Plan[] = [
//   { name: 'Nome do plano', description: 'Para quem…', features: ['Item 1', 'Item 2'], highlight: true },
// ];

export type Plan = {
  name: string;
  description: string;
  features: string[];
  price?: string;
  highlight?: boolean;
};

export const plans: Plan[] = [];
