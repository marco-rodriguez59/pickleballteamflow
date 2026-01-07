import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
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
app.use(router)
app.mount('#app')
