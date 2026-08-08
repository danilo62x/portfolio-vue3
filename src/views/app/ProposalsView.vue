<template>
  <PageHeader :title="t('proposals.title')" :subtitle="t('proposals.subtitle')">
    <template #action>
      <button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
        @click="create"
      >
        <IconBase name="plus" :size="16" />
        {{ t('proposals.new') }}
      </button>
    </template>
  </PageHeader>

  <div class="mb-4 flex flex-wrap gap-2">
    <button
      v-for="s in STATUSES"
      :key="s"
      type="button"
      :class="`h-9 rounded-lg px-3 text-sm font-medium transition ${
        status === s
          ? 'bg-brand-500 text-white'
          : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
      }`"
      @click="status = s"
    >
      {{ s === 'all' ? t('common.all') : t(`proposalStatuses.${s}`) }}
    </button>
  </div>

  <EmptyState
    v-if="visible.length === 0"
    icon="file-text"
    :title="t('proposals.emptyTitle')"
    :description="t('proposals.emptyDesc')"
  />
  <div v-else class="overflow-x-auto rounded-2xl border border-themed surface-card shadow-theme-sm">
    <table class="w-full min-w-[720px] text-sm">
      <thead>
        <tr class="border-b border-themed text-left text-xs uppercase tracking-wider text-muted">
          <th class="px-5 py-3 font-medium">{{ t('proposals.code') }}</th>
          <th class="px-5 py-3 font-medium">{{ t('proposals.client') }}</th>
          <th class="px-5 py-3 font-medium">{{ t('proposals.titleColumn') }}</th>
          <th class="px-5 py-3 font-medium">{{ t('proposals.validUntil') }}</th>
          <th class="px-5 py-3 font-medium">{{ t('common.status') }}</th>
          <th class="px-5 py-3 text-right font-medium">{{ t('proposals.total') }}</th>
          <th class="w-12 px-2 py-3" />
        </tr>
      </thead>
      <tbody class="divide-y divide-[color:var(--tx-border)]">
        <tr
          v-for="p in visible"
          :key="p.id"
          class="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
          @click="openId = p.id"
        >
          <td class="px-5 py-3 font-medium text-heading">{{ p.code }}</td>
          <td class="px-5 py-3 text-body">{{ p.client || '—' }}</td>
          <td class="px-5 py-3 text-body">{{ p.title }}</td>
          <td class="px-5 py-3">
            <span class="text-muted">{{ formatDate(p.validUntil, locale) }}</span>
            <span v-if="isExpired(p)" class="ml-2">
              <Badge color="error">{{ t('proposals.expired') }}</Badge>
            </span>
          </td>
          <td class="px-5 py-3"><ProposalPill :status="p.status" /></td>
          <td class="px-5 py-3 text-right font-medium text-heading">{{ formatCurrency(proposalTotal(p), locale) }}</td>
          <td class="px-2 py-3"><IconBase name="chevron-right" :size="16" class-name="text-muted" /></td>
        </tr>
      </tbody>
    </table>
  </div>

  <Drawer
    :open="current !== null"
    :title="current?.code"
    :subtitle="current ? formatDate(current.createdAt, locale) : undefined"
    width="max-w-3xl"
    @close="openId = null"
  >
    <div v-if="current" class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="space-y-1.5">
          <span class="block text-sm font-medium text-heading">{{ t('proposals.client') }}</span>
          <input
            :value="current.client"
            class="h-10 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring"
            @input="patch(current.id, { client: ($event.target as HTMLInputElement).value })"
          />
        </label>
        <label class="space-y-1.5">
          <span class="block text-sm font-medium text-heading">{{ t('proposals.validUntil') }}</span>
          <input
            type="date"
            :value="current.validUntil.slice(0, 10)"
            class="h-10 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring"
            @input="patch(current.id, { validUntil: ($event.target as HTMLInputElement).value })"
          />
        </label>
        <label class="space-y-1.5 sm:col-span-2">
          <span class="block text-sm font-medium text-heading">{{ t('proposals.titleColumn') }}</span>
          <input
            :value="current.title"
            class="h-10 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring"
            @input="patch(current.id, { title: ($event.target as HTMLInputElement).value })"
          />
        </label>
      </div>

      <ProposalItemsEditor
        :items="current.items"
        :discount="current.discount"
        @change="patch(current.id, { items: $event })"
        @discount-change="patch(current.id, { discount: $event })"
      />
    </div>

    <template v-if="current" #footer>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="s in ALL_STATUSES"
          :key="s"
          type="button"
          :class="`h-9 rounded-lg px-3 text-xs font-medium transition ${
            current.status === s
              ? 'bg-brand-500 text-white'
              : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
          }`"
          @click="setStatus(current.id, s)"
        >
          {{ t(`proposalStatuses.${s}`) }}
        </button>
        <button
          type="button"
          class="ml-auto inline-flex h-9 items-center gap-2 rounded-lg border border-themed px-3 text-xs font-medium text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/10"
          @click="remove(current.id)"
        >
          <IconBase name="trash" :size="14" />
          {{ t('common.remove') }}
        </button>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/app/PageHeader.vue'
import ProposalPill from '@/components/pf/ProposalPill.vue'
import ProposalItemsEditor from '@/components/pf/ProposalItemsEditor.vue'
import Drawer from '@/components/ui/Drawer.vue'
import IconBase from '@/components/ui/IconBase.vue'
import Badge from '@/components/ui/Badge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { useUiStore } from '@/stores/ui'
import { formatCurrency, formatDate } from '@/lib/format'
import { isExpired, proposalTotal } from '@/data/query'
import type { Proposal, ProposalStatus } from '@/data/types'

const STATUSES: (ProposalStatus | 'all')[] = ['all', 'rascunho', 'enviada', 'aceita', 'recusada']
const ALL_STATUSES: ProposalStatus[] = ['rascunho', 'enviada', 'aceita', 'recusada']

const { t, locale } = useI18n()
usePageTitle(() => t('appNav.proposals'))

const store = usePortfolioStore()
const ui = useUiStore()

const status = ref<ProposalStatus | 'all'>('all')
const openId = ref<number | null>(null)

const visible = computed(() =>
  status.value === 'all' ? store.proposals : store.proposals.filter((p) => p.status === status.value)
)
const current = computed(() => store.proposals.find((p) => p.id === openId.value) ?? null)

function create() {
  const created = store.addProposal({
    leadId: null,
    client: '',
    title: t('proposals.newTitle'),
    items: [{ description: t('proposals.newItem'), qty: 1, price: 0 }],
    discount: 0,
    status: 'rascunho',
    validUntil: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
  })
  openId.value = created.id
}

function patch(id: number, next: Partial<Proposal>) {
  store.updateProposal(id, next)
}

function setStatus(id: number, s: ProposalStatus) {
  patch(id, { status: s })
  ui.notifySuccess(t('proposals.statusChanged', { status: t(`proposalStatuses.${s}`) }))
}

function remove(id: number) {
  store.removeProposal(id)
  openId.value = null
  ui.notifySuccess(t('proposals.removed'))
}
</script>
