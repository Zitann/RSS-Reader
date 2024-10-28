import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from "vue-router";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/login', component: () => import('./views/LoginRegisterPage.vue') },
    { path: '/home', component: () => import('./views/HomePage.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.mount('#app')