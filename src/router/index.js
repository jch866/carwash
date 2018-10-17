import Vue from 'vue'
import Router from 'vue-router'
import index from './../pages/index.vue'
import login from './../pages/login.vue'
import record from './../pages/record.vue'
import utils from './../utils'
import store from './../store/state.js'

let r = [{
    path: '/',
    redirect: '/index'
}, {
    path: '/index',
    component: index
}, {
    path: '/login',
    component: login
}, {
    path: '/record',
    component: record
}, ]

Vue.use(Router);

let router = new Router({
    mode: 'history',
    routes: r
});

router.beforeEach(function(to, from, next) {
    let TITLE = '非洗不可';
    if (to.path != '/login') {
        var token = window.localStorage.getItem('access_token') || '';
        if (token == "" && utils.is_browser()) {
            window.location.href = "/login?redirect_addr=" + encodeURIComponent(window.location.href);
        };
        utils.access_token(to.query, function(type, res, mobile) { //type值: WECHAT,ZFB,CZY,BROWSER; res:表示获取token成功还是失败; mobile:手机号
            store.commit('client_type', type);
            if (res) {
                utils.fetch('/login/appconfig').then(function(json) {
                    if (typeof(json) != 'undefined' && json.code == 0) {
                        if (json.content.islogin == true) {
                            let lgdata = json.content.login;
                            var appid = lgdata.user_appid || '';
                            var phone = lgdata.user_mobile || '';
                            if (type == 'CZY' && mobile != '' && phone != mobile) { //彩之云app切换账号后强制重新授权
                                store.commit('sign_out');
                                window.location.reload();
                            }
                            store.commit('sign_in', {
                                islogin: true,
                                data: json.content.login
                            }); //登录信息
                            utils.setTitle(TITLE);
                        } else {
                            store.commit('sign_out');
                            if (!utils.is_browser()) window.location.reload();
                        }
                        next();
                    } else {
                        window.location.reload();
                    }
                });
            } else {
                store.commit('sign_out');
                next();
            }
        });
    } else {
        store.commit('client_type', utils.clientcheck());
        next();
    }
})

const setFont = () => {
    //document.body.clientWidth;  屏幕VIEWPORT宽度
    //document.documentElement.clientWidth;
    let html = document.querySelector('html');
    let font = window.innerWidth / 10;
    font = font > 50 ? 50 : font;
    html.style.fontSize = font + 'px';
};
window.onresize = function() {
    setFont();
}
document.addEventListener('DOMContentLoaded', setFont);

export default router
