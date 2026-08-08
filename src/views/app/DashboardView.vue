<template>
  <PageHeader :title="t('dashboard.title')" :subtitle="t('dashboard.subtitle')">
    <template #action>
      <RouterLink
        to="/app/orcamentos"
        class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
      >
        <IconBase name="plus" :size="16" />
        {{ t('dashboard.newProposal') }}
      </RouterLink>
    </template>
  </PageHeader>

  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <KpiCard
      :title="t('dashboard.kpi.leads')"
      :value="monthLeads"
      icon="users"
      accent="brand"
      :hint="t('dashboard.kpi.leadsHint')"
      trend="up"
      trend-value="+18%"
    />
    <KpiCard
      :title="t('dashboard.kpi.openProposals')"
      :value="open.length"
      icon="file-text"
      accent="warning"
      :hint="formatCurrency(openValue, locale)"
    />
    <KpiCard
      :title="t('dashboard.kpi.winRate')"
      :value="`${rate}%`"
      icon="trending-up"
      accent="success"
      :hint="t('dashboard.kpi.winRateHint')"
    />
    <KpiCard
      :title="t('dashboard.kpi.revenue')"
      :value="formatCurrency(won, locale)"
      icon="dollar"
      accent="info"
      :hint="t('dashboard.kpi.revenueHint')"
    />
  </div>

  <div class="mt-6 grid gap-6 xl:grid-cols-3">
    <div class="rounded-2xl border border-themed surface-card p-5 shadow-theme-sm xl:col-span-2 md:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-base font-semibold text-heading">{{ t('dashboard.charts.revenue') }}</h2>
        <span class="text-xs text-muted">{{ t('dashboard.charts.lastMonths', { count: 8 }) }}</span>
      </div>
      <div class="mt-4">
        <ApexChart type="area" :height="300" :series="revenueSeries" :options="revenueOptions" />
      </div>
    </div>

    <div class="rounded-2xl border border-themed surface-card p-5 shadow-theme-sm md:p-6">
      <h2 class="text-base font-semibold text-heading">{{ t('dashboard.charts.leads') }}</h2>
      <div class="mt-4">
        <ApexChart type="bar" :height="300" :series="leadsSeries" :options="leadsOptions" />
      </div>
    </div>
  </div>

  <div class="mt-6 grid gap-6 xl:grid-cols-3">
    <!-- Funil -->
    <div class="rounded-2xl border border-themed surface-card p-5 shadow-theme-sm md:p-6">
      <h2 class="text-base font-semibold text-heading">{{ t('dashboard.funnel.title') }}</h2>
      <ul class="mt-5 space-y-4">
        <li v-for="row in funnel" :key="row.stage">
          <div class="flex items-center justify-between gap-2 text-sm">
            <StagePill :stage="row.stage" />
            <span class="font-medium text-heading">{{ row.count }}</span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div class="h-full rounded-full bg-brand-500" :style="{ width: `${(row.count / maxFunnel) * 100}%` }" />
          </div>
          <p v-if="row.amount > 0" class="mt-1 text-xs text-muted">{{ formatCurrency(row.amount, locale) }}</p>
        </li>
      </ul>
    </div>

    <!-- Receita por serviço -->
    <div class="rounded-2xl border border-themed surface-card p-5 shadow-theme-sm md:p-6">
      <h2 class="text-base font-semibold text-heading">{{ t('dashboard.byService.title') }}</h2>
      <p v-if="byService.length === 0" class="mt-6 text-sm text-muted">{{ t('dashboard.byService.empty') }}</p>
      <ul v-else class="mt-5 space-y-4">
        <li v-for="row in byService" :key="row.serviceId">
          <div class="flex items-center justify-between gap-2 text-sm">
            <span class="truncate text-body">{{ row.name }}</span>
            <span class="shrink-0 font-medium text-heading">{{ formatCurrency(row.amount, locale) }}</span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div class="h-full rounded-full bg-success-500" :style="{ width: `${row.share}%` }" />
          </div>
        </li>
      </ul>
    </div>

    <!-- Últimos leads -->
    <div class="rounded-2xl border border-themed surface-card p-5 shadow-theme-sm md:p-6">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-semibold text-heading">{{ t('dashboard.latestLeads') }}</h2>
        <RouterLink to="/app/leads" class="text-xs font-medium text-brand-600 dark:text-brand-400">
          {{ t('common.viewAll') }}
        </RouterLink>
      </div>
      <ul class="mt-4 divide-y divide-[color:var(--tx-border)]">
        <li v-for="lead in latest" :key="lead.id" class="flex items-center justify-between gap-3 py-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-heading">{{ lead.company || lead.name }}</p>
            <p class="truncate text-xs text-muted">{{ formatDate(lead.createdAt, locale) }}</p>
          </div>
          <StagePill :stage="lead.stage" />
        </li>
      </ul>
    </div>
  </div>

  <!-- Propostas abertas -->
  <div class="mt-6 rounded-2xl border border-themed surface-card p-5 shadow-theme-sm md:p-6">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-heading">{{ t('dashboard.openProposals') }}</h2>
      <RouterLink to="/app/orcamentos" class="text-xs font-medium text-brand-600 dark:text-brand-400">
        {{ t('common.viewAll') }}
      </RouterLink>
    </div>
    <div class="mt-4 overflow-x-auto">
      <table class="w-full min-w-[560px] text-sm">
        <thead>
          <tr class="border-b border-themed text-left text-xs uppercase tracking-wider text-muted">
            <th class="py-2 pr-4 font-medium">{{ t('proposals.code') }}</th>
            <th class="py-2 pr-4 font-medium">{{ t('proposals.client') }}</th>
            <th class="py-2 pr-4 font-medium">{{ t('proposals.validUntil') }}</th>
            <th class="py-2 pr-4 font-medium">{{ t('common.status') }}</th>
            <th class="py-2 text-right font-medium">{{ t('proposals.total') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[color:var(--tx-border)]">
          <tr v-for="p in open" :key="p.id">
            <td class="py-3 pr-4 font-medium text-heading">{{ p.code }}</td>
            <td class="py-3 pr-4 text-body">{{ p.client }}</td>
            <td class="py-3 pr-4 text-muted">{{ formatDate(p.validUntil, locale) }}</td>
            <td class="py-3 pr-4"><ProposalPill :status="p.status" /></td>
            <td class="py-3 text-right font-medium text-heading">{{ formatCurrency(proposalTotal(p), locale) }}</td>
          </tr>
          <tr v-if="open.length === 0">
            <td colspan="5" class="py-6 text-center text-muted">{{ t('dashboard.noOpenProposals') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <p class="mt-6 text-xs text-muted">
    {{ t('dashboard.caseCount', { count: store.cases.filter((c) => c.published).length }) }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ApexOptions } from 'apexcharts'
import PageHeader from '@/components/app/PageHeader.vue'
import KpiCard from '@/components/pf/KpiCard.vue'
import StagePill from '@/components/pf/StagePill.vue'
import ProposalPill from '@/components/pf/ProposalPill.vue'
import ApexChart from '@/components/ui/ApexChart.vue'
import IconBase from '@/components/ui/IconBase.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { formatCurrency, formatCompact, formatDate } from '@/lib/format'
import {
  leadFunnel,
  leadsThisMonth,
  openProposals,
  proposalTotal,
  recentLeads,
  revenueByService,
  winRate,
} from '@/data/query'
import { LEADS_SERIES, REVENUE_SERIES } from '@/data/mock'

const { t, locale } = useI18n()
usePageTitle(() => t('appNav.dashboard'))

const store = usePortfolioStore()

const monthLeads = computed(() => leadsThisMonth(store.leads))
const open = computed(() => openProposals(store.proposals))
const openValue = computed(() => open.value.reduce((sum, p) => sum + proposalTotal(p), 0))
const rate = computed(() => winRate(store.proposals))
const won = computed(() =>
  store.proposals.filter((p) => p.status === 'aceita').reduce((sum, p) => sum + proposalTotal(p), 0)
)

const funnel = computed(() => leadFunnel(store.leads, store.proposals))
const byService = computed(() => revenueByService(store.proposals, store.leads, store.services))
const latest = computed(() => recentLeads(store.leads, 5))
const maxFunnel = computed(() => Math.max(1, ...funnel.value.map((f) => f.count)))

const revenueSeries = computed(() => [
  { name: t('dashboard.charts.revenueSeries'), data: REVENUE_SERIES.map((p) => p.value) },
])
const revenueOptions = computed<ApexOptions>(() => ({
  xaxis: { categories: REVENUE_SERIES.map((p) => p.label) },
  yaxis: { labels: { formatter: (v: number) => formatCompact(v, locale.value) } },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
}))

const leadsSeries = computed(() => [
  { name: t('dashboard.charts.leadsSeries'), data: LEADS_SERIES.map((p) => p.value) },
])
const leadsOptions = computed<ApexOptions>(() => ({
  xaxis: { categories: LEADS_SERIES.map((p) => p.label) },
  plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
}))
</script>
