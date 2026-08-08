<template>
  <figure class="flex h-full flex-col rounded-2xl border border-themed surface-card p-6 shadow-theme-sm">
    <div class="flex gap-0.5">
      <IconBase
        v-for="i in 5"
        :key="i"
        name="star"
        :size="16"
        :class-name="i - 1 < item.rating ? 'text-warning-500' : 'text-gray-300 dark:text-gray-700'"
      />
    </div>
    <blockquote class="mt-4 flex-1 text-sm leading-relaxed text-body">“{{ item.quote }}”</blockquote>
    <figcaption class="mt-5 flex items-center gap-3 border-t border-themed pt-4">
      <img :src="item.avatar" :alt="item.author" loading="lazy" class="h-10 w-10 rounded-full object-cover" />
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-heading">{{ item.author }}</p>
        <p class="truncate text-xs text-muted">{{ item.role }} · {{ item.company }}</p>
      </div>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import IconBase from '@/components/ui/IconBase.vue'
import type { Testimonial } from '@/data/types'

defineProps<{ item: Testimonial }>()
</script>
