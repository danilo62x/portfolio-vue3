import type {
  CaseCategory,
  CaseStudy,
  FunnelRow,
  Lead,
  LeadStage,
  Proposal,
  Service,
  ServiceCategory,
  ServiceRevenue,
  Testimonial,
} from './types'

// ---- Lookups ------------------------------------------------------------

export function serviceById(list: Service[], id: number): Service | undefined {
  return list.find((s) => s.id === id)
}
export function serviceBySlug(list: Service[], slug: string): Service | undefined {
  return list.find((s) => s.slug === slug)
}
export function caseById(list: CaseStudy[], id: number): CaseStudy | undefined {
  return list.find((c) => c.id === id)
}
export function caseBySlug(list: CaseStudy[], slug: string): CaseStudy | undefined {
  return list.find((c) => c.slug === slug)
}
export function leadById(list: Lead[], id: number): Lead | undefined {
  return list.find((l) => l.id === id)
}
export function proposalById(list: Proposal[], id: number): Proposal | undefined {
  return list.find((p) => p.id === id)
}

/** Serviços vinculados a um case, na ordem em que aparecem no case. */
export function servicesOfCase(services: Service[], study: CaseStudy): Service[] {
  return study.serviceIds.map((id) => serviceById(services, id)).filter((s): s is Service => Boolean(s))
}

// ---- Cases: busca, filtro e ordenação -----------------------------------

export interface CaseFilters {
  search?: string
  category?: CaseCategory | 'all'
  serviceId?: number | 'all'
  onlyPublished?: boolean
  onlyFeatured?: boolean
}

export function filterCases(list: CaseStudy[], f: CaseFilters = {}): CaseStudy[] {
  const term = (f.search ?? '').trim().toLowerCase()
  return list.filter((c) => {
    if (f.onlyPublished && !c.published) return false
    if (f.onlyFeatured && !c.featured) return false
    if (f.category && f.category !== 'all' && c.category !== f.category) return false
    if (f.serviceId && f.serviceId !== 'all' && !c.serviceIds.includes(f.serviceId)) return false
    if (!term) return true
    return (
      c.title.toLowerCase().includes(term) ||
      c.client.toLowerCase().includes(term) ||
      c.summary.toLowerCase().includes(term) ||
      c.tags.some((tag) => tag.toLowerCase().includes(term))
    )
  })
}

/** Cases publicados, mais recentes primeiro, destaque na frente. */
export function sortCases(list: CaseStudy[]): CaseStudy[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return b.year - a.year || a.title.localeCompare(b.title)
  })
}

export function featuredCases(list: CaseStudy[], limit = 3): CaseStudy[] {
  return sortCases(list.filter((c) => c.published && c.featured)).slice(0, limit)
}

/** Próximo case publicado depois do atual, voltando ao início no fim da lista. */
export function nextCase(list: CaseStudy[], current: CaseStudy): CaseStudy | undefined {
  const published = sortCases(list.filter((c) => c.published))
  if (published.length < 2) return undefined
  const idx = published.findIndex((c) => c.id === current.id)
  if (idx === -1) return published[0]
  return published[(idx + 1) % published.length]
}

/** Cases relacionados: mesma categoria primeiro, depois serviços em comum. */
export function relatedCases(list: CaseStudy[], current: CaseStudy, limit = 3): CaseStudy[] {
  const others = list.filter((c) => c.published && c.id !== current.id)
  const score = (c: CaseStudy) => {
    let s = 0
    if (c.category === current.category) s += 3
    s += c.serviceIds.filter((id) => current.serviceIds.includes(id)).length
    s += c.tags.filter((tg) => current.tags.includes(tg)).length
    return s
  }
  return [...others].sort((a, b) => score(b) - score(a) || b.year - a.year).slice(0, limit)
}

// ---- Serviços -----------------------------------------------------------

export function servicesByCategory(list: Service[], category: ServiceCategory | 'all'): Service[] {
  if (category === 'all') return list.filter((s) => s.active)
  return list.filter((s) => s.active && s.category === category)
}

export function serviceCategories(list: Service[]): ServiceCategory[] {
  const seen: ServiceCategory[] = []
  for (const s of list) if (!seen.includes(s.category)) seen.push(s.category)
  return seen
}

// ---- Depoimentos --------------------------------------------------------

export function approvedTestimonials(list: Testimonial[]): Testimonial[] {
  return list.filter((t) => t.approved)
}

