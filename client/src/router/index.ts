import { createRouter, createWebHashHistory } from 'vue-router'
import MyActivityView from '@/views/MyActivityView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import FriendsActivityView from '@/views/FriendsActivityView.vue'
import PeopleSearchView from '@/views/PeopleSearchView.vue'
import HpmePageView from '@/views/HomePage.vue'
import AdminView from '@/views/AdminView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
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

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (!to.meta?.public && !auth.isLoggedIn) {
    return next({ name: 'login' })
  }

  if (to.meta?.public && auth.isLoggedIn) {
    return next({ name: 'home' })
  }

  if (to.meta?.requiresAdmin) {
    if (!auth.currentUser || auth.currentUser.role !== 'admin') {
      return next({ name: 'myactivity', query: { error: 'not-admin' } })
    }
  }

  return next()
})

export default router
