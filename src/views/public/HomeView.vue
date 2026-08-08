<template>
  <!-- Hero -->
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-brand-500/10 blur-3xl" />
    <div class="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24 lg:px-8">
      <div>
        <span class="inline-flex items-center gap-2 rounded-full border border-themed px-3 py-1 text-xs font-medium text-muted">
          <span class="h-1.5 w-1.5 rounded-full bg-success-500" />
          {{ t('home.hero.badge') }}
        </span>
        <h1 class="mt-5 font-bold text-heading text-title-sm sm:text-title-md lg:text-title-lg">
          {{ t('home.hero.title') }}
        </h1>
        <p class="mt-5 max-w-xl text-base text-muted sm:text-lg">{{ t('home.hero.subtitle') }}</p>
        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink
            to="/orcamento"
            class="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {{ t('home.hero.cta') }}
            <IconBase name="arrow-right" :size="18" />
          </RouterLink>
          <RouterLink
            to="/cases"
            class="inline-flex h-12 items-center gap-2 rounded-xl border border-themed px-6 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {{ t('home.hero.secondary') }}
          </RouterLink>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <img :src="pfImage('hero-a', 640, 800)" alt="" class="aspect-4/5 w-full rounded-2xl object-cover shadow-theme-lg" />
        <div class="mt-8 space-y-4">
          <img :src="pfImage('hero-b', 640, 480)" alt="" class="aspect-4/3 w-full rounded-2xl object-cover shadow-theme-lg" />
          <img :src="pfImage('hero-c', 640, 480)" alt="" class="aspect-4/3 w-full rounded-2xl object-cover shadow-theme-lg" />
        </div>
      </div>
    </div>
  </section>

  <!-- Números -->
  <section class="border-y border-themed surface-card">
    <div class="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
      <div v-for="s in STATS" :key="s.labelKey">
        <p class="font-bold text-brand-500 text-title-sm">{{ s.value }}</p>
        <p class="mt-1 text-sm text-muted">{{ t(s.labelKey) }}</p>
      </div>
    </div>
  </section>

  <!-- Serviços -->
  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
    <div class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-brand-500">{{ t('home.services.eyebrow') }}</p>
      <h2 class="mt-2 font-bold text-heading text-title-sm">{{ t('home.services.title') }}</h2>
      <p class="mt-3 text-muted">{{ t('home.services.subtitle') }}</p>
    </div>
    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ServiceCard v-for="service in topServices" :key="service.id" :service="service" />
    </div>
  </section>

  <!-- Cases em destaque -->
  <section class="border-y border-themed bg-gray-50 dark:bg-gray-900/40">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="max-w-2xl">
          <p class="text-sm font-semibold uppercase tracking-wider text-brand-500">{{ t('home.cases.eyebrow') }}</p>
          <h2 class="mt-2 font-bold text-heading text-title-sm">{{ t('home.cases.title') }}</h2>
        </div>
        <RouterLink to="/cases" class="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
          {{ t('home.cases.all') }}
          <IconBase name="arrow-right" :size="16" />
        </RouterLink>
      </div>
      <div class="mt-10 grid gap-6 lg:grid-cols-3">
        <CaseCard v-for="study in highlights" :key="study.id" :study="study" />
      </div>
    </div>
  </section>

  <!-- Processo -->
  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
    <div class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-brand-500">{{ t('home.process.eyebrow') }}</p>
      <h2 class="mt-2 font-bold text-heading text-title-sm">{{ t('home.process.title') }}</h2>
      <p class="mt-3 text-muted">{{ t('home.process.subtitle') }}</p>
    </div>
    <div class="mt-10">
      <ProcessSteps />
    </div>
  </section>

  <!-- Depoimentos -->
  <section class="border-y border-themed surface-card">
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20 lg:px-8">
      <h2 class="font-bold text-heading text-title-sm">{{ t('home.testimonials.title') }}</h2>
      <div class="mt-10 grid gap-6 lg:grid-cols-3">
        <TestimonialCard v-for="item in quotes" :key="item.id" :item="item" />
      </div>
    </div>
  </section>

  <!-- Clientes -->
  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <p class="text-center text-sm text-muted">{{ t('home.clients.title') }}</p>
    <div class="mt-8">
      <ClientLogos />
    </div>
  </section>

  <!-- CTA -->
  <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
    <div class="overflow-hidden rounded-3xl bg-brand-500 px-6 py-14 text-center sm:px-12">
      <h2 class="mx-auto max-w-2xl font-bold text-white text-title-sm">{{ t('home.cta.title') }}</h2>
      <p class="mx-auto mt-3 max-w-xl text-brand-100">{{ t('home.cta.subtitle') }}</p>
      <RouterLink
        to="/orcamento"
        class="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-brand-600 transition hover:bg-brand-25"
      >
        {{ t('home.cta.button') }}
        <IconBase name="arrow-right" :size="18" />
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import CaseCard from '@/components/pf/CaseCard.vue'
import ServiceCard from '@/components/pf/ServiceCard.vue'
import TestimonialCard from '@/components/pf/TestimonialCard.vue'
import ProcessSteps from '@/components/pf/ProcessSteps.vue'
import ClientLogos from '@/components/pf/ClientLogos.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { approvedTestimonials, featuredCases } from '@/data/query'
import { pfImage } from '@/data/mock'

const { t } = useI18n()
usePageTitle('')

const store = usePortfolioStore()

const highlights = computed(() => featuredCases(store.cases, 3))
const topServices = computed(() => store.services.filter((s) => s.active).slice(0, 6))
const quotes = computed(() => approvedTestimonials(store.testimonials).slice(0, 3))

const STATS = [
  { value: '120+', labelKey: 'home.stats.projects' },
  { value: '14', labelKey: 'home.stats.years' },
  { value: '38', labelKey: 'home.stats.clients' },
  { value: '4,9', labelKey: 'home.stats.rating' },
]
</script>
