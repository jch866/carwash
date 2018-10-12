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

let washRouter = new Router({ mode: 'history', routes: r });
washRouter.beforeEach(function(to, from, next){
  //console.log(to)
  //console.log(from)
  next()
})

const setFont = () => {
  //document.body.clientWidth;  屏幕VIEWPORT宽度
  //document.documentElement.clientWidth;
  let html = document.querySelector('html');
  //document.getElementsByTagName('html')[0]
  let font = window.innerWidth / 10;
  font = font > 50 ? 50 : font;
  html.style.fontSize = font + 'px';
};
window.onresize = function() {
  setFont();
}
document.addEventListener('DOMContentLoaded', setFont);

export default washRouter
