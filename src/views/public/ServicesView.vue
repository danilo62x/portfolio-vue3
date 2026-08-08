<template>
  <div>
    <header class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
      <div class="max-w-2xl">
        <p class="text-sm font-semibold uppercase tracking-wider text-brand-500">{{ t('services.eyebrow') }}</p>
        <h1 class="mt-2 font-bold text-heading text-title-sm sm:text-title-md">{{ t('services.title') }}</h1>
        <p class="mt-3 text-muted">{{ t('services.subtitle') }}</p>
      </div>

      <div class="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          :class="`h-9 rounded-lg px-4 text-sm font-medium transition ${
            category === 'all'
              ? 'bg-brand-500 text-white'
              : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
          }`"
          @click="category = 'all'"
        >
          {{ t('common.all') }}
        </button>
        <button
          v-for="c in categories"
          :key="c"
          type="button"
          :class="`h-9 rounded-lg px-4 text-sm font-medium transition ${
            category === c
              ? 'bg-brand-500 text-white'
              : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
          }`"
          @click="category = c"
        >
          {{ t(`serviceCategories.${c}`) }}
        </button>
      </div>

      <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ServiceCard v-for="service in visible" :key="service.id" :service="service" detailed />
      </div>
    </header>

    <section class="border-y border-themed bg-gray-50 dark:bg-gray-900/40">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="max-w-2xl">
          <p class="text-sm font-semibold uppercase tracking-wider text-brand-500">{{ t('home.process.eyebrow') }}</p>
          <h2 class="mt-2 font-bold text-heading text-title-sm">{{ t('home.process.title') }}</h2>
          <p class="mt-3 text-muted">{{ t('home.process.subtitle') }}</p>
        </div>
        <div class="mt-10">
          <ProcessSteps />
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 class="font-bold text-heading text-title-sm">{{ t('services.faqTitle') }}</h2>
      <div class="mt-8">
        <FaqAccordion />
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-between gap-6 rounded-3xl border border-themed surface-card px-6 py-10 text-center sm:px-12 lg:flex-row lg:text-left">
        <div>
          <h2 class="text-xl font-bold text-heading">{{ t('services.ctaTitle') }}</h2>
          <p class="mt-2 text-muted">{{ t('services.ctaSubtitle') }}</p>
        </div>
        <RouterLink
          to="/orcamento"
          class="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600"
        >
          {{ t('home.cta.button') }}
          <IconBase name="arrow-right" :size="18" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import ServiceCard from '@/components/pf/ServiceCard.vue'
import ProcessSteps from '@/components/pf/ProcessSteps.vue'
import FaqAccordion from '@/components/pf/FaqAccordion.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { serviceCategories, servicesByCategory } from '@/data/query'
import type { ServiceCategory } from '@/data/types'

const { t } = useI18n()
usePageTitle(() => t('nav.services'))

const store = usePortfolioStore()
const category = ref<ServiceCategory | 'all'>('all')

const categories = computed(() => serviceCategories(store.services))
const visible = computed(() => servicesByCategory(store.services, category.value))
</script>
