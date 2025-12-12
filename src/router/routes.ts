import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/Home.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'catch-all',
    component: () => import('@/views/home/Home.vue')
  }
]

export { routes }
