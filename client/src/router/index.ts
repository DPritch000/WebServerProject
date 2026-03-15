import { createRouter, createWebHistory } from 'vue-router'
import MyActivityView from '@/views/MyActivityView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import FriendsActivityView from '@/views/FriendsActivityView.vue'
import PeopleSearchView from '@/views/PeopleSearchView.vue'
import HpmePageView from '@/views/HomePage.vue'
import AdminView from '@/views/AdminView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [


    {
      path: '/',
      name: 'home',
      component: HpmePageView,
    },
    {
      path: '/myactivity',
      name: 'myactivity',
      component: MyActivityView,
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
    },
    {
      path: '/friendsactivity',
      name: 'friendsactivity',
      component: FriendsActivityView,
    },
    {
      path: '/peoplesearch',
      name: 'peoplesearch',
      component: PeopleSearchView,
    },
    {
      path: '/adminview',
      name: 'adminview',
      component: AdminView,
      meta: { requiresAdmin: true },
    }
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
    if (to.meta?.requiresAdmin) {
    const current = auth.currentUser
    if (!current || current.role !== 'admin') {
      return next({ name: 'myactivity', query: { error: 'not-admin' } })
    }
  }
  return next()
})

export default router
