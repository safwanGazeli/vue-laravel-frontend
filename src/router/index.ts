import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersView.vue')
    },
    {
      path: '/users/create',
      name: 'users-create',
      component: () => import('@/views/UserCreateView.vue')
    },
    {
      path: '/users/:id/edit',
      name: 'users-edit',
      component: () => import('@/views/UserEditView.vue')
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('@/views/JobsView.vue')
    },
    {
      path: '/jobs/create',
      name: 'jobs-create',
      component: () => import('@/views/JobFormView.vue')
    },
    {
      path: '/jobs/:id/edit',
      name: 'jobs-edit',
      component: () => import('@/views/JobFormView.vue')
    },
    {
      path: '/jobs/:id',
      name: 'jobs-detail',
      component: () => import('@/views/JobDetailView.vue')
    }
  ]
})

export default router 