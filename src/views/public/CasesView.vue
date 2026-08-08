<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
    <header class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-brand-500">{{ t('cases.eyebrow') }}</p>
      <h1 class="mt-2 font-bold text-heading text-title-sm sm:text-title-md">{{ t('cases.title') }}</h1>
      <p class="mt-3 text-muted">{{ t('cases.subtitle') }}</p>
    </header>

    <div class="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in CATEGORIES"
          :key="c"
          type="button"
          :class="`h-9 rounded-lg px-4 text-sm font-medium transition ${
            category === c
              ? 'bg-brand-500 text-white'
              : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
          }`"
          @click="setCategory(c)"
        >
          {{ c === 'all' ? t('common.all') : t(`caseCategories.${c}`) }}
        </button>
      </div>

      <label class="relative w-full lg:w-72">
        <IconBase
          name="search"
          :size="18"
          class-name="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          :value="search"
          :placeholder="t('cases.searchPlaceholder')"
          class="h-11 w-full rounded-lg border border-themed bg-transparent pl-10 pr-3 text-sm text-body focus-ring"
          @input="setSearch(($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>

    <p class="mt-6 text-sm text-muted">{{ t('cases.count', { count: results.length }) }}</p>

    <div v-if="visible.length === 0" class="mt-10">
      <EmptyState icon="briefcase" :title="t('cases.emptyTitle')" :description="t('cases.emptyDesc')" />
    </div>
    <div v-else class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CaseCard v-for="study in visible" :key="study.id" :study="study" />
    </div>

    <div v-if="total > 1" class="mt-10">
      <Pagination :page="current" :total-pages="total" @change="page = $event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Pagination from '@/components/ui/Pagination.vue'
import CaseCard from '@/components/pf/CaseCard.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { filterCases, pageCount, paginate, sortCases } from '@/data/query'
import type { CaseCategory } from '@/data/types'

const CATEGORIES: (CaseCategory | 'all')[] = ['all', 'branding', 'web', 'app', 'ecommerce', 'campanha']
const PER_PAGE = 6

const { t } = useI18n()
usePageTitle(() => t('nav.cases'))

const store = usePortfolioStore()
const search = ref('')
const category = ref<CaseCategory | 'all'>('all')
const page = ref(1)

const results = computed(() =>
  sortCases(filterCases(store.cases, { search: search.value, category: category.value, onlyPublished: true }))
)

const total = computed(() => pageCount(results.value.length, PER_PAGE))
const current = computed(() => Math.min(page.value, total.value))
const visible = computed(() => paginate(results.value, current.value, PER_PAGE))

function setCategory(c: CaseCategory | 'all') {
  category.value = c
  page.value = 1
}
function setSearch(value: string) {
  search.value = value
  page.value = 1
}
</script>
