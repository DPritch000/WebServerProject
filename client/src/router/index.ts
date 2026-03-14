import { createRouter, createWebHistory } from 'vue-router'
import MyActivityView from '@/views/MyActivityView.vue'
import StatisticsView from '@/views/StatisticsView.vue'
import FriendsActivityView from '@/views/FriendsActivityView.vue'
import PeopleSearchView from '@/views/PeopleSearchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
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
    }
  ],
})

export default router
