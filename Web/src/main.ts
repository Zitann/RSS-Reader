import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: '/login', component: () => import('./assets/views/LoginRegisterPage.vue') },
    { path: '/home', component: () => import('./assets/views/HomePage.vue') },
]

const router = createRouter({
    history : createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')