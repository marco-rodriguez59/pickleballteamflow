import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { IonicVue } from '@ionic/vue'

import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

import App from './App.vue'
import Home from './components/Home.vue'
import About from './components/About.vue'

// Routes
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

// Router
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Create and mount app
const app = createApp(App)

app.use(IonicVue)
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
