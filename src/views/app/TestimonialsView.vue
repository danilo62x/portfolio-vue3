<template>
  <PageHeader :title="t('testimonials.title')" :subtitle="t('testimonials.subtitle')">
    <template #action>
      <button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
        @click="startCreate"
      >
        <IconBase name="plus" :size="16" />
        {{ t('testimonials.new') }}
      </button>
    </template>
  </PageHeader>

  <div class="mb-4 flex flex-wrap gap-2">
    <button
      v-for="f in FILTERS"
      :key="f"
      type="button"
      :class="`h-9 rounded-lg px-3 text-sm font-medium transition ${
        filter === f
          ? 'bg-brand-500 text-white'
          : 'border border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
      }`"
      @click="filter = f"
    >
      {{ t(`testimonials.filters.${f}`) }}
    </button>
  </div>

  <EmptyState
    v-if="visible.length === 0"
    icon="message-circle"
    :title="t('testimonials.emptyTitle')"
    :description="t('testimonials.emptyDesc')"
  />
  <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <article
      v-for="row in visible"
      :key="row.id"
      class="flex flex-col rounded-2xl border border-themed surface-card p-5 shadow-theme-sm"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <img :src="row.avatar" :alt="row.author" loading="lazy" class="h-10 w-10 rounded-full object-cover" />
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-heading">{{ row.author }}</p>
            <p class="truncate text-xs text-muted">{{ row.role }} · {{ row.company }}</p>
          </div>
        </div>
        <Badge :color="row.approved ? 'success' : 'warning'" dot>
          {{ row.approved ? t('testimonials.approved') : t('testimonials.pending') }}
        </Badge>
      </div>

      <div class="mt-3 flex gap-0.5">
        <IconBase
          v-for="i in 5"
          :key="i"
          name="star"
          :size="14"
          :class-name="i - 1 < row.rating ? 'text-warning-500' : 'text-gray-300 dark:text-gray-700'"
        />
      </div>

      <p class="mt-3 flex-1 text-sm leading-relaxed text-body">“{{ row.quote }}”</p>

      <p v-if="row.caseId" class="mt-3 text-xs text-muted">
        {{ t('testimonials.linkedCase') }}: {{ store.cases.find((c) => c.id === row.caseId)?.title ?? '—' }}
      </p>

      <div class="mt-4 flex gap-2 border-t border-themed pt-4">
        <button
          type="button"
          class="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-themed text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="toggleApproved(row)"
        >
          <IconBase :name="row.approved ? 'eye-off' : 'check-circle'" :size="15" />
          {{ row.approved ? t('testimonials.unapprove') : t('testimonials.approve') }}
        </button>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-themed text-muted transition hover:text-brand-500"
          :aria-label="t('common.edit')"
          @click="startEdit(row)"
        >
          <IconBase name="edit" :size="15" />
        </button>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-themed text-muted transition hover:text-error-500"
          :aria-label="t('common.remove')"
          @click="remove(row.id)"
        >
          <IconBase name="trash" :size="15" />
        </button>
      </div>
    </article>
  </div>

  <ModalBase
    :open="open"
    :title="editing ? t('testimonials.editTitle') : t('testimonials.newTitle')"
    size="lg"
    @close="open = false"
  >
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('testimonials.form.author') }}</span>
        <input v-model="form.author" :class="input" />
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('testimonials.form.role') }}</span>
        <input v-model="form.role" :class="input" />
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('testimonials.form.company') }}</span>
        <input v-model="form.company" :class="input" />
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('testimonials.form.rating') }}</span>
        <select v-model.number="form.rating" :class="input">
          <option v-for="n in [5, 4, 3, 2, 1]" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('testimonials.form.case') }}</span>
        <select v-model="caseIdValue" :class="input">
          <option value="">{{ t('testimonials.form.noCase') }}</option>
          <option v-for="c in store.cases" :key="c.id" :value="String(c.id)">{{ c.title }}</option>
        </select>
      </label>
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('testimonials.form.quote') }}</span>
        <textarea
          v-model="form.quote"
          :rows="4"
          class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2 text-sm text-body"
        />
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
          :disabled="!form.author.trim() || !form.quote.trim()"
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/app/PageHeader.vue'
import ModalBase from '@/components/ui/ModalBase.vue'
import IconBase from '@/components/ui/IconBase.vue'
import Badge from '@/components/ui/Badge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { useUiStore } from '@/stores/ui'
import { pfImage } from '@/data/mock'
import type { Testimonial } from '@/data/types'

const FILTERS = ['all', 'approved', 'pending'] as const
type Filter = (typeof FILTERS)[number]

interface FormState {
  author: string
  role: string
  company: string
  quote: string
  rating: number
  caseId: number | null
}

const EMPTY = (): FormState => ({ author: '', role: '', company: '', quote: '', rating: 5, caseId: null })

const { t } = useI18n()
usePageTitle(() => t('appNav.testimonials'))

const store = usePortfolioStore()
const ui = useUiStore()

const open = ref(false)
const editing = ref<Testimonial | null>(null)
const form = ref<FormState>(EMPTY())
const filter = ref<Filter>('all')

const input = 'h-10 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring'

const visible = computed(() =>
  store.testimonials.filter((row) =>
    filter.value === 'all' ? true : filter.value === 'approved' ? row.approved : !row.approved
  )
)

const caseIdValue = computed<string>({
  get: () => (form.value.caseId === null ? '' : String(form.value.caseId)),
  set: (v) => {
    form.value = { ...form.value, caseId: v ? Number(v) : null }
  },
})

function startCreate() {
  editing.value = null
  form.value = EMPTY()
  open.value = true
}

function startEdit(row: Testimonial) {
  editing.value = row
  form.value = {
    author: row.author,
    role: row.role,
    company: row.company,
    quote: row.quote,
    rating: row.rating,
    caseId: row.caseId,
  }
  open.value = true
}

function save() {
  if (editing.value) {
    store.updateTestimonial(editing.value.id, { ...form.value })
    ui.notifySuccess(t('testimonials.updated'))
  } else {
    store.addTestimonial({
      ...form.value,
      avatar: pfImage(`testi-${form.value.author || Date.now()}`, 120, 120),
      approved: false,
    })
    ui.notifySuccess(t('testimonials.created'))
  }
  open.value = false
}

function toggleApproved(row: Testimonial) {
  store.toggleApproved(row.id)
  ui.notifySuccess(row.approved ? t('testimonials.unapproved') : t('testimonials.approvedMsg'))
}

function remove(id: number) {
  store.removeTestimonial(id)
  ui.notifySuccess(t('testimonials.removed'))
}
</script>
