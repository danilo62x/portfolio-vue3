import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CASES, LEADS, PROPOSALS, SERVICES, TEAM, TESTIMONIALS } from '@/data/mock'
import type {
  CaseStudy,
  Lead,
  LeadStage,
  Proposal,
  Service,
  TeamMember,
  Testimonial,
} from '@/data/types'

const nextId = (rows: { id: number }[]) => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1)

function nextProposalCode(rows: Proposal[]): string {
  const year = new Date().getFullYear()
  const seq = rows.filter((p) => p.code.includes(String(year))).length + 1
  return `PRO-${year}-${String(seq).padStart(3, '0')}`
}

const seed = () => ({
  services: SERVICES.map((s) => ({ ...s })),
  cases: CASES.map((c) => ({ ...c, gallery: [...c.gallery], results: c.results.map((r) => ({ ...r })) })),
  team: TEAM.map((m) => ({ ...m })),
  testimonials: TESTIMONIALS.map((t) => ({ ...t })),
  leads: LEADS.map((l) => ({ ...l, scope: [...l.scope] })),
  proposals: PROPOSALS.map((p) => ({ ...p, items: p.items.map((i) => ({ ...i })) })),
})

export const usePortfolioStore = defineStore(
  'pf-data',
  () => {
    const initial = seed()

    const services = ref<Service[]>(initial.services)
    const cases = ref<CaseStudy[]>(initial.cases)
    const team = ref<TeamMember[]>(initial.team)
    const testimonials = ref<Testimonial[]>(initial.testimonials)
    const leads = ref<Lead[]>(initial.leads)
    const proposals = ref<Proposal[]>(initial.proposals)

    // ---- Serviços ----
    function addService(data: Omit<Service, 'id'>): Service {
      const service: Service = { ...data, id: nextId(services.value) }
      services.value = [...services.value, service]
      return service
    }
    function updateService(id: number, patch: Partial<Service>) {
      services.value = services.value.map((s) => (s.id === id ? { ...s, ...patch } : s))
    }
    function removeService(id: number) {
      services.value = services.value.filter((s) => s.id !== id)
    }
    function toggleServiceActive(id: number) {
      services.value = services.value.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    }

    // ---- Cases ----
    function addCase(data: Omit<CaseStudy, 'id'>): CaseStudy {
      const study: CaseStudy = { ...data, id: nextId(cases.value) }
      cases.value = [study, ...cases.value]
      return study
    }
    function updateCase(id: number, patch: Partial<CaseStudy>) {
      cases.value = cases.value.map((c) => (c.id === id ? { ...c, ...patch } : c))
    }
    function removeCase(id: number) {
      cases.value = cases.value.filter((c) => c.id !== id)
    }
    function togglePublished(id: number) {
      cases.value = cases.value.map((c) => (c.id === id ? { ...c, published: !c.published } : c))
    }
    function toggleFeatured(id: number) {
      cases.value = cases.value.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    }

    // ---- Depoimentos ----
    function addTestimonial(data: Omit<Testimonial, 'id'>): Testimonial {
      const row: Testimonial = { ...data, id: nextId(testimonials.value) }
      testimonials.value = [...testimonials.value, row]
      return row
    }
    function updateTestimonial(id: number, patch: Partial<Testimonial>) {
      testimonials.value = testimonials.value.map((t) => (t.id === id ? { ...t, ...patch } : t))
    }
    function removeTestimonial(id: number) {
      testimonials.value = testimonials.value.filter((t) => t.id !== id)
    }
    function toggleApproved(id: number) {
      testimonials.value = testimonials.value.map((t) => (t.id === id ? { ...t, approved: !t.approved } : t))
    }

    // ---- Leads ----
    function addLead(data: Omit<Lead, 'id' | 'createdAt' | 'stage'> & { stage?: LeadStage }): Lead {
      const lead: Lead = {
        ...data,
        stage: data.stage ?? 'novo',
        id: nextId(leads.value),
        createdAt: new Date().toISOString(),
      }
      leads.value = [lead, ...leads.value]
      return lead
    }
    function updateLead(id: number, patch: Partial<Lead>) {
      leads.value = leads.value.map((l) => (l.id === id ? { ...l, ...patch } : l))
    }
    function moveLeadStage(id: number, stage: LeadStage) {
      leads.value = leads.value.map((l) => (l.id === id ? { ...l, stage } : l))
    }
    function removeLead(id: number) {
      leads.value = leads.value.filter((l) => l.id !== id)
    }

    // ---- Propostas ----
    function addProposal(data: Omit<Proposal, 'id' | 'code' | 'createdAt'>): Proposal {
      const proposal: Proposal = {
        ...data,
        id: nextId(proposals.value),
        code: nextProposalCode(proposals.value),
        createdAt: new Date().toISOString(),
      }
      proposals.value = [proposal, ...proposals.value]
      return proposal
    }
    function updateProposal(id: number, patch: Partial<Proposal>) {
      proposals.value = proposals.value.map((p) => (p.id === id ? { ...p, ...patch } : p))
    }
    function removeProposal(id: number) {
      proposals.value = proposals.value.filter((p) => p.id !== id)
    }

    function reset() {
      const fresh = seed()
      services.value = fresh.services
      cases.value = fresh.cases
      team.value = fresh.team
      testimonials.value = fresh.testimonials
      leads.value = fresh.leads
      proposals.value = fresh.proposals
    }

    return {
      services,
      cases,
      team,
      testimonials,
      leads,
      proposals,
      addService,
      updateService,
      removeService,
      toggleServiceActive,
      addCase,
      updateCase,
      removeCase,
      togglePublished,
      toggleFeatured,
      addTestimonial,
      updateTestimonial,
      removeTestimonial,
      toggleApproved,
      addLead,
      updateLead,
      moveLeadStage,
      removeLead,
      addProposal,
      updateProposal,
      removeProposal,
      reset,
    }
  },
  {
    persist: {
      key: 'pf-data',
      pick: ['services', 'cases', 'team', 'testimonials', 'leads', 'proposals'],
    },
  }
)
