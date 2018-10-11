import Vue from 'vue'
import Router from 'vue-router'
import index from './../pages/index.vue'
import login from './../pages/login.vue'
import mine from './../pages/mine.vue'
import record from './../pages/record.vue'

let r = [
  { path: '/', redirect: '/index' },
  { path: '/index', component: index },
  { path: '/login', component: login },
  { path: '/mine', component: mine },
  { path: '/record', component: record },
]

Vue.use(Router);

let washRouter = new Router({mode:'history', routes: r });

export default washRouter
