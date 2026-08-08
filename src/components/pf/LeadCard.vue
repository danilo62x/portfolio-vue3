<template>
  <article
    draggable="true"
    class="cursor-pointer rounded-xl border border-themed surface-card p-4 shadow-theme-xs transition hover:shadow-theme-md"
    @dragstart="emit('dragstart', $event, lead.id)"
    @click="emit('open', lead)"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-heading">{{ lead.company || lead.name }}</p>
        <p class="truncate text-xs text-muted">{{ lead.name }}</p>
      </div>
      <Badge color="gray">{{ t(`leadSources.${lead.source}`) }}</Badge>
    </div>

    <p class="mt-3 line-clamp-2 text-xs text-muted">{{ lead.message }}</p>

    <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
      <span class="inline-flex items-center gap-1">
        <IconBase name="dollar" :size="13" />
        {{ lead.budget }}
      </span>
      <span class="inline-flex items-center gap-1">
        <IconBase name="clock" :size="13" />
        {{ lead.deadline }}
      </span>
    </div>

    <p class="mt-3 border-t border-themed pt-2 text-[11px] text-muted">
      {{ formatDate(lead.createdAt, locale) }}
    </p>
  </article>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import Badge from '@/components/ui/Badge.vue'
import { formatDate } from '@/lib/format'
import type { Lead } from '@/data/types'

defineProps<{ lead: Lead }>()

const emit = defineEmits<{
  open: [lead: Lead]
  dragstart: [event: DragEvent, leadId: number]
}>()

const { t, locale } = useI18n()
</script>
