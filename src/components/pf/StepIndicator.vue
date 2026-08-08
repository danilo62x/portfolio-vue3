<template>
  <ol class="flex w-full items-center">
    <li
      v-for="(labelKey, i) in steps"
      :key="labelKey"
      :class="`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`"
    >
      <button
        type="button"
        :disabled="!isClickable(i)"
        :class="`flex items-center gap-2.5 ${isClickable(i) ? 'cursor-pointer' : 'cursor-default'}`"
        @click="isClickable(i) && emit('step', i)"
      >
        <span
          :class="`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${
            i < current
              ? 'border-brand-500 bg-brand-500 text-white'
              : i === current
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-themed text-muted'
          }`"
        >
          <IconBase v-if="i < current" name="check" :size="16" :stroke-width="2.5" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span
          :class="`hidden text-sm font-medium sm:block ${
            i === current ? 'text-heading' : i < current ? 'text-body' : 'text-muted'
          }`"
        >
          {{ t(labelKey) }}
        </span>
      </button>
      <span
        v-if="i < steps.length - 1"
        :class="`mx-3 h-px flex-1 ${i < current ? 'bg-brand-500' : 'bg-[color:var(--tx-border)]'}`"
      />
    </li>
  </ol>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'

const props = withDefaults(
  defineProps<{
    steps: string[]
    current: number
    /** allow jumping back to a completed step */
    clickable?: boolean
  }>(),
  { clickable: false }
)

const emit = defineEmits<{ step: [index: number] }>()

const { t } = useI18n()

const isClickable = (i: number) => props.clickable && i < props.current
</script>
