import Vue from 'vue'
import VueRouter from 'vue-router'
// import api from "@/api/api";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../components/Dashboard/Dashboard.vue')
  },
  {
    path: '/all-startups',
    name: 'StartupsAll',
    component: () => import('../components/Startup/AllStartups')
  },
  {
    path: '/startups',
    name: 'Startups',
    component: () => import('../components/Startup/Startup')
  },
  {
    path: '/startups/:id',
    name: 'StartupShow',
    component: () => import('../components/Startup/Show')
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('../components/Course/Courses')
  },
  {
    path: '/courses/:id/lessons',
    name: 'Lessons',
    component: () => import('../components/Lessons/Lessons')
  },
  {
    path: '/lessons/:id/tests',
    name: 'Tests',
    component: () => import('../components/Tests/Tests')
  },
  {
    path: '/tests/:id/questions',
    name: 'Questions',
    component: () => import('../components/Questions/Questions')
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
