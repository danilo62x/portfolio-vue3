<template>
  <div class="space-y-4">
    <div class="overflow-x-auto rounded-xl border border-themed">
      <table class="w-full min-w-[520px] text-sm">
        <thead>
          <tr class="border-b border-themed text-left text-xs uppercase tracking-wider text-muted">
            <th class="px-4 py-3 font-medium">{{ t('proposals.item') }}</th>
            <th class="w-20 px-4 py-3 font-medium">{{ t('proposals.qty') }}</th>
            <th class="w-36 px-4 py-3 font-medium">{{ t('proposals.unitPrice') }}</th>
            <th class="w-32 px-4 py-3 text-right font-medium">{{ t('proposals.lineTotal') }}</th>
            <th v-if="!readOnly" class="w-12 px-2 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-[color:var(--tx-border)]">
          <tr v-for="(item, index) in items" :key="index">
            <td class="px-4 py-2">
              <span v-if="readOnly" class="text-body">{{ item.description }}</span>
              <input
                v-else
                :value="item.description"
                class="h-9 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring"
                @input="patch(index, { description: ($event.target as HTMLInputElement).value })"
              />
            </td>
            <td class="px-4 py-2">
              <span v-if="readOnly" class="text-body">{{ item.qty }}</span>
              <input
                v-else
                type="number"
                :min="1"
                :value="item.qty"
                class="h-9 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring"
                @input="patch(index, { qty: Math.max(1, Number(($event.target as HTMLInputElement).value) || 1) })"
              />
            </td>
            <td class="px-4 py-2">
              <span v-if="readOnly" class="text-body">{{ formatCurrency(item.price, locale) }}</span>
              <input
                v-else
                type="number"
                :min="0"
                :step="100"
                :value="item.price"
                class="h-9 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring"
                @input="patch(index, { price: Math.max(0, Number(($event.target as HTMLInputElement).value) || 0) })"
              />
            </td>
            <td class="px-4 py-2 text-right font-medium text-heading">
              {{ formatCurrency(item.qty * item.price, locale) }}
            </td>
            <td v-if="!readOnly" class="px-2 py-2">
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:text-error-500"
                :aria-label="t('common.remove')"
                @click="emit('change', items.filter((_, i) => i !== index))"
              >
                <IconBase name="trash" :size="16" />
              </button>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td :colspan="readOnly ? 4 : 5" class="px-4 py-6 text-center text-sm text-muted">
              {{ t('proposals.noItems') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button
      v-if="!readOnly"
      type="button"
      class="inline-flex h-9 items-center gap-2 rounded-lg border border-themed px-3 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800"
      @click="emit('change', [...items, { description: '', qty: 1, price: 0 }])"
    >
      <IconBase name="plus" :size="16" />
      {{ t('proposals.addItem') }}
    </button>

    <div class="ml-auto w-full max-w-xs space-y-2 rounded-xl border border-themed p-4 text-sm">
      <div class="flex justify-between text-muted">
        <span>{{ t('proposals.subtotal') }}</span>
        <span>{{ formatCurrency(subtotal, locale) }}</span>
      </div>
      <div class="flex items-center justify-between gap-3 text-muted">
        <span>{{ t('proposals.discount') }}</span>
        <span v-if="readOnly">{{ discount }}%</span>
        <input
          v-else
          type="number"
          :min="0"
          :max="100"
          :value="discount"
          class="h-8 w-20 rounded-lg border border-themed bg-transparent px-2 text-right text-sm text-body focus-ring"
          @input="
            emit(
              'discountChange',
              Math.min(100, Math.max(0, Number(($event.target as HTMLInputElement).value) || 0))
            )
          "
        />
      </div>
      <div class="flex justify-between border-t border-themed pt-2 text-base font-bold text-heading">
        <span>{{ t('proposals.total') }}</span>
        <span>{{ formatCurrency(total, locale) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'
import { formatCurrency } from '@/lib/format'
import type { ProposalItem } from '@/data/types'

const props = withDefaults(
  defineProps<{
    items: ProposalItem[]
    discount: number
    readOnly?: boolean
  }>(),
  { readOnly: false }
)

const emit = defineEmits<{
  change: [items: ProposalItem[]]
  discountChange: [discount: number]
}>()

const { t, locale } = useI18n()

const subtotal = computed(() => props.items.reduce((sum, i) => sum + i.qty * i.price, 0))
const discountValue = computed(() => (subtotal.value * props.discount) / 100)
const total = computed(() => subtotal.value - discountValue.value)

function patch(index: number, next: Partial<ProposalItem>) {
  emit(
    'change',
    props.items.map((item, i) => (i === index ? { ...item, ...next } : item))
  )
}
</script>
