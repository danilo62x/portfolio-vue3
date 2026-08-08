<template>
  <div class="overflow-hidden rounded-2xl border border-themed surface-card shadow-theme-sm">
    <div class="aspect-square overflow-hidden">
      <img :src="member.photo" :alt="member.name" loading="lazy" class="h-full w-full object-cover" />
    </div>
    <div class="p-5">
      <h3 class="text-base font-bold text-heading">{{ member.name }}</h3>
      <p class="text-sm text-brand-600 dark:text-brand-400">{{ member.role }}</p>
      <p class="mt-2 text-sm text-muted">{{ member.bio }}</p>
      <div class="mt-3 flex flex-wrap gap-3">
        <a
          v-for="link in member.links"
          :key="link.label"
          :href="link.url"
          class="text-xs font-medium text-muted transition hover:text-brand-500"
        >
          {{ link.label }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TeamMember } from '@/data/types'

defineProps<{ member: TeamMember }>()
</script>
