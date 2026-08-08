<template>
  <div>
    <header class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wider text-brand-500">{{ t('about.eyebrow') }}</p>
          <h1 class="mt-2 font-bold text-heading text-title-sm sm:text-title-md">{{ t('about.title') }}</h1>
          <p class="mt-4 text-muted">{{ t('about.p1') }}</p>
          <p class="mt-3 text-muted">{{ t('about.p2') }}</p>
        </div>
        <img
          :src="pfImage('studio-hero', 960, 720)"
          alt=""
          class="aspect-4/3 w-full rounded-2xl object-cover shadow-theme-lg"
        />
      </div>
    </header>

    <section class="border-y border-themed surface-card">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 class="font-bold text-heading text-title-sm">{{ t('about.valuesTitle') }}</h2>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="v in VALUES" :key="v.titleKey" class="rounded-2xl border border-themed p-6">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
              <IconBase :name="v.icon" :size="20" />
            </span>
            <h3 class="mt-4 text-base font-bold text-heading">{{ t(v.titleKey) }}</h3>
            <p class="mt-2 text-sm text-muted">{{ t(v.descKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 class="font-bold text-heading text-title-sm">{{ t('about.teamTitle') }}</h2>
      <p class="mt-3 max-w-2xl text-muted">{{ t('about.teamSubtitle') }}</p>
      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <TeamCard v-for="member in store.team" :key="member.id" :member="member" />
      </div>
    </section>

    <section class="border-y border-themed bg-gray-50 dark:bg-gray-900/40">
      <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 class="font-bold text-heading text-title-sm">{{ t('about.timelineTitle') }}</h2>
        <ol class="mt-8 space-y-6 border-l border-themed pl-6">
          <li v-for="item in TIMELINE" :key="item.year" class="relative">
            <span class="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-brand-500 bg-[color:var(--tx-body-bg)]" />
            <p class="text-sm font-semibold text-brand-500">{{ item.year }}</p>
            <p class="mt-1 text-sm text-muted">{{ t(item.key) }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p class="text-center text-sm text-muted">{{ t('home.clients.title') }}</p>
      <div class="mt-8">
        <ClientLogos />
      </div>
      <div class="mt-12 text-center">
        <RouterLink
          to="/contato"
          class="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          {{ t('about.cta') }}
          <IconBase name="arrow-right" :size="18" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import TeamCard from '@/components/pf/TeamCard.vue'
import ClientLogos from '@/components/pf/ClientLogos.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { pfImage } from '@/data/mock'

const VALUES = [
  { icon: 'search', titleKey: 'about.values.v1.title', descKey: 'about.values.v1.desc' },
  { icon: 'users', titleKey: 'about.values.v2.title', descKey: 'about.values.v2.desc' },
  { icon: 'chart', titleKey: 'about.values.v3.title', descKey: 'about.values.v3.desc' },
  { icon: 'shield-check', titleKey: 'about.values.v4.title', descKey: 'about.values.v4.desc' },
]

const TIMELINE = [
  { year: '2012', key: 'about.timeline.t1' },
  { year: '2016', key: 'about.timeline.t2' },
  { year: '2020', key: 'about.timeline.t3' },
  { year: '2023', key: 'about.timeline.t4' },
  { year: '2026', key: 'about.timeline.t5' },
]

const { t } = useI18n()
usePageTitle(() => t('nav.about'))

const store = usePortfolioStore()
</script>
