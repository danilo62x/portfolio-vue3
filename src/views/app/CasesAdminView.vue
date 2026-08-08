<template>
  <PageHeader :title="t('casesAdmin.title')" :subtitle="t('casesAdmin.subtitle')">
    <template #action>
      <button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
        @click="startCreate"
      >
        <IconBase name="plus" :size="16" />
        {{ t('casesAdmin.new') }}
      </button>
    </template>
  </PageHeader>

  <EmptyState
    v-if="store.cases.length === 0"
    icon="briefcase"
    :title="t('casesAdmin.emptyTitle')"
    :description="t('casesAdmin.emptyDesc')"
  />
  <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <article
      v-for="study in store.cases"
      :key="study.id"
      class="flex flex-col overflow-hidden rounded-2xl border border-themed surface-card shadow-theme-sm"
    >
      <div class="relative aspect-16/9">
        <img :src="study.cover" :alt="study.title" loading="lazy" class="h-full w-full object-cover" />
        <div class="absolute left-3 top-3 flex gap-2">
          <Badge :color="study.published ? 'success' : 'gray'" variant="solid">
            {{ study.published ? t('casesAdmin.published') : t('casesAdmin.draft') }}
          </Badge>
          <Badge v-if="study.featured" color="warning" variant="solid" icon="star">
            {{ t('casesAdmin.featured') }}
          </Badge>
        </div>
      </div>
      <div class="flex flex-1 flex-col p-5">
        <p class="text-xs uppercase tracking-wider text-muted">{{ study.client }} · {{ study.year }}</p>
        <h3 class="mt-1 text-base font-bold text-heading">{{ study.title }}</h3>
        <p class="mt-2 line-clamp-2 flex-1 text-sm text-muted">{{ study.summary }}</p>

        <div class="mt-4 space-y-3 border-t border-themed pt-4">
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm text-body">{{ t('casesAdmin.publishedLabel') }}</span>
            <SwitchToggle
              :model-value="study.published"
              size="sm"
              @update:model-value="store.togglePublished(study.id)"
            />
          </div>
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm text-body">{{ t('casesAdmin.featuredLabel') }}</span>
            <SwitchToggle
              :model-value="study.featured"
              size="sm"
              @update:model-value="store.toggleFeatured(study.id)"
            />
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            type="button"
            class="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-themed text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800"
            @click="startEdit(study)"
          >
            <IconBase name="edit" :size="15" />
            {{ t('common.edit') }}
          </button>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-themed text-muted transition hover:text-error-500"
            :aria-label="t('common.remove')"
            @click="remove(study.id)"
          >
            <IconBase name="trash" :size="15" />
          </button>
        </div>
      </div>
    </article>
  </div>

  <ModalBase
    :open="open"
    :title="editing ? t('casesAdmin.editTitle') : t('casesAdmin.newTitle')"
    size="lg"
    @close="open = false"
  >
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('casesAdmin.form.title') }}</span>
        <input v-model="form.title" :class="input" />
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('casesAdmin.form.client') }}</span>
        <input v-model="form.client" :class="input" />
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('casesAdmin.form.year') }}</span>
        <input v-model.number="form.year" type="number" :class="input" />
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('casesAdmin.form.category') }}</span>
        <select v-model="form.category" :class="input">
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ t(`caseCategories.${c}`) }}</option>
        </select>
      </label>
      <label class="space-y-1.5">
        <span class="block text-sm font-medium text-heading">{{ t('casesAdmin.form.tags') }}</span>
        <input v-model="form.tags" placeholder="Marca, Web" :class="input" />
      </label>
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('casesAdmin.form.summary') }}</span>
        <textarea
          v-model="form.summary"
          :rows="2"
          class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2 text-sm text-body"
        />
      </label>
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('casesAdmin.form.challenge') }}</span>
        <textarea
          v-model="form.challenge"
          :rows="3"
          class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3 py-2 text-sm text-body"
        />
      </label>
      <label class="space-y-1.5 sm:col-span-2">
        <span class="block text-sm font-medium text-heading">{{ t('casesAdmin.form.solution') }}</span>
        <textarea
          v-model="form.solution"
          :rows="3"
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
          :disabled="!form.title.trim()"
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
import EmptyState from '@/components/ui/EmptyState.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePortfolioStore } from '@/stores/portfolio'
import { useUiStore } from '@/stores/ui'
import { pfImage } from '@/data/mock'
import type { CaseCategory, CaseStudy } from '@/data/types'

const CATEGORIES: CaseCategory[] = ['branding', 'web', 'app', 'ecommerce', 'campanha']

interface FormState {
  title: string
  client: string
  category: CaseCategory
  year: number
  summary: string
  challenge: string
  solution: string
  tags: string
}

const EMPTY = (): FormState => ({
  title: '',
  client: '',
  category: 'branding',
  year: new Date().getFullYear(),
  summary: '',
  challenge: '',
  solution: '',
  tags: '',
})

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const { t } = useI18n()
usePageTitle(() => t('appNav.cases'))

const store = usePortfolioStore()
const ui = useUiStore()

const open = ref(false)
const editing = ref<CaseStudy | null>(null)
const form = ref<FormState>(EMPTY())

const input = 'h-10 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring'

function startCreate() {
  editing.value = null
  form.value = EMPTY()
  open.value = true
}

function startEdit(study: CaseStudy) {
  editing.value = study
  form.value = {
    title: study.title,
    client: study.client,
    category: study.category,
    year: study.year,
    summary: study.summary,
    challenge: study.challenge,
    solution: study.solution,
    tags: study.tags.join(', '),
  }
  open.value = true
}

function save() {
  const tags = form.value.tags
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (editing.value) {
    store.updateCase(editing.value.id, { ...form.value, tags, slug: slugify(form.value.title) })
    ui.notifySuccess(t('casesAdmin.updated'))
  } else {
    const slug = slugify(form.value.title) || `case-${Date.now()}`
    store.addCase({
      ...form.value,
      slug,
      tags,
      cover: pfImage(slug),
      gallery: [pfImage(`${slug}-1`), pfImage(`${slug}-2`)],
      results: [],
      serviceIds: [],
      featured: false,
      published: false,
    })
    ui.notifySuccess(t('casesAdmin.created'))
  }
  open.value = false
}

function remove(id: number) {
  store.removeCase(id)
  ui.notifySuccess(t('casesAdmin.removed'))
}
</script>
