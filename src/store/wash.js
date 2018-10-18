import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
let _wash = {
      state:{
        suits:[]
    },
    mutations:{
        setSuits(state,array){
          state.suits  = array;
        }
    },

}
export default _wash;