export function testimonialForCase(list: Testimonial[], caseId: number): Testimonial | undefined {
  return list.find((t) => t.approved && t.caseId === caseId)
}

// ---- Leads --------------------------------------------------------------

export interface LeadFilters {
  search?: string
  stage?: LeadStage | 'all'
  source?: Lead['source'] | 'all'
}

export function filterLeads(list: Lead[], f: LeadFilters = {}): Lead[] {
  const term = (f.search ?? '').trim().toLowerCase()
  return list.filter((l) => {
    if (f.stage && f.stage !== 'all' && l.stage !== f.stage) return false
    if (f.source && f.source !== 'all' && l.source !== f.source) return false
    if (!term) return true
    return (
      l.name.toLowerCase().includes(term) ||
      l.company.toLowerCase().includes(term) ||
      l.email.toLowerCase().includes(term)
    )
  })
}

export const LEAD_STAGES: LeadStage[] = ['novo', 'contato', 'proposta', 'ganho', 'perdido']

/** Contagem e valor estimado por estágio, para o funil do dashboard. */
export function leadFunnel(leads: Lead[], proposals: Proposal[]): FunnelRow[] {
  return LEAD_STAGES.map((stage) => {
    const rows = leads.filter((l) => l.stage === stage)
    const amount = rows.reduce((sum, l) => {
      const p = proposals.find((pr) => pr.leadId === l.id)
      return sum + (p ? proposalTotal(p) : 0)
    }, 0)
    return { stage, count: rows.length, amount }
  })
}

/** Leads criados nos últimos `days` dias. */
export function recentLeads(list: Lead[], limit = 5): Lead[] {
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit)
}

export function leadsThisMonth(list: Lead[]): number {
  const now = new Date()
  return list.filter((l) => {
    const d = new Date(l.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
}

// ---- Propostas ----------------------------------------------------------

export function proposalSubtotal(p: Proposal): number {
  return p.items.reduce((sum, i) => sum + i.qty * i.price, 0)
}

export function proposalDiscountValue(p: Proposal): number {
  return (proposalSubtotal(p) * p.discount) / 100
}

export function proposalTotal(p: Proposal): number {
  return proposalSubtotal(p) - proposalDiscountValue(p)
}

export function openProposals(list: Proposal[]): Proposal[] {
  return list.filter((p) => p.status === 'enviada')
}

export function wonRevenue(list: Proposal[]): number {
  return list.filter((p) => p.status === 'aceita').reduce((sum, p) => sum + proposalTotal(p), 0)
}

/** Aceitas / (aceitas + recusadas), em percentual. */
export function winRate(list: Proposal[]): number {
  const decided = list.filter((p) => p.status === 'aceita' || p.status === 'recusada')
  if (decided.length === 0) return 0
  const won = decided.filter((p) => p.status === 'aceita').length
  return Math.round((won / decided.length) * 100)
}

export function isExpired(p: Proposal): boolean {
  return p.status === 'enviada' && new Date(p.validUntil) < new Date()
}

/** Receita aceita distribuída pelos serviços dos leads correspondentes. */
export function revenueByService(
  proposals: Proposal[],
  leads: Lead[],
  services: Service[]
): ServiceRevenue[] {
  const totals = new Map<number, number>()
  for (const p of proposals) {
    if (p.status !== 'aceita') continue
    const lead = p.leadId ? leadById(leads, p.leadId) : undefined
    const matched = (lead?.scope ?? [])
      .map((slug) => serviceBySlug(services, slug))
      .filter((s): s is Service => Boolean(s))
    const targets = matched.length > 0 ? matched : services.slice(0, 1)
    const share = proposalTotal(p) / targets.length
    for (const s of targets) totals.set(s.id, (totals.get(s.id) ?? 0) + share)
  }
  const grand = [...totals.values()].reduce((a, b) => a + b, 0) || 1
  return [...totals.entries()]
    .map(([serviceId, amount]) => ({
      serviceId,
      name: serviceById(services, serviceId)?.name ?? '—',
      amount,
      share: Math.round((amount / grand) * 100),
    }))
    .sort((a, b) => b.amount - a.amount)
}

// ---- Paginação ----------------------------------------------------------

export function paginate<T>(list: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage
  return list.slice(start, start + perPage)
}

export function pageCount(total: number, perPage: number): number {
  return Math.max(1, Math.ceil(total / perPage))
}
