<template>
  <div class="flex flex-col rounded-2xl border border-themed surface-card p-6 shadow-theme-sm transition hover:shadow-theme-md">
    <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
      <IconBase :name="service.icon" :size="22" />
    </span>
    <h3 class="mt-5 text-lg font-bold text-heading">{{ service.name }}</h3>
    <p class="mt-2 text-sm text-muted">{{ detailed ? service.description : service.summary }}</p>

    <ul v-if="detailed" class="mt-4 space-y-2">
      <li v-for="d in service.deliverables" :key="d" class="flex items-start gap-2 text-sm text-body">
        <IconBase name="check" :size="16" class-name="mt-0.5 text-success-600" :stroke-width="2.4" />
        {{ d }}
      </li>
    </ul>

    <div class="mt-6 flex items-end justify-between gap-3 border-t border-themed pt-4">
      <div>
        <p class="text-xs text-muted">{{ t('services.priceFrom') }}</p>
        <p class="text-lg font-bold text-heading">{{ formatCurrency(service.priceFrom, locale) }}</p>
      </div>
      <p class="text-xs text-muted">{{ t('services.weeks', { count: service.weeks }) }}</p>
    </div>

    <RouterLink
      :to="`/orcamento?servico=${service.slug}`"
      class="mt-4 flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 text-sm font-medium text-white transition hover:bg-brand-600"
    >
      {{ t('services.request') }}
      <IconBase name="arrow-right" :size="16" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import { formatCurrency } from '@/lib/format'
import type { Service } from '@/data/types'

withDefaults(
  defineProps<{
    service: Service
    /** Mostra a lista de entregáveis. */
    detailed?: boolean
  }>(),
  { detailed: false }
)

const { t, locale } = useI18n()
</script>
