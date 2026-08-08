<template>
  <RouterLink
    :to="`/cases/${study.slug}`"
    class="group flex flex-col overflow-hidden rounded-2xl border border-themed surface-card shadow-theme-sm transition hover:shadow-theme-lg"
  >
    <div :class="`relative overflow-hidden ${featured ? 'aspect-16/10' : 'aspect-4/3'}`">
      <img
        :src="study.cover"
        :alt="study.title"
        loading="lazy"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span class="absolute left-4 top-4">
        <Badge color="brand" variant="solid">{{ t(`caseCategories.${study.category}`) }}</Badge>
      </span>
    </div>
    <div class="flex flex-1 flex-col p-5 md:p-6">
      <p class="text-xs font-medium uppercase tracking-wider text-muted">{{ study.client }} · {{ study.year }}</p>
      <h3 :class="`mt-2 font-bold text-heading ${featured ? 'text-title-sm' : 'text-lg'}`">{{ study.title }}</h3>
      <p class="mt-2 line-clamp-2 flex-1 text-sm text-muted">{{ study.summary }}</p>

      <div v-if="study.results.length > 0" class="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-themed pt-4">
        <div v-for="r in study.results.slice(0, featured ? 3 : 2)" :key="r.label">
          <p class="text-lg font-bold text-brand-500">{{ r.value }}</p>
          <p class="text-xs text-muted">{{ r.label }}</p>
        </div>
      </div>

      <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
        {{ t('common.viewCase') }}
        <IconBase name="arrow-right" :size="16" class-name="transition group-hover:translate-x-0.5" />
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/Badge.vue'
import IconBase from '@/components/ui/IconBase.vue'
import type { CaseStudy } from '@/data/types'

withDefaults(
  defineProps<{
    study: CaseStudy
    /** Cartão maior, usado no destaque da home. */
    featured?: boolean
  }>(),
  { featured: false }
)

const { t } = useI18n()
</script>
