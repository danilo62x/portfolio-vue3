<template>
  <Badge :color="STAGE_COLOR[stage]" dot>{{ t(`leadStages.${stage}`) }}</Badge>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/Badge.vue'
import type { LeadStage } from '@/data/types'

type Color = 'brand' | 'success' | 'warning' | 'error' | 'gray'

defineProps<{ stage: LeadStage }>()

const { t } = useI18n()

const STAGE_COLOR: Record<LeadStage, Color> = {
  novo: 'gray',
  contato: 'brand',
  proposta: 'warning',
  ganho: 'success',
  perdido: 'error',
}
</script>
