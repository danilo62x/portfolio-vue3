// ===== Portfólio & Agência — domínio =====

export type ServiceCategory = 'branding' | 'web' | 'produto' | 'marketing' | 'motion'

export interface Service {
  id: number
  slug: string
  name: string
  category: ServiceCategory
  /** Uma linha, usada nos cards. */
  summary: string
  description: string
  deliverables: string[]
  priceFrom: number
  /** Prazo típico, em semanas. */
  weeks: number
  icon: string
  active: boolean
}

export type CaseCategory = 'branding' | 'web' | 'app' | 'ecommerce' | 'campanha'

export interface CaseResult {
  label: string
  value: string
}

export interface CaseStudy {
  id: number
  slug: string
  title: string
  client: string
  category: CaseCategory
  year: number
  cover: string
  gallery: string[]
  summary: string
  challenge: string
  solution: string
  results: CaseResult[]
  serviceIds: number[]
  tags: string[]
  featured: boolean
  published: boolean
}

export interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  photo: string
  links: { label: string; url: string }[]
}

export interface Testimonial {
  id: number
  author: string
  role: string
  company: string
  avatar: string
  quote: string
  rating: number
  caseId: number | null
  approved: boolean
}

export type LeadSource = 'site' | 'briefing' | 'indicacao' | 'social'
export type LeadStage = 'novo' | 'contato' | 'proposta' | 'ganho' | 'perdido'

export interface Lead {
  id: number
  name: string
  email: string
  company: string
  phone: string
  /** Faixa de investimento escolhida no briefing. */
  budget: string
  /** Slugs de serviço marcados no briefing. */
  scope: string[]
  deadline: string
  message: string
  source: LeadSource
  stage: LeadStage
  createdAt: string
}

export interface ProposalItem {
  description: string
  qty: number
  price: number
}

export type ProposalStatus = 'rascunho' | 'enviada' | 'aceita' | 'recusada'

export interface Proposal {
  id: number
  code: string
  leadId: number | null
  client: string
  title: string
  items: ProposalItem[]
  /** Percentual de desconto (0-100). */
  discount: number
  status: ProposalStatus
  validUntil: string
  createdAt: string
}

export interface ProcessStep {
  step: number
  titleKey: string
  descKey: string
  icon: string
}

export interface Faq {
  id: number
  questionKey: string
  answerKey: string
}

export interface SeriesPoint {
  label: string
  value: number
}

export interface FunnelRow {
  stage: LeadStage
  count: number
  amount: number
}

export interface ServiceRevenue {
  serviceId: number
  name: string
  amount: number
  share: number
}
