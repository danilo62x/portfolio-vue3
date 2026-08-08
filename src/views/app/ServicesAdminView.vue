<template>
  <PageHeader :title="t('servicesAdmin.title')" :subtitle="t('servicesAdmin.subtitle')">
    <template #action>
      <button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
        @click="startCreate"
      >
        <IconBase name="plus" :size="16" />
        {{ t('servicesAdmin.new') }}
      </button>
    </template>
  </PageHeader>

  <div class="overflow-x-auto rounded-2xl border border-themed surface-card shadow-theme-sm">
    <table class="w-full min-w-[720px] text-sm">
      <thead>
        <tr class="border-b border-themed text-left text-xs uppercase tracking-wider text-muted">
          <th class="px-5 py-3 font-medium">{{ t('servicesAdmin.form.name') }}</th>
          <th class="px-5 py-3 font-medium">{{ t('servicesAdmin.form.category') }}</th>
          <th class="px-5 py-3 font-medium">{{ t('servicesAdmin.form.price') }}</th>
          <th class="px-5 py-3 font-medium">{{ t('servicesAdmin.form.weeks') }}</th>
          <th class="px-5 py-3 font-medium">{{ t('common.status') }}</th>
          <th class="w-28 px-5 py-3" />
        </tr>
      </thead>
      <tbody class="divide-y divide-[color:var(--tx-border)]">
        <tr v-for="service in store.services" :key="service.id">
          <td class="px-5 py-3">
            <div class="flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/15">
                <IconBase :name="service.icon" :size="17" />
              </span>
              <div class="min-w-0">
                <p class="truncate font-medium text-heading">{{ service.name }}</p>
                <p class="truncate text-xs text-muted">{{ service.summary }}</p>
              </div>
            </div>
          </td>
          <td class="px-5 py-3">
            <Badge color="gray">{{ t(`serviceCategories.${service.category}`) }}</Badge>
          </td>
          <td class="px-5 py-3 text-body">{{ formatCurrency(service.priceFrom, locale) }}</td>
          <td class="px-5 py-3 text-muted">{{ t('services.weeks', { count: service.weeks }) }}</td>
          <td class="px-5 py-3">
            <SwitchToggle
              :model-value="service.active"
              size="sm"
              @update:model-value="store.toggleServiceActive(service.id)"
            />
          </td>
          <td class="px-5 py-3">
            <div class="flex justify-end gap-1">
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:text-brand-500"
                :aria-label="t('common.edit')"
                @click="startEdit(service)"
              >
                <IconBase name="edit" :size="16" />
              </button>
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:text-error-500"
                :aria-label="t('common.remove')"
                @click="remove(service.id)"
              >
                <IconBase name="trash" :size="16" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalBase
    :open="open"
    :title="editing ? t('servicesAdmin.editTitle') : t('servicesAdmin.newTitle')"
    size="lg"
    @close="open = false"
  >
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('servicesAdmin.form.name') }}</span>
        <input v-model="form.name" :class="input" />
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('servicesAdmin.form.category') }}</span>
        <select v-model="form.category" :class="input">
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ t(`serviceCategories.${c}`) }}</option>
        </select>
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('servicesAdmin.form.icon') }}</span>
        <select v-model="form.icon" :class="input">
          <option v-for="i in ICONS" :key="i" :value="i">{{ i }}</option>
        </select>
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('servicesAdmin.form.price') }}</span>
        <input v-model.number="form.priceFrom" type="number" :min="0" :step="500" :class="input" />
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('servicesAdmin.form.weeks') }}</span>
        <input v-model.number="form.weeks" type="number" :min="1" :class="input" />
      </label>
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('servicesAdmin.form.summary') }}</span>
        <input v-model="form.summary" :class="input" />
      </label>
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('servicesAdmin.form.description') }}</span>
        <textarea
          v-model="form.description"
          :rows="3"
          class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2 text-sm text-body"
        />
      </label>
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('servicesAdmin.form.deliverables') }}</span>
        <textarea
          v-model="form.deliverables"
          :rows="5"
          class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2 text-sm text-body"
        />
        <span class="block text-xs text-muted">{{ t('servicesAdmin.form.deliverablesHint') }}</span>
      </label>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="h-10 rounded-lg border border-themed px-4 text-sm font-medium text-body"
          @click="open = false"
        >
          {{ t('common.cancel') }}
        </button>
        <button
          type="button"
          :disabled="!form.name.trim()"
          class="h-10 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white disabled:opacity-40"
          @click="save"
        >
          {{ t('common.save') }}
        </button>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/app/PageHeader.vue'
import ModalBase from '@/components/ui/ModalBase.vue'
import IconBase from '@/components/ui/IconBase.vue'
import Badge from '@/components/ui/Badge.vue'
import SwitchToggle from '@/components/ui/SwitchToggle.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { useUiStore } from '@/stores/ui'
import { formatCurrency } from '@/lib/format'
import type { Service, ServiceCategory } from '@/data/types'

const CATEGORIES: ServiceCategory[] = ['branding', 'web', 'produto', 'marketing', 'motion']
const ICONS = ['sparkles', 'globe', 'layers', 'shopping-bag', 'rocket', 'zap', 'chart', 'briefcase']

interface FormState {
  name: string
  category: ServiceCategory
  summary: string
  description: string
  deliverables: string
  priceFrom: number
  weeks: number
  icon: string
}

const EMPTY = (): FormState => ({
  name: '',
  category: 'branding',
  summary: '',
  description: '',
  deliverables: '',
  priceFrom: 0,
  weeks: 4,
  icon: 'sparkles',
})

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const { t, locale } = useI18n()
usePageTitle(() => t('appNav.services'))

const store = usePortfolioStore()
const ui = useUiStore()

const open = ref(false)
const editing = ref<Service | null>(null)
const form = ref<FormState>(EMPTY())

const input = 'h-10 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring'

function startCreate() {
  editing.value = null
  form.value = EMPTY()
  open.value = true
}

function startEdit(service: Service) {
  editing.value = service
  form.value = {
    name: service.name,
    category: service.category,
    summary: service.summary,
    description: service.description,
    deliverables: service.deliverables.join('\n'),
    priceFrom: service.priceFrom,
    weeks: service.weeks,
    icon: service.icon,
  }
  open.value = true
}

function save() {
  const deliverables = form.value.deliverables
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  if (editing.value) {
    store.updateService(editing.value.id, { ...form.value, deliverables, slug: slugify(form.value.name) })
    ui.notifySuccess(t('servicesAdmin.updated'))
  } else {
    store.addService({
      ...form.value,
      deliverables,
      slug: slugify(form.value.name) || `servico-${Date.now()}`,
      active: true,
    })
    ui.notifySuccess(t('servicesAdmin.created'))
  }
  open.value = false
}

function remove(id: number) {
  store.removeService(id)
  ui.notifySuccess(t('servicesAdmin.removed'))
}
</script>
