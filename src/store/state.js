import Vue from 'vue'
import Vuex from 'vuex'
import _wash from './wash'
Vue.use(Vuex)
let _global = {
      state:{
        login:{
            islogin:false,
            data:{},
        },
        clientType:'BROWSER'
    },
    mutations:{
        sign_in(state,obj){
            state.login = obj;
        },
        sign_out(state){
            state.login = {islogin:false,data:[]};
            window.localStorage.removeItem("imei");
            window.localStorage.removeItem("access_token");
        },
        client_type(state,str){
            state.clientType = str; //WECHAT,ZFB,CZY,BROWSER
        }
    },

}
var store = new Vuex.Store({
    modules: {
        _global,
        _wash,
    }
})

export default store;
