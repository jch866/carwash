import Vue from 'vue'
import MintUi from 'mint-ui'
import App from './app.vue'
import store from './store/state'
import router from './router'
import './css/main.scss';
import 'mint-ui/lib/style.css'
Vue.use(MintUi);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
