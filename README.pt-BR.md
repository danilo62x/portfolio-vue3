# Creative Studio Portfolio / Vue 3

[Read in English](./README.md)

[![Licença: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue.svg)](./LICENSE) ![Grátis](https://img.shields.io/badge/pre%C3%A7o-gr%C3%A1tis-brightgreen)

Site de estúdio criativo com um back office comercial, feito em Vue 3.5, TypeScript, Vite 6 e Tailwind CSS v4. O lado público mostra o trabalho: cases com o desafio, o que foi feito e os números que mudaram, um catálogo de serviços com entregáveis e preço, uma página sobre com time e linha do tempo, formulário de contato e um briefing em quatro etapas que transforma o visitante em lead. Depois do login fica o lado comercial: um funil de leads que você arrasta entre estágios, propostas com editor de itens e desconto, e CRUD de cases, serviços e depoimentos. Tudo roda com dados fictícios persistidos no `localStorage`, sem backend para configurar.

Demonstração ao vivo: https://template.dev.br/preview/portfolio-vue3/

## Páginas incluídas

16 telas, cobrindo o site público e a área autenticada:

- Home: hero, números, serviços, cases em destaque, processo, depoimentos, clientes e uma chamada para ação
- Serviços: cards por categoria com entregáveis e preço, o processo em cinco passos e um FAQ em accordion
- Cases: busca e filtro por categoria no portfólio, com paginação
- Detalhe do case: capa, cliente e ano, desafio, solução, resultados, galeria, depoimento do cliente e o próximo case
- Sobre: história, princípios de trabalho, time, linha do tempo e logos de clientes
- Contato: formulário validado que cria um lead, mais os canais de atendimento
- Briefing: wizard de quatro etapas (escopo, investimento e prazo, contato, revisão) que envia um lead
- Login e Registro: telas de autenticação isoladas
- Dashboard: leads no mês, propostas abertas, taxa de fechamento, receita fechada, gráficos de receita e leads, funil por estágio e receita por serviço
- Leads: kanban por estágio com arrastar e soltar, filtros por origem, drawer de detalhe e conversão em proposta com um clique
- Propostas: lista por status e editor de itens com quantidade, valor unitário, desconto e totais
- Cases (admin): CRUD com publicar e destacar
- Serviços (admin): CRUD com categoria, preço, prazo e entregáveis
- Depoimentos: CRUD com aprovação, nota e vínculo com um case
- Configurações: perfil, dados do estúdio, notificações, tema e idioma
- Not found: página 404

## Stack

- Vue 3.5 com `<script setup>` e TypeScript 5.7 (strict)
- Tailwind CSS v4 com configuração CSS-first (`@tailwindcss/vite`)
- Vite 6 com `vite-plugin-pwa` 1.3 (PWA instalável, cache offline)
- Vue Router 4.4 com rotas sob demanda e guard `requiresAuth` na área do app
- Pinia 3 com `pinia-plugin-persistedstate`
- vue-i18n 11 com três idiomas (en, es, pt-BR)
- ApexCharts 5 via vue3-apexcharts
- Validação de formulários com VeeValidate 4.15 + Yup 1.7

## Requisitos

- Node.js 18 ou mais novo
- npm

## Como rodar

```bash
npm install
npm run dev
```

O Vite sobe um servidor de desenvolvimento com hot reload. A autenticação é simulada em na store de auth do Pinia, então nenhum backend é necessário. Credenciais de demonstração:

- `estudio@agencia.com` / `demo123`

Qualquer e-mail e senha não vazios entram; o par acima é a conta sugerida na tela de login e a dona dos dados de exemplo.

## Build de produção

```bash
npm run build
```

Roda a checagem de tipos do TypeScript e gera o bundle de produção em `dist/`. Para conferir localmente: `npm run preview`.

## Estrutura do projeto

```
src/
├── components/{layout,pf,ui}/
├── data/              types.ts, mock.ts, query.ts
├── i18n/locales/      en.json, es.json, pt-BR.json
├── router/            rotas com o guard de autenticação
├── stores/            auth.ts, ui.ts, portfolio.ts, brief.ts (Pinia, persistidas)
└── views/{public,app}/
```

## Tema e personalização

O Tailwind CSS v4 é configurado em CSS, não em arquivo JavaScript. A folha de estilo importa o Tailwind, declara a variante dark e define os tokens de design dentro de `@theme`: a fonte Outfit, breakpoints extras e a rampa da cor da marca (`--color-brand-25` até `--color-brand-950`). Os tokens semânticos de superfície usam o prefixo `--tx-` (sidebar, header, card, borda, texto). O modo escuro é uma classe no elemento raiz, alternada em tempo de execução e persistida. Para trocar a marca, altere a rampa e os valores `--tx-` juntos.

## Internacionalização

Três idiomas acompanham o template: inglês, espanhol e português do Brasil. O idioma do navegador é detectado no primeiro acesso e o seletor no header persiste a escolha. Moeda, datas e números são formatados conforme o idioma, então uma proposta em espanhol mostra euros e uma em português mostra reais.

## O mesmo sistema em outras stacks

O mesmo sistema existe em cinco stacks, todas com as mesmas telas e a mesma identidade visual, e todas gratuitas:

- React 19: https://github.com/danilo62x/portfolio-react
- Angular 19: https://github.com/danilo62x/portfolio-angular
- Laravel 11 + Blade: https://github.com/danilo62x/portfolio-laravel
- Static HTML: https://github.com/danilo62x/portfolio-html

O catálogo completo de templates gratuitos e pagos está em https://template.dev.br

## Apoie o projeto

Este template é gratuito e licenciado sob MIT. Se ele te poupar tempo, você pode apoiar o trabalho com uma doação em https://template.dev.br/doar?template=portfolio-vue3

## Licença

[MIT](./LICENSE), copyright 2026 Danilo Quinelato.
