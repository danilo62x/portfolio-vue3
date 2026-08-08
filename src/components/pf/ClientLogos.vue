<template>
  <div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-themed bg-[color:var(--tx-border)] sm:grid-cols-4">
    <div
      v-for="name in CLIENTS"
      :key="name"
      class="flex h-20 items-center justify-center surface-card px-4 text-base font-semibold uppercase tracking-[0.2em] text-muted transition hover:text-heading"
    >
      {{ name }}
    </div>
  </div>
</template>

<script setup lang="ts">
/** Faixa de "logos" desenhada em texto, sem depender de arquivos externos. */
import { CLIENTS } from '@/data/mock'
</script>
