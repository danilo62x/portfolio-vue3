<template>
  <div v-if="brief.submitted" class="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
    <span class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50 text-success-600 dark:bg-success-500/15">
      <IconBase name="check-circle" :size="30" />
    </span>
    <h1 class="mt-6 font-bold text-heading text-title-sm">{{ t('brief.doneTitle') }}</h1>
    <p class="mt-3 text-muted">{{ t('brief.doneDesc') }}</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <RouterLink
        to="/cases"
        class="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-medium text-white"
      >
        {{ t('brief.doneCases') }}
      </RouterLink>
      <button
        type="button"
        class="inline-flex h-12 items-center gap-2 rounded-xl border border-themed px-6 text-sm font-medium text-body"
        @click="brief.reset()"
      >
        {{ t('brief.doneAgain') }}
      </button>
    </div>
  </div>

  <div v-else class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
    <header class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-brand-500">{{ t('brief.eyebrow') }}</p>
      <h1 class="mt-2 font-bold text-heading text-title-sm sm:text-title-md">{{ t('brief.title') }}</h1>
      <p class="mt-3 text-muted">{{ t('brief.subtitle') }}</p>
    </header>

    <div class="mt-10">
      <StepIndicator :steps="STEPS" :current="brief.step" clickable @step="brief.setStep($event)" />
    </div>

    <div class="mt-8 rounded-2xl border border-themed surface-card p-6 shadow-theme-sm md:p-8">
      <!-- Etapa 1 — escopo -->
      <div v-if="brief.step === 0">
        <h2 class="text-lg font-bold text-heading">{{ t('brief.scope.title') }}</h2>
        <p class="mt-1 text-sm text-muted">{{ t('brief.scope.desc') }}</p>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            v-for="s in activeServices"
            :key="s.id"
            type="button"
            :class="`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
              brief.draft.scope.includes(s.slug)
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                : 'border-themed hover:bg-gray-50 dark:hover:bg-gray-800'
            }`"
            @click="brief.toggleScope(s.slug)"
          >
            <span
              :class="`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                brief.draft.scope.includes(s.slug) ? 'border-brand-500 bg-brand-500 text-white' : 'border-themed'
              }`"
            >
              <IconBase v-if="brief.draft.scope.includes(s.slug)" name="check" :size="13" :stroke-width="3" />
            </span>
            <span class="min-w-0">
              <span class="block text-sm font-semibold text-heading">{{ s.name }}</span>
              <span class="mt-0.5 block text-xs text-muted">{{ s.summary }}</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Etapa 2 — orçamento e prazo -->
      <div v-else-if="brief.step === 1" class="space-y-8">
        <div>
          <h2 class="text-lg font-bold text-heading">{{ t('brief.budget.title') }}</h2>
          <p class="mt-1 text-sm text-muted">{{ t('brief.budget.desc') }}</p>
          <div class="mt-5 grid gap-3 sm:grid-cols-4">
            <button
              v-for="b in BUDGET_RANGES"
              :key="b"
              type="button"
              :class="`h-12 rounded-xl border text-sm font-medium transition ${
                brief.draft.budget === b
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
              }`"
              @click="brief.patch({ budget: b })"
            >
              {{ b }}
            </button>
          </div>
        </div>
        <div>
          <h2 class="text-lg font-bold text-heading">{{ t('brief.deadline.title') }}</h2>
          <div class="mt-5 flex flex-wrap gap-3">
            <button
              v-for="d in DEADLINE_OPTIONS"
              :key="d"
              type="button"
              :class="`h-11 rounded-xl border px-5 text-sm font-medium transition ${
                brief.draft.deadline === d
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-themed text-body hover:bg-gray-50 dark:hover:bg-gray-800'
              }`"
              @click="brief.patch({ deadline: d })"
            >
              {{ d }}
            </button>
          </div>
        </div>
      </div>

      <!-- Etapa 3 — contato -->
      <div v-else-if="brief.step === 2">
        <h2 class="text-lg font-bold text-heading">{{ t('brief.contact.title') }}</h2>
        <p class="mt-1 text-sm text-muted">{{ t('brief.contact.desc') }}</p>
        <div class="mt-6 grid gap-5 sm:grid-cols-2">
          <label class="space-y-1.5">
            <span class="block text-sm font-medium text-heading">{{ t('contact.form.name') }}</span>
            <input
              :value="brief.draft.name"
              :class="inputClass"
              placeholder="Ana Martins"
              @input="brief.patch({ name: ($event.target as HTMLInputElement).value })"
            />
          </label>
          <label class="space-y-1.5">
            <span class="block text-sm font-medium text-heading">{{ t('contact.form.email') }}</span>
            <input
              type="email"
              :value="brief.draft.email"
              :class="inputClass"
              placeholder="ana@empresa.com"
              @input="brief.patch({ email: ($event.target as HTMLInputElement).value })"
            />
          </label>
          <label class="space-y-1.5">
            <span class="block text-sm font-medium text-heading">{{ t('contact.form.company') }}</span>
            <input
              :value="brief.draft.company"
              :class="inputClass"
              placeholder="Empresa"
              @input="brief.patch({ company: ($event.target as HTMLInputElement).value })"
            />
          </label>
          <label class="space-y-1.5">
            <span class="block text-sm font-medium text-heading">{{ t('contact.form.phone') }}</span>
            <input
              :value="brief.draft.phone"
              :class="inputClass"
              placeholder="(11) 90000-0000"
              @input="brief.patch({ phone: ($event.target as HTMLInputElement).value })"
            />
          </label>
          <label class="space-y-1.5 sm:col-span-2">
            <span class="block text-sm font-medium text-heading">{{ t('brief.contact.details') }}</span>
            <textarea
              :value="brief.draft.message"
              :rows="4"
              class="focus-ring w-full rounded-lg border border-themed bg-transparent px-3.5 py-2.5 text-sm text-body placeholder:text-muted"
              :placeholder="t('brief.contact.detailsPlaceholder')"
              @input="brief.patch({ message: ($event.target as HTMLTextAreaElement).value })"
            />
          </label>
        </div>
      </div>

      <!-- Etapa 4 — revisão -->
      <div v-else-if="brief.step === 3">
        <h2 class="text-lg font-bold text-heading">{{ t('brief.review.title') }}</h2>
        <p class="mt-1 text-sm text-muted">{{ t('brief.review.desc') }}</p>
        <dl class="mt-6 divide-y divide-[color:var(--tx-border)] rounded-xl border border-themed">
          <div class="flex flex-wrap justify-between gap-2 px-4 py-3">
            <dt class="text-sm text-muted">{{ t('brief.review.scope') }}</dt>
            <dd class="text-sm font-medium text-heading">{{ chosen.map((s) => s.name).join(', ') || '—' }}</dd>
          </div>
          <div class="flex flex-wrap justify-between gap-2 px-4 py-3">
            <dt class="text-sm text-muted">{{ t('brief.review.budget') }}</dt>
            <dd class="text-sm font-medium text-heading">{{ brief.draft.budget || '—' }}</dd>
          </div>
          <div class="flex flex-wrap justify-between gap-2 px-4 py-3">
            <dt class="text-sm text-muted">{{ t('brief.review.deadline') }}</dt>
            <dd class="text-sm font-medium text-heading">{{ brief.draft.deadline || '—' }}</dd>
          </div>
          <div class="flex flex-wrap justify-between gap-2 px-4 py-3">
            <dt class="text-sm text-muted">{{ t('brief.review.contact') }}</dt>
            <dd class="text-right text-sm font-medium text-heading">
              {{ brief.draft.name }}
              <span class="block text-xs font-normal text-muted">{{ brief.draft.email }}</span>
            </dd>
          </div>
          <div v-if="brief.draft.message" class="px-4 py-3">
            <dt class="text-sm text-muted">{{ t('brief.contact.details') }}</dt>
            <dd class="mt-1 text-sm text-body">{{ brief.draft.message }}</dd>
          </div>
        </dl>
      </div>

      <!-- Navegação -->
      <div class="mt-8 flex items-center justify-between gap-3 border-t border-themed pt-6">
        <button
          type="button"
          :disabled="brief.step === 0"
          class="inline-flex h-11 items-center gap-2 rounded-xl border border-themed px-5 text-sm font-medium text-body transition hover:bg-gray-50 disabled:opacity-40 dark:hover:bg-gray-800"
          @click="brief.back()"
        >
          <IconBase name="chevron-left" :size="16" />
          {{ t('common.back') }}
        </button>

        <button
          v-if="brief.step < STEPS.length - 1"
          type="button"
          :disabled="!brief.canAdvance(brief.step)"
          class="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-40"
          @click="brief.next()"
        >
          {{ t('common.next') }}
          <IconBase name="chevron-right" :size="16" />
        </button>
        <button
          v-else
          type="button"
          class="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600"
          @click="submit"
        >
          {{ t('brief.submit') }}
          <IconBase name="check" :size="16" :stroke-width="2.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import StepIndicator from '@/components/pf/StepIndicator.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { useBriefStore, STEPS } from '@/stores/brief'
import { usePortfolioStore } from '@/stores/portfolio'
import { useUiStore } from '@/stores/ui'
import { BUDGET_RANGES, DEADLINE_OPTIONS } from '@/data/mock'
import { serviceBySlug } from '@/data/query'

const { t } = useI18n()
usePageTitle(() => t('nav.brief'))

const route = useRoute()
const store = usePortfolioStore()
const brief = useBriefStore()
const ui = useUiStore()

const inputClass =
  'h-11 w-full rounded-lg border border-themed bg-transparent px-3.5 text-sm text-body placeholder:text-muted focus-ring'

const activeServices = computed(() => store.services.filter((s) => s.active))

const chosen = computed(() =>
  brief.draft.scope
    .map((slug) => serviceBySlug(store.services, slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
)

// Pré-seleciona o serviço quando a página é aberta a partir de um card.
onMounted(() => {
  const preset = route.query.servico as string | undefined
  if (preset && !brief.draft.scope.includes(preset) && serviceBySlug(store.services, preset)) {
    brief.toggleScope(preset)
  }
})

function submit() {
  store.addLead({
    name: brief.draft.name,
    email: brief.draft.email,
    company: brief.draft.company,
    phone: brief.draft.phone,
    budget: brief.draft.budget,
    scope: brief.draft.scope,
    deadline: brief.draft.deadline,
    message: brief.draft.message,
    source: 'briefing',
  })
  brief.markSubmitted()
  ui.notifySuccess(t('brief.success'))
}
</script>
