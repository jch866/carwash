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
  store,
  created () {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  }
})
