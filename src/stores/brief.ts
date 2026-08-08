import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface BriefDraft {
  scope: string[]
  budget: string
  deadline: string
  name: string
  email: string
  company: string
  phone: string
  message: string
}

const EMPTY = (): BriefDraft => ({
  scope: [],
  budget: '',
  deadline: '',
  name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
})

export const STEPS = ['brief.steps.scope', 'brief.steps.budget', 'brief.steps.contact', 'brief.steps.review']

export const useBriefStore = defineStore(
  'pf-brief',
  () => {
    const step = ref(0)
    const draft = ref<BriefDraft>(EMPTY())
    const submitted = ref(false)

    function setStep(s: number) {
      step.value = Math.max(0, Math.min(STEPS.length - 1, s))
    }
    function next() {
      setStep(step.value + 1)
    }
    function back() {
      setStep(step.value - 1)
    }
    function patch(p: Partial<BriefDraft>) {
      draft.value = { ...draft.value, ...p }
    }
    function toggleScope(slug: string) {
      const scope = draft.value.scope
      draft.value = {
        ...draft.value,
        scope: scope.includes(slug) ? scope.filter((s) => s !== slug) : [...scope, slug],
      }
    }
    function markSubmitted() {
      submitted.value = true
    }
    function reset() {
      step.value = 0
      draft.value = EMPTY()
      submitted.value = false
    }
    /** Etapa preenchida o bastante para avançar. */
    function canAdvance(s: number): boolean {
      const d = draft.value
      if (s === 0) return d.scope.length > 0
      if (s === 1) return Boolean(d.budget && d.deadline)
      if (s === 2) return Boolean(d.name.trim() && /.+@.+\..+/.test(d.email))
      return true
    }

    return { step, draft, submitted, setStep, next, back, patch, toggleScope, markSubmitted, reset, canAdvance }
  },
  {
    persist: { key: 'pf-brief' },
  }
)
