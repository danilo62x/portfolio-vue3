<template>
  <footer class="border-t border-themed surface-card">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="flex flex-col items-start justify-between gap-8 lg:flex-row">
        <div class="max-w-sm">
          <RouterLink to="/" class="flex items-center gap-2.5">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
              <IconBase name="sparkles" :size="18" />
            </span>
            <span class="text-lg font-bold text-heading">{{ t('brand') }}</span>
          </RouterLink>
          <p class="mt-4 text-sm text-muted">{{ t('landing.footer.tagline') }}</p>
        </div>
        <div class="flex flex-wrap gap-x-10 gap-y-2 text-sm">
          <RouterLink to="/cases" class="text-muted transition hover:text-brand-600">{{ t('nav.cases') }}</RouterLink>
          <RouterLink to="/servicos" class="text-muted transition hover:text-brand-600">{{ t('nav.services') }}</RouterLink>
          <RouterLink to="/orcamento" class="text-muted transition hover:text-brand-600">{{ t('nav.brief') }}</RouterLink>
          <RouterLink to="/sobre" class="text-muted transition hover:text-brand-600">{{ t('nav.about') }}</RouterLink>
          <RouterLink to="/contato" class="text-muted transition hover:text-brand-600">{{ t('nav.contact') }}</RouterLink>
        </div>
      </div>
      <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-themed pt-6 sm:flex-row">
        <p class="text-xs text-muted">© {{ year }} {{ t('brand') }}. {{ t('landing.footer.rights') }}</p>
        <div class="flex items-center gap-3">
          <a
            v-for="icon in ['github', 'slack', 'globe']"
            :key="icon"
            href="#"
            :aria-label="icon"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-themed text-muted transition hover:text-brand-500"
          >
            <IconBase :name="icon" :size="16" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconBase from '@/components/ui/IconBase.vue'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>
