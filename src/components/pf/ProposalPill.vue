<template>
  <Badge :color="PROPOSAL_COLOR[status]" dot>{{ t(`proposalStatuses.${status}`) }}</Badge>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/Badge.vue'
import type { ProposalStatus } from '@/data/types'

type Color = 'brand' | 'success' | 'warning' | 'error' | 'gray'

defineProps<{ status: ProposalStatus }>()

const { t } = useI18n()

const PROPOSAL_COLOR: Record<ProposalStatus, Color> = {
  rascunho: 'gray',
  enviada: 'brand',
  aceita: 'success',
  recusada: 'error',
}
</script>
