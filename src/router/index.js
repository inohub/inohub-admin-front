import Vue from 'vue'
import VueRouter from 'vue-router'
// import api from "@/api/api";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../components/Dashboard/Dashboard.vue')
  },
  {
    path: '/startups',
    name: 'Startups',
    component: () => import(/* webpackChunkName: "dashboard" */ '../components/Startup/Startup')
  },
  {
    path: '/startups/:id',
    name: 'StartupShow',
    component: () => import(/* webpackChunkName: "dashboard" */ '../components/Startup/Show')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Auth/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// eslint-disable-next-line no-unused-vars
// router.beforeEach(async(to,from,next) => {
//   if (to.name !== 'Login') {
//     try {
//       await api.get("/auth/me")
//       next()
//     } catch (err) {
//       if (err.response.status === 401) {
//         localStorage.removeItem('user-token')
//         window.location = "/login"
//       }
//     }
//   }
// })

export default router
