<template>
  <div class="divide-y divide-[color:var(--tx-border)] overflow-hidden rounded-2xl border border-themed surface-card">
    <div v-for="faq in FAQS" :key="faq.id">
      <button
        type="button"
        :aria-expanded="open === faq.id"
        class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
        @click="open = open === faq.id ? null : faq.id"
      >
        <span class="text-sm font-semibold text-heading md:text-base">{{ t(faq.questionKey) }}</span>
        <IconBase
          name="chevron-down"
          :size="18"
          :class-name="`shrink-0 text-muted transition ${open === faq.id ? 'rotate-180' : ''}`"
        />
      </button>
      <p v-if="open === faq.id" class="px-5 pb-5 text-sm leading-relaxed text-muted md:px-6">{{ t(faq.answerKey) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import { FAQS } from '@/data/mock'

const { t } = useI18n()
const open = ref<number | null>(FAQS[0]?.id ?? null)
</script>
