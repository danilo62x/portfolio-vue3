<template>
  <header class="surface-header sticky top-0 z-30 flex w-full border-b">
    <div class="flex flex-grow items-center justify-between gap-4 px-4 py-3 md:px-6 2xl:px-10">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-themed text-muted hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-label="Toggle sidebar"
          @click="onToggleSidebar"
        >
          <IconBase name="menu" :size="20" />
        </button>

        <RouterLink
          to="/app/leads"
          class="hidden h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 sm:flex"
        >
          <IconBase name="calendar" :size="18" />
          {{ t('appNav.leads') }}
        </RouterLink>
      </div>

      <div class="flex items-center gap-2">
        <LanguageSwitcher />
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-themed text-muted hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-label="Toggle dark mode"
          @click="ui.toggleDarkMode()"
        >
          <IconBase :name="ui.darkMode ? 'sun' : 'moon'" :size="18" />
        </button>

        <div ref="notifRef" class="relative">
          <button
            type="button"
            class="relative flex h-10 w-10 items-center justify-center rounded-full border border-themed text-muted hover:bg-gray-50 dark:hover:bg-gray-800"
            aria-label="Notifications"
            @click="notifOpen = !notifOpen"
          >
            <IconBase name="bell" :size="18" />
            <span class="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-error-400 opacity-75" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-error-500" />
            </span>
          </button>
          <div v-if="notifOpen" class="surface-card absolute right-0 mt-3 w-80 rounded-xl border shadow-theme-lg">
            <div class="flex items-center justify-between border-b border-themed px-4 py-3">
              <p class="text-sm font-semibold text-heading">{{ t('appNav.notifications') }}</p>
            </div>
            <ul class="max-h-72 divide-y divide-themed overflow-y-auto">
              <li
                v-for="n in NOTIFICATIONS"
                :key="n.id"
                class="flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span :class="`mt-1 flex h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-gray-300' : 'bg-brand-500'}`" />
                <div class="flex-1">
                  <p class="text-sm font-medium text-heading">{{ t(`notifications.${n.key}`, { name: n.name }) }}</p>
                  <p class="text-xs text-muted">{{ n.time }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div ref="dropdownRef" class="relative">
          <button type="button" class="ml-1 flex items-center gap-3" @click="dropdownOpen = !dropdownOpen">
            <span class="hidden text-right lg:block">
              <span class="block text-sm font-medium text-heading">{{ auth.user?.name || 'Convidado' }}</span>
              <span class="block text-xs text-muted">{{ auth.user?.role || '—' }}</span>
            </span>
            <span class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-semibold text-white">
              {{ initials }}
            </span>
            <IconBase name="chevron-down" :size="16" class-name="text-muted" />
          </button>

          <div v-if="dropdownOpen" class="surface-card absolute right-0 mt-3 w-56 rounded-xl border shadow-theme-lg">
            <div class="border-b border-themed px-4 py-3">
              <p class="text-sm font-medium text-heading">{{ auth.user?.name || 'Convidado' }}</p>
              <p class="text-xs text-muted">{{ auth.user?.email || '' }}</p>
            </div>
            <ul class="py-1">
              <li>
                <RouterLink
                  to="/app/configuracoes"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-body hover:bg-gray-50 dark:hover:bg-gray-800"
                  @click="dropdownOpen = false"
                >
                  <IconBase name="settings" :size="16" /> {{ t('appNav.settings') }}
                </RouterLink>
              </li>
            </ul>
            <div class="border-t border-themed py-1">
              <button
                type="button"
                class="flex w-full items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10"
                @click="handleLogout"
              >
                <IconBase name="logout" :size="16" /> {{ t('appNav.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import IconBase from '@/components/ui/IconBase.vue'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vue'

const NOTIFICATIONS = [
  { id: 1, key: 'newLead', name: 'Lume Cosméticos', time: 'Há 5 min', read: false },
  { id: 2, key: 'proposalAccepted', name: 'PRO-2026-011', time: 'Há 18 min', read: false },
  { id: 3, key: 'casePublished', name: 'Rebranding Norte', time: 'Há 2 horas', read: true },
]

const { t } = useI18n()
const router = useRouter()
const ui = useUiStore()
const auth = useAuthStore()

const dropdownOpen = ref(false)
const notifOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const notifRef = ref<HTMLElement | null>(null)

const initials = computed(() => {
  if (!auth.user) return '?'
  return auth.user.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
})

function onToggleSidebar() {
  if (window.innerWidth < 1024) ui.toggleSidebarMobile()
  else ui.toggleSidebar()
}

function handleLogout() {
  auth.logout()
  router.push('/login')
  dropdownOpen.value = false
}

function onClick(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) dropdownOpen.value = false
  if (notifRef.value && !notifRef.value.contains(e.target as Node)) notifOpen.value = false
}

onMounted(() => document.addEventListener('click', onClick))
onUnmounted(() => document.removeEventListener('click', onClick))
</script>
