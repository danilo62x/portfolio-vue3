<template>
  <div v-if="!study || !study.published" class="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
    <EmptyState icon="briefcase" :title="t('cases.notFoundTitle')" :description="t('cases.notFoundDesc')">
      <template #action>
        <RouterLink
          to="/cases"
          class="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white"
        >
          <IconBase name="arrow-right" :size="16" class-name="rotate-180" />
          {{ t('cases.backToList') }}
        </RouterLink>
      </template>
    </EmptyState>
  </div>

  <article v-else>
    <!-- Capa -->
    <header class="relative">
      <div class="aspect-16/9 max-h-[520px] w-full overflow-hidden lg:aspect-21/9">
        <img :src="study.cover" :alt="study.title" class="h-full w-full object-cover" />
      </div>
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div class="-mt-16 rounded-2xl border border-themed surface-card p-6 shadow-theme-lg md:p-10">
          <div class="flex flex-wrap items-center gap-3">
            <Badge color="brand" variant="solid">{{ t(`caseCategories.${study.category}`) }}</Badge>
            <span class="text-sm text-muted">{{ study.client }} · {{ study.year }}</span>
          </div>
          <h1 class="mt-4 font-bold text-heading text-title-sm sm:text-title-md">{{ study.title }}</h1>
          <p class="mt-4 text-base text-muted sm:text-lg">{{ study.summary }}</p>

          <dl class="mt-8 grid gap-6 border-t border-themed pt-6 sm:grid-cols-3">
            <div>
              <dt class="text-xs uppercase tracking-wider text-muted">{{ t('caseDetail.client') }}</dt>
              <dd class="mt-1 text-sm font-medium text-heading">{{ study.client }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wider text-muted">{{ t('caseDetail.year') }}</dt>
              <dd class="mt-1 text-sm font-medium text-heading">{{ study.year }}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wider text-muted">{{ t('caseDetail.services') }}</dt>
              <dd class="mt-1 flex flex-wrap gap-1.5">
                <Badge v-for="s in usedServices" :key="s.id" color="gray">{{ s.name }}</Badge>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </header>

    <!-- Desafio e solução -->
    <section class="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="grid gap-10 md:grid-cols-2">
        <div>
          <h2 class="text-lg font-bold text-heading">{{ t('caseDetail.challenge') }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted">{{ study.challenge }}</p>
        </div>
        <div>
          <h2 class="text-lg font-bold text-heading">{{ t('caseDetail.solution') }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-muted">{{ study.solution }}</p>
        </div>
      </div>
    </section>

    <!-- Resultados -->
    <section v-if="study.results.length > 0" class="border-y border-themed bg-gray-50 dark:bg-gray-900/40">
      <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 class="text-lg font-bold text-heading">{{ t('caseDetail.results') }}</h2>
        <div class="mt-6 grid gap-6 sm:grid-cols-3">
          <div v-for="r in study.results" :key="r.label" class="rounded-2xl border border-themed surface-card p-6">
            <p class="font-bold text-brand-500 text-title-sm">{{ r.value }}</p>
            <p class="mt-1 text-sm text-muted">{{ r.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Galeria -->
    <section v-if="study.gallery.length > 0" class="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:grid-cols-2">
        <img
          v-for="(src, i) in study.gallery"
          :key="src"
          :src="src"
          :alt="`${study.title} ${i + 1}`"
          loading="lazy"
          :class="`w-full rounded-2xl object-cover ${i === 0 ? 'sm:col-span-2 aspect-16/9' : 'aspect-4/3'}`"
        />
      </div>
    </section>

    <!-- Depoimento do cliente -->
    <section v-if="quote" class="mx-auto max-w-3xl px-4 pb-14 sm:px-6 lg:px-8">
      <TestimonialCard :item="quote" />
    </section>

    <!-- Tags e navegação -->
    <section class="mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-center justify-between gap-4 border-y border-themed py-6">
        <div class="flex flex-wrap gap-2">
          <Badge v-for="tag in study.tags" :key="tag" color="gray">{{ tag }}</Badge>
        </div>
        <RouterLink
          v-if="next"
          :to="`/cases/${next.slug}`"
          class="inline-flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400"
        >
          {{ t('caseDetail.next') }}: {{ next.title }}
          <IconBase name="arrow-right" :size="16" />
        </RouterLink>
      </div>
    </section>

    <!-- Relacionados -->
    <section v-if="related.length > 0" class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <h2 class="text-lg font-bold text-heading">{{ t('caseDetail.related') }}</h2>
      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CaseCard v-for="c in related" :key="c.id" :study="c" />
      </div>
    </section>

    <!-- CTA -->
    <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div class="rounded-3xl bg-brand-500 px-6 py-12 text-center sm:px-12">
        <h2 class="font-bold text-white text-title-sm">{{ t('caseDetail.ctaTitle') }}</h2>
        <RouterLink
          to="/orcamento"
          class="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-brand-600"
        >
          {{ t('home.cta.button') }}
          <IconBase name="arrow-right" :size="18" />
        </RouterLink>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import Badge from '@/components/ui/Badge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import CaseCard from '@/components/pf/CaseCard.vue'
import TestimonialCard from '@/components/pf/TestimonialCard.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { caseBySlug, nextCase, relatedCases, servicesOfCase, testimonialForCase } from '@/data/query'

const route = useRoute()
const { t } = useI18n()

const store = usePortfolioStore()

const slug = computed(() => (route.params.slug as string) ?? '')
const study = computed(() => caseBySlug(store.cases, slug.value))

usePageTitle(() => study.value?.title ?? t('cases.notFoundTitle'))

const usedServices = computed(() => (study.value ? servicesOfCase(store.services, study.value) : []))
const quote = computed(() => (study.value ? testimonialForCase(store.testimonials, study.value.id) : undefined))
const related = computed(() => (study.value ? relatedCases(store.cases, study.value, 3) : []))
const next = computed(() => (study.value ? nextCase(store.cases, study.value) : undefined))
</script>
