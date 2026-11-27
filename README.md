# Creative Studio Portfolio / Vue 3

[Leia em português](./README.pt-BR.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Free](https://img.shields.io/badge/price-free-brightgreen)

A creative studio website with a sales back office, built with Vue 3.5, TypeScript, Vite 6 and Tailwind CSS v4. The public side shows the work: case studies with the challenge, what was done and the numbers that moved, a service catalogue with deliverables and pricing, an about page with the team and a timeline, a contact form and a four-step brief that turns a visitor into a lead. Behind the login sits the commercial side: a lead funnel you drag between stages, proposals with an item editor and discount, and CRUD for case studies, services and testimonials. Everything runs on mock data persisted to `localStorage`, so there is no backend to set up.

## Pages included

16 screens, covering the public site and the authenticated area:

- Home: hero, numbers, services, featured cases, process, testimonials, clients and a call to action
- Services: cards by category with deliverables and price, the five-step process, FAQ accordion
- Cases: search and category filter over the portfolio, with pagination
- Case detail: cover, client and year, challenge, solution, results, gallery, client quote and the next case
- About: story, working principles, team, timeline and client logos
- Contact: validated form that creates a lead, plus the contact channels
- Brief: four-step wizard (scope, budget and timeline, contact, review) that submits a lead
- Login and Register: standalone auth screens
- Dashboard: leads this month, open proposals, win rate, closed revenue, revenue and lead charts, funnel by stage and revenue by service
- Leads: kanban by stage with drag and drop, filters by source, detail drawer and one-click conversion into a proposal
- Proposals: list by status plus an item editor with quantity, unit price, discount and totals
- Case studies admin: CRUD with publish and feature toggles
- Services admin: CRUD with category, price, timeline and deliverables
- Testimonials: CRUD with approval, rating and link to a case
- Settings: profile, studio details, notifications, theme and language
- Not found: 404 page

## Tech stack

- Vue 3.5 with `<script setup>` and TypeScript 5.7 (strict)
- Tailwind CSS v4 with CSS-first configuration (`@tailwindcss/vite`)
- Vite 6 with `vite-plugin-pwa` 1.3 (installable PWA, offline cache)
- Vue Router 4.4 with lazy routes and a `requiresAuth` guard on the app area
- Pinia 3 with `pinia-plugin-persistedstate`
- vue-i18n 11 with three locales (en, es, pt-BR)
- ApexCharts 5 via vue3-apexcharts
- VeeValidate 4.15 + Yup 1.7 form validation

## Requirements

- Node.js 18 or newer
- npm

## Getting started

```bash
npm install
npm run dev
```

Vite starts a dev server with hot reload. Authentication is simulated in the Pinia auth store, so no backend is needed. Demo credentials:

- `estudio@agencia.com` / `demo123`

Any non-empty email and password logs in; the pair above is the account suggested on the login screen and the one the seed data belongs to.

## Build for production

```bash
npm run build
```

Runs the TypeScript check and writes the production bundle to `dist/`. Preview it locally with `npm run preview`.

## Project structure

```
src/
├── components/{layout,pf,ui}/
├── data/              types.ts, mock.ts, query.ts
├── i18n/locales/      en.json, es.json, pt-BR.json
├── router/            rotas com o guard de autenticação
├── stores/            auth.ts, ui.ts, portfolio.ts, brief.ts (Pinia, persistidas)
└── views/{public,app}/
```

## Theming and customization

Tailwind CSS v4 is configured in CSS, not in a JavaScript config file. The stylesheet imports Tailwind, declares the dark variant and defines the design tokens inside `@theme`: the Outfit font family, extra breakpoints and the brand color ramp (`--color-brand-25` through `--color-brand-950`). Semantic surface tokens use the `--tx-` prefix (sidebar, header, card, border, text). Dark mode is a class on the root element, toggled at runtime and persisted. To rebrand, change the brand ramp and the `--tx-` values together.

## Internationalization

Three locales ship with the template: English, Spanish and Brazilian Portuguese. The browser language is detected on first load and the header switcher persists the choice. Currency, dates and numbers are formatted per locale, so a proposal in Spanish shows euros and a Brazilian one shows reais.

## The same system in other stacks

The same system exists in five stacks, all sharing the screens and the visual identity, and all of them are free:

- React 19: https://github.com/danilo62x/portfolio-react
- Angular 19: https://github.com/danilo62x/portfolio-angular
- Laravel 11 + Blade: https://github.com/danilo62x/portfolio-laravel
- Static HTML: https://github.com/danilo62x/portfolio-html

More free templates (admin dashboards, vertical systems and Flutter apps): https://github.com/danilo62x?tab=repositories

## License

[MIT](./LICENSE), copyright 2026 Danilo Quinelato.
