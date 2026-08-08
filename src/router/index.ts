import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public site (navbar + footer)
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/public/HomeView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/servicos',
      name: 'services',
      component: () => import('@/views/public/ServicesView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/cases',
      name: 'cases',
      component: () => import('@/views/public/CasesView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/cases/:slug',
      name: 'case-detail',
      component: () => import('@/views/public/CaseDetailView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/sobre',
      name: 'about',
      component: () => import('@/views/public/AboutView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/contato',
      name: 'contact',
      component: () => import('@/views/public/ContactView.vue'),
      meta: { layout: 'public' },
    },
    {
      path: '/orcamento',
      name: 'brief',
      component: () => import('@/views/public/BriefView.vue'),
      meta: { layout: 'public' },
    },

    // Auth (blank layout)
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/public/LoginView.vue'),
      meta: { layout: 'blank' },
    },
    {
      path: '/registro',
      name: 'register',
      component: () => import('@/views/public/RegisterView.vue'),
      meta: { layout: 'blank' },
    },

    // App (guarded, sidebar layout)
    {
      path: '/app',
      name: 'dashboard',
      component: () => import('@/views/app/DashboardView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/leads',
      name: 'leads',
      component: () => import('@/views/app/LeadsView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/orcamentos',
      name: 'proposals',
      component: () => import('@/views/app/ProposalsView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/cases',
      name: 'cases-admin',
      component: () => import('@/views/app/CasesAdminView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/servicos',
      name: 'services-admin',
      component: () => import('@/views/app/ServicesAdminView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/depoimentos',
      name: 'testimonials',
      component: () => import('@/views/app/TestimonialsView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },
    {
      path: '/app/configuracoes',
      name: 'settings',
      component: () => import('@/views/app/SettingsView.vue'),
      meta: { layout: 'app', requiresAuth: true },
    },

    // 404 (blank layout)
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/app/NotFoundView.vue'),
      meta: { layout: 'blank' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
