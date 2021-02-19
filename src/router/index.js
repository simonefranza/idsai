import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/rules',
    name: 'Rules',
    component: () => import(/* webpackChunkName: "rules" */ '../views/Rules.vue')
  },
  {
    path: '/info-ret',
    name: 'InfoRet',
    component: () => import(/* webpackChunkName: "info-ret" */ '../views/InfoRet.vue')
  },
  {
    path: '/rec-sys',
    name: 'Recommender System',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "rec-sys" */ '../views/Recommender.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
