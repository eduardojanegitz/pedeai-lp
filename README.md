# PedeAí! — Landing page

Landing page institucional/comercial do **PedeAí!**, plataforma de cardápios digitais interativos e gestão de pedidos.
O app vive em outro repositório; aqui há só a página de apresentação.

Estilo "Feira Vibrante" (neo-brutalista: bordas grossas em tinta e sombra dura), com demos animadas feitas com dados fictícios.

## Stack

- [Astro](https://astro.build) (HTML estático, ilhas React só onde há interação)
- React + [Motion](https://motion.dev) para as animações
- Tailwind CSS 4
- Lucide (ícones) e Bebas Neue + Barlow (via Fontsource)

## Rodando localmente

Requer Node 20 ou superior.

```bash
npm install
npm run dev
```

A página abre em `http://localhost:4321`.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run preview` | Serve o build localmente |

## Configuração (`.env`)

Copie `.env.example` para `.env` e preencha. Todos os campos são opcionais.

| Variável | Efeito |
|---|---|
| `PUBLIC_APP_URL` | URL pública do app. Alimenta os botões "Abrir demo". Sem ela, os botões levam à seção da demo. |
| `PUBLIC_WHATSAPP` | WhatsApp com DDI e DDD, só números (ex.: `5511999999999`). Sem ele, o botão não aparece. |
| `PUBLIC_EMAIL` | E-mail de contato. Sem ele, o botão não aparece. |

O arquivo `.env` não é versionado. As variáveis são lidas no build, então rode `npm run build` de novo após alterá-las.

## Planos

Nenhum plano foi definido, então a seção "Planos e conversa" mostra só o convite para conversar.
Para exibir cards de planos, preencha a lista em [`src/data/plans.ts`](src/data/plans.ts). Sem `price`, o card mostra "Fale conosco para valores".

## Estrutura

```
src/
  styles/
    tokens.css        # tokens do design system (reutilizável no app)
    global.css        # Tailwind, tipografia e utilitários
  layouts/Layout.astro
  pages/index.astro
  data/plans.ts       # planos exibidos na landing
  hooks/useMotionTier.ts   # níveis de movimento: completo, reduzido, mínimo
  components/
    sections/         # Hero, Segurança, Contato, Chamada final (Astro)
    hero/             # interfaces flutuantes do hero
    demo/             # jornada por scroll, regras de categoria, painel de pedidos
    brand/            # animação carrinho → "PedeAí!"
    ui/               # Logo, Stepper
```

## Decisões de design

- **Tokens:** `src/styles/tokens.css` é a única fonte das cores, raios e sombras. Os utilitários `pop-card` e `pop-press` ficam na camada `components` do Tailwind, para as classes utilitárias poderem sobrescrevê-los.
- **Movimento:** só `transform` e `opacity` são animados. `useMotionTier` define 3 níveis: completo, reduzido (aparelhos com poucos núcleos ou pouca memória) e mínimo (`prefers-reduced-motion`, sem animações).
- **Honestidade do conteúdo:** as telas são representações em "Demonstração", sem dados reais. A landing não promete o que o app ainda não faz (por exemplo, o efeito do produto voando até o resumo existe só na demo).
- **Acessibilidade:** HTML semântico, foco visível, link "Ir para o conteúdo" e elementos decorativos com `aria-hidden`.

## Publicação

O build é 100% estático (`dist/`), então qualquer hospedagem de arquivos estáticos serve. A recomendação é o **Cloudflare Pages** (gratuito):

- Comando de build: `npm run build`
- Pasta de saída: `dist`
- Variáveis de ambiente: as do `.env`, no painel da hospedagem

## Pendências

- Definir o domínio.
- Testar em celulares reais (inclusive de entrada) e rodar o Lighthouse.
- Aprovar o favicon proposto (`public/favicon.svg`).
