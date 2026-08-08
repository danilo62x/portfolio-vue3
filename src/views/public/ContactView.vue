<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
    <header class="max-w-2xl">
      <p class="text-sm font-semibold uppercase tracking-wider text-brand-500">{{ t('contact.eyebrow') }}</p>
      <h1 class="mt-2 font-bold text-heading text-title-sm sm:text-title-md">{{ t('contact.title') }}</h1>
      <p class="mt-3 text-muted">{{ t('contact.subtitle') }}</p>
    </header>

    <div class="mt-10 grid gap-8 lg:grid-cols-5">
      <div class="lg:col-span-3">
        <div class="rounded-2xl border border-themed surface-card p-6 shadow-theme-sm md:p-8">
          <form class="space-y-5" @submit="onSubmit">
            <div class="grid gap-5 sm:grid-cols-2">
              <FormField name="name" :label="t('contact.form.name')" placeholder="Ana Martins" />
              <FormField name="email" :label="t('contact.form.email')" type="email" placeholder="ana@empresa.com" />
            </div>
            <div class="grid gap-5 sm:grid-cols-2">
              <FormField name="company" :label="t('contact.form.company')" placeholder="Empresa" />
              <FormField name="phone" :label="t('contact.form.phone')" placeholder="(11) 90000-0000" />
            </div>
            <FormField name="service" :label="t('contact.form.service')" as="select">
              <option value="">{{ t('contact.form.servicePlaceholder') }}</option>
              <option v-for="s in activeServices" :key="s.id" :value="s.slug">{{ s.name }}</option>
            </FormField>
            <FormField
              name="message"
              :label="t('contact.form.message')"
              as="textarea"
              :rows="5"
              :placeholder="t('contact.form.messagePlaceholder')"
            />
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
            >
              {{ t('contact.form.submit') }}
              <IconBase name="arrow-right" :size="18" />
            </button>
          </form>
        </div>
      </div>

      <aside class="space-y-4 lg:col-span-2">
        <div v-for="c in CHANNELS" :key="c.labelKey" class="flex gap-4 rounded-2xl border border-themed surface-card p-5">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">
            <IconBase :name="c.icon" :size="20" />
          </span>
          <div class="min-w-0">
            <p class="text-xs uppercase tracking-wider text-muted">{{ t(c.labelKey) }}</p>
            <p class="mt-1 text-sm font-medium text-heading">{{ c.value }}</p>
          </div>
        </div>

        <div class="overflow-hidden rounded-2xl border border-themed">
          <div class="flex h-48 items-center justify-center bg-gray-100 text-muted dark:bg-gray-800">
            <div class="text-center">
              <IconBase name="map-pin" :size="28" class-name="mx-auto" />
              <p class="mt-2 text-xs">{{ t('contact.mapPlaceholder') }}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as Yup from 'yup'
import IconBase from '@/components/ui/IconBase.vue'
import FormField from '@/components/ui/FormField.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { useUiStore } from '@/stores/ui'
import { usePortfolioStore } from '@/stores/portfolio'

const CHANNELS = [
  { icon: 'mail', labelKey: 'contact.channels.email', value: 'oi@estudionorte.com' },
  { icon: 'phone', labelKey: 'contact.channels.phone', value: '+55 11 4002-8922' },
  { icon: 'map-pin', labelKey: 'contact.channels.address', value: 'Rua Aurora, 340 — São Paulo, SP' },
  { icon: 'clock', labelKey: 'contact.channels.hours', value: 'Seg a sex, 9h às 18h' },
]

const { t } = useI18n()
usePageTitle(() => t('nav.contact'))

const ui = useUiStore()
const store = usePortfolioStore()

const activeServices = computed(() => store.services.filter((s) => s.active))

const schema = computed(() =>
  toTypedSchema(
    Yup.object({
      name: Yup.string().required(t('validation.required')),
      email: Yup.string().email(t('validation.email')).required(t('validation.required')),
      company: Yup.string(),
      phone: Yup.string(),
      service: Yup.string(),
      message: Yup.string().min(10, t('validation.min', { count: 10 })).required(t('validation.required')),
    })
  )
)

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { name: '', email: '', company: '', phone: '', service: '', message: '' },
})

const onSubmit = handleSubmit((values) => {
  store.addLead({
    name: values.name,
    email: values.email,
    company: values.company ?? '',
    phone: values.phone ?? '',
    budget: '',
    scope: values.service ? [values.service] : [],
    deadline: '',
    message: values.message,
    source: 'site',
  })
  ui.notifySuccess(t('contact.success'))
  resetForm()
})
</script>
