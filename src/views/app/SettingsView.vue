<template>
  <PageHeader
    :title="t('settings.title')"
    :subtitle="t('settings.subtitle')"
    :crumbs="[{ label: t('appNav.dashboard'), href: '/app', icon: 'dashboard' }, { label: t('settings.title') }]"
  />
  <div class="surface-card rounded-2xl border p-5 md:p-6">
    <Tabs v-model="tab" :tabs="tabs">
      <template #default="{ index }">
        <!-- Perfil -->
        <form v-if="index === 0" class="max-w-lg space-y-4" @submit.prevent="saveProfile">
          <h3 class="font-semibold text-heading">{{ t('settings.profile.title') }}</h3>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.profile.name') }}</label>
            <input v-model="name" :class="input" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.profile.email') }}</label>
            <input v-model="email" type="email" :class="input" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.profile.role') }}</label>
            <input :value="auth.user?.role ?? ''" disabled :class="`${input} opacity-60`" />
          </div>
          <button
            type="submit"
            class="h-11 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {{ t('common.save') }}
          </button>
        </form>

        <!-- Estúdio -->
        <form v-else-if="index === 1" class="max-w-lg space-y-4" @submit.prevent="saveStudio">
          <h3 class="font-semibold text-heading">{{ t('settings.studio.title') }}</h3>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.studio.name') }}</label>
            <input v-model="studio" :class="input" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.studio.cnpj') }}</label>
              <input v-model="cnpj" :class="input" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.studio.phone') }}</label>
              <input v-model="phone" :class="input" />
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-heading">{{ t('settings.studio.address') }}</label>
            <input v-model="address" :class="input" />
          </div>
          <button
            type="submit"
            class="h-11 rounded-lg bg-brand-500 px-5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            {{ t('common.save') }}
          </button>
        </form>

        <!-- Notificações -->
        <div v-else class="max-w-lg space-y-1">
          <h3 class="mb-4 font-semibold text-heading">{{ t('settings.notifications.title') }}</h3>
          <div
            v-for="key in NOTIF_KEYS"
            :key="key"
            class="flex items-center justify-between border-b border-themed py-4 last:border-0"
          >
            <div class="pr-4">
              <p class="text-sm font-medium text-heading">{{ t(`settings.notifications.${key}`) }}</p>
              <p class="text-xs text-muted">{{ t(`settings.notifications.${key}Desc`) }}</p>
            </div>
            <SwitchToggle
              :model-value="notifs[key]"
              size="sm"
              @update:model-value="setNotif(key, $event)"
            />
          </div>
        </div>
      </template>
    </Tabs>
  </div>
  <p class="mt-4 inline-flex items-center gap-2 text-xs text-muted">
    <IconBase name="info" :size="14" /> {{ t('auth.demoHint') }}
  </p>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageTitle } from '@/composables/usePageTitle'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import PageHeader from '@/components/app/PageHeader.vue'
import Tabs from '@/components/ui/Tabs.vue'
import SwitchToggle from '@/components/ui/SwitchToggle.vue'
import IconBase from '@/components/ui/IconBase.vue'

const NOTIF_KEYS = ['newLead', 'proposalAccepted', 'weeklySummary'] as const
type NotifKey = (typeof NOTIF_KEYS)[number]

const { t } = useI18n()
usePageTitle(() => t('settings.title'))

const auth = useAuthStore()
const ui = useUiStore()

const tab = ref(0)
const name = ref(auth.user?.name ?? '')
const email = ref(auth.user?.email ?? '')
const studio = ref(auth.user?.studio ?? 'Estúdio Norte')
const cnpj = ref('12.345.678/0001-90')
const phone = ref('+55 11 4000-1234')
const address = ref('Rua das Flores, 123 — Centro, São Paulo')
const notifs = ref<Record<NotifKey, boolean>>({ newLead: true, proposalAccepted: true, weeklySummary: false })

const input = 'h-11 w-full rounded-lg border border-themed bg-transparent px-3.5 text-sm text-body focus-ring'

const tabs = computed(() => [
  { label: t('settings.tabs.profile'), icon: 'user' },
  { label: t('settings.tabs.studio'), icon: 'sparkles' },
  { label: t('settings.tabs.notifications'), icon: 'bell' },
])

function saveProfile() {
  auth.updateProfile({ name: name.value, email: email.value })
  ui.notifySuccess(t('settings.profile.saved'))
}
function saveStudio() {
  auth.updateProfile({ studio: studio.value })
  ui.notifySuccess(t('settings.studio.saved'))
}
function setNotif(key: NotifKey, value: boolean) {
  notifs.value = { ...notifs.value, [key]: value }
  ui.notifySuccess(t('settings.saved'))
}
</script>
