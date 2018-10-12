import Vue from 'vue'
import MintUi from 'mint-ui'
import store from './store/state'
import router from './router'
import 'mint-ui/lib/style.css'
import './css/main.scss'//在ui样式后面可以重写UI样式
Vue.use(MintUi);
// import checkSuit from './component/check-suit.vue'
// Vue.component('my-check-suit', checkSuit);
//webpack3的require中要加上default
Vue.component('my-check-suit', require('./component/check-suit.vue').default);

let app = new Vue({
  el: '#app',
  router,
  store
})
