import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/rules',
    name: 'Rules',
    component: () => import(/* webpackChunkName: "rules" */ '../views/RBS.vue')
  },
  {
    path: '/info-ret',
    name: 'InfoRet',
    component: () => import(/* webpackChunkName: "info-ret" */ '../views/InfoRet.vue')
  },
  {
    path: '/rec-sys',
    name: 'Recommender System',
    component: () => import(/* webpackChunkName: "rec-sys" */ '../views/Recommender.vue')
  },
  {
    path: '/graphs',
    name: 'Graphs',
    component: () => import(/* webpackChunkName: "word-net" */ '../views/Graph.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
