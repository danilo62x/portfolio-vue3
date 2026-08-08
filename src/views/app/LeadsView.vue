<template>
  <div class="flex h-full flex-col">
    <PageHeader :title="t('leads.title')" :subtitle="t('leads.subtitle')" />

    <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
      <label class="relative w-full lg:max-w-xs">
        <IconBase
          name="search"
          :size="18"
          class-name="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          v-model="search"
          :placeholder="t('leads.searchPlaceholder')"
          class="h-10 w-full rounded-lg border border-themed bg-transparent pl-10 pr-3 text-sm text-body focus-ring"
        />
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="s in SOURCES"
          :key="s"
          type="button"
          :class="`h-9 rounded-lg px-3 text-sm font-medium transition ${
            source === s
              ? 'bg-brand-500 text-white'
              : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
          }`"
          @click="source = s"
        >
          {{ s === 'all' ? t('common.all') : t(`leadSources.${s}`) }}
        </button>
      </div>
      <span class="text-sm text-muted lg:ml-auto">{{ t('leads.count', { count: visible.length }) }}</span>
    </div>

    <!-- Quadro por estágio -->
    <div class="flex-1 overflow-x-auto pb-2">
      <div class="grid min-w-[900px] grid-cols-5 gap-4">
        <section
          v-for="stage in LEAD_STAGES"
          :key="stage"
          :class="`flex flex-col rounded-2xl border p-3 transition ${
            dragOver === stage
              ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10'
              : 'border-themed bg-gray-50/60 dark:bg-gray-900/30'
          }`"
          @dragover.prevent="dragOver = stage"
          @dragleave="dragOver = null"
          @drop="onDrop($event, stage)"
        >
          <header class="mb-3 flex items-center justify-between gap-2">
            <StagePill :stage="stage" />
            <span class="text-xs font-medium text-muted">{{ byStage(stage).length }}</span>
          </header>
          <div class="flex flex-col gap-3">
            <LeadCard
              v-for="lead in byStage(stage)"
              :key="lead.id"
              :lead="lead"
              @open="selected = $event"
              @dragstart="onDragStart"
            />
            <p
              v-if="byStage(stage).length === 0"
              class="rounded-xl border border-dashed border-themed py-6 text-center text-xs text-muted"
            >
              {{ t('leads.emptyColumn') }}
            </p>
          </div>
        </section>
      </div>
    </div>

    <!-- Detalhe -->
    <Drawer
      :open="selected !== null"
      :title="selected?.company || selected?.name"
      :subtitle="selected ? formatDateTime(selected.createdAt, locale) : undefined"
      width="max-w-lg"
      @close="selected = null"
    >
      <div v-if="selected" class="space-y-5 text-sm">
        <div class="flex flex-wrap gap-2">
          <StagePill :stage="selected.stage" />
          <Badge color="gray">{{ t(`leadSources.${selected.source}`) }}</Badge>
        </div>

        <dl class="divide-y divide-[color:var(--tx-border)] rounded-xl border border-themed">
          <div v-for="row in detailRows" :key="row.key" class="flex justify-between gap-3 px-4 py-2.5">
            <dt class="text-muted">{{ t(row.key) }}</dt>
            <dd class="text-right font-medium text-heading">{{ row.value }}</dd>
          </div>
        </dl>

        <div v-if="selected.scope.length > 0">
          <p class="text-xs uppercase tracking-wider text-muted">{{ t('brief.review.scope') }}</p>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <Badge v-for="slug in selected.scope" :key="slug" color="brand">
              {{ serviceBySlug(store.services, slug)?.name ?? slug }}
            </Badge>
          </div>
        </div>

        <div v-if="selected.message">
          <p class="text-xs uppercase tracking-wider text-muted">{{ t('contact.form.message') }}</p>
          <p class="mt-2 rounded-xl border border-themed p-3 leading-relaxed text-body">{{ selected.message }}</p>
        </div>

        <div>
          <p class="text-xs uppercase tracking-wider text-muted">{{ t('leads.changeStage') }}</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="stage in LEAD_STAGES"
              :key="stage"
              type="button"
              :class="`h-9 rounded-lg px-3 text-xs font-medium transition ${
                selected.stage === stage
                  ? 'bg-brand-500 text-white'
                  : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
              }`"
              @click="changeStage(stage)"
            >
              {{ t(`leadStages.${stage}`) }}
            </button>
          </div>
        </div>
      </div>

      <template v-if="selected" #footer>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
            @click="convert(selected)"
          >
            <IconBase name="file-text" :size="16" />
            {{ t('leads.convert') }}
          </button>
          <button
            type="button"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-themed px-4 text-sm font-medium text-error-500 transition hover:bg-error-50 dark:hover:bg-error-500/10"
            @click="remove(selected)"
          >
            <IconBase name="trash" :size="16" />
            {{ t('common.remove') }}
          </button>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/app/PageHeader.vue'
import LeadCard from '@/components/pf/LeadCard.vue'
import StagePill from '@/components/pf/StagePill.vue'
import Drawer from '@/components/ui/Drawer.vue'
import IconBase from '@/components/ui/IconBase.vue'
import Badge from '@/components/ui/Badge.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { useUiStore } from '@/stores/ui'
import { formatDateTime } from '@/lib/format'
import { LEAD_STAGES, filterLeads, serviceBySlug } from '@/data/query'
import type { Lead, LeadSource, LeadStage } from '@/data/types'

const SOURCES: (LeadSource | 'all')[] = ['all', 'site', 'briefing', 'indicacao', 'social']

const { t, locale } = useI18n()
usePageTitle(() => t('appNav.leads'))

const store = usePortfolioStore()
const ui = useUiStore()

const search = ref('')
const source = ref<LeadSource | 'all'>('all')
const selected = ref<Lead | null>(null)
const dragOver = ref<LeadStage | null>(null)

const visible = computed(() => filterLeads(store.leads, { search: search.value, source: source.value }))
const byStage = (stage: LeadStage) => visible.value.filter((l) => l.stage === stage)

const detailRows = computed(() => {
  const lead = selected.value
  if (!lead) return []
  return [
    { key: 'contact.form.name', value: lead.name },
    { key: 'contact.form.email', value: lead.email },
    { key: 'contact.form.phone', value: lead.phone || '—' },
    { key: 'contact.form.company', value: lead.company || '—' },
    { key: 'brief.review.budget', value: lead.budget || '—' },
    { key: 'brief.review.deadline', value: lead.deadline || '—' },
  ]
})

function onDragStart(e: DragEvent, leadId: number) {
  e.dataTransfer?.setData('text/plain', String(leadId))
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDrop(e: DragEvent, stage: LeadStage) {
  e.preventDefault()
  dragOver.value = null
  const id = Number(e.dataTransfer?.getData('text/plain'))
  if (!id) return
  store.moveLeadStage(id, stage)
  ui.notifySuccess(t('leads.moved', { stage: t(`leadStages.${stage}`) }))
}

function changeStage(stage: LeadStage) {
  if (!selected.value) return
  store.moveLeadStage(selected.value.id, stage)
  selected.value = { ...selected.value, stage }
}

function convert(lead: Lead) {
  const items = lead.scope
    .map((slug) => serviceBySlug(store.services, slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ description: s.name, qty: 1, price: s.priceFrom }))

  store.addProposal({
    leadId: lead.id,
    client: lead.company || lead.name,
    title: t('leads.proposalTitle', { name: lead.company || lead.name }),
    items: items.length > 0 ? items : [{ description: t('proposals.newItem'), qty: 1, price: 0 }],
    discount: 0,
    status: 'rascunho',
    validUntil: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
  })
  store.moveLeadStage(lead.id, 'proposta')
  selected.value = null
  ui.notifySuccess(t('leads.converted'))
}

function remove(lead: Lead) {
  store.removeLead(lead.id)
  selected.value = null
  ui.notifySuccess(t('leads.removed'))
}
</script>
