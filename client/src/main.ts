import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { vInfiniteScroll } from '@vueuse/components'
// optional Bulma
import 'bulma/css/bulma.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// register vueuse infinite-scroll directive globally
app.directive('infinite-scroll', vInfiniteScroll)
// Oruga removed

app.mount('#app')
