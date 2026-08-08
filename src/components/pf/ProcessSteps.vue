<template>
  <ol class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
    <li v-for="(step, i) in PROCESS" :key="step.step" class="relative">
      <span
        v-if="i < PROCESS.length - 1"
        class="absolute left-6 top-12 hidden h-px w-full bg-[color:var(--tx-border)] lg:block"
      />
      <div class="relative flex h-12 w-12 items-center justify-center rounded-xl border border-themed surface-card text-brand-500">
        <IconBase :name="step.icon" :size="22" />
      </div>
      <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-500">
        {{ String(step.step).padStart(2, '0') }}
      </p>
      <h3 class="mt-1 text-base font-bold text-heading">{{ t(step.titleKey) }}</h3>
      <p class="mt-1.5 text-sm text-muted">{{ t(step.descKey) }}</p>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import { PROCESS } from '@/data/mock'

const { t } = useI18n()
</script>
