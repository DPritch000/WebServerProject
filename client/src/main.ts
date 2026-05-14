import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Oruga from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga.css' // Oruga styles
// optional Bulma
import 'bulma/css/bulma.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
const orugaConfig = {
	// example global config: use FontAwesome icons
	iconPack: 'fas'
}

//app.use(Oruga, orugaConfig)

app.mount('#app')
