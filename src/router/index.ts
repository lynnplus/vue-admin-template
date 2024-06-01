import MainLayout from '@/layout/MainLayout.vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

export const navRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: MainLayout,
    children: [
      {
        path: '',
        meta: { title: '仪表盘', icon: 'dashboard' },
        component: () => import('@/views/dashboard/DashboardView.vue')
      }
    ]
  },
  {
    path: '/examples',
    component: MainLayout,
    meta: { title: '示例' },
    children: [
      {
        path: 'table',
        meta: { title: '表格' },
        component: () => import('@/views/examples/TableView.vue')
      },
      {
        path: 'flex_grid',
        meta: { title: 'Flex栅格' },
        component: () => import('@/views/examples/FlexGridExample.vue')
      }
    ]
  }
]

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue')
  },
  { path: '/:pathMatch(.*)', component: () => import('@/views/error-page/NotFoundComponent.vue') }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...navRoutes]
})

router.beforeEach((to) => {
  // console.debug(to.path, from.path)
  if (to.name === 'Login') {
    return true
  }

  const user = useUserStore()
  if (!user.validToken()) {
    return { name: 'Login', query: { redirect: encodeURIComponent(to.fullPath) } }
  }
  return true
})

export default router
