import config from "./config";
import hostsRoot from "./host.js";
let tools = {
    setCache(key, val) {
        if (!window.localStorage) return;
        window.localStorage.setItem(key, JSON.stringify(val))
    },
    getCache(key) {
        if (!window.localStorage) return;
        return window.localStorage.getItem(key)
    },
    setQueryString: function(obj) {
        var query = '';
        for (var key in obj) {
            if (obj[key] !== "" && typeof(obj[key]) !== 'undefined' && obj[key] !== null) {
                query += key + "=" + obj[key] + "&";
            }
        }
        query = query.substring(0, query.length - 1);
        return query;
    },
    clientcheck: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') { //微信登陆
            return 'WECHAT';
        } else if (ua.match(/Alipay/i) == "alipay") { //支付宝登陆
            return 'ZFB';
        } else if (ua.match(/colourlife/i) == "colourlife") { //彩之云app
            return 'CZY';
        } else {
            return 'BROWSER';
        }
    },
    is_browser: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) != 'micromessenger' && ua.match(/Alipay/i) != "alipay" && ua.match(/colourlife/i) != "colourlife") {
            return true;
        }
        return false;
    },
    setTitle: function(title) {
        document.title = title;
        var mobile = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(mobile)) {
            var iframe = document.createElement('iframe');
            iframe.style.visibility = 'hidden';
            iframe.setAttribute('src', 'loading.png');
            var iframeCallback = function() {
                setTimeout(function() {
                    iframe.removeEventListener('load', iframeCallback);
                    document.body.removeChild(iframe);
                }, 0);
            };
            iframe.addEventListener('load', iframeCallback);
            document.body.appendChild(iframe);
        }
    },
    getUserInfo(vm){
        //1.data中  user:{mobile:'',client_id:'',openid:'',appid:'',userid:'',clientType:''}
        //2.mounted中 this.user = utils.getUserInfo(this);
        let loginData =  vm.$store.state._global.login.data;
        let clientType = vm.$store.state._global.clientType
        let {user_mobile:mobile,user_id:client_id,user_openid:openid,user_appid:appid,user_id:userid} = loginData;
        return {mobile,client_id,openid,appid,userid,clientType};
    },
};
const utils = {
    config,
    fetch() {
        var url = '';
        var params = {};
        var host = hostsRoot.url;
        var len = arguments.length;
        if (len == 1) {
            url = arguments[0];
            params = {
                method: 'GET'
            };
        } else if (len == 2) {
            url = arguments[0];
            params = arguments[1];
        } else {
            return false;
        }
        var token = window.localStorage.getItem('access_token') || '';
        var imei = window.localStorage.getItem('imei') || '000000cdddd';
        if (typeof(params.headers) == 'undefined') {
            params.headers = {};
            params.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        params.headers['Access-Control-Request-Headers'] = 'Origin, X-Requested-With, Content-Type, Access-Token';
        params.headers['Access-Control-Request-Method'] = 'POST, GET, PUT, DELETE, OPTIONS';
        params.headers['Access-Token'] = token;
        if (typeof(params.body) == 'object') params.body = tools.setQueryString(params.body);
        params.headers['IMEI'] = imei;
        if (typeof(params.mode) == 'undefined') params.mode = 'cors';
        url = host + url;
        return fetch(url, params).then(
            function(response) {
                if (response.ok) return response.json();
            },
            function(error) {
                console.error('网络异常！' + url);
            }
        );

    },
    czy_token() {},
    zfb_token() {},
    wx_token2(query, func) {
        var token = window.localStorage.getItem('access_token') || '';
        if (token == '') {
            var openid = query.openid || (query.openId || '');
            var appid = query.appid || '';
            var access_token = query.access_token || '';
            var city = query.city || '';
            if (!openid || !access_token || !appid) {
                if (window.location.host == 'c.aparcar.cn' || window.location.host == 'app.aparcar.cn') {
                    window.location.href = "https://eapi.aparcar.cn/index/SnsapiBase?backurl=" + encodeURIComponent(window.location.href);
                } else if (window.location.host == 'w.aparcar.cn' || window.location.host == hostsRoot.base) {
                    window.location.href = "https://feedback.aparcar.cn/index/wxauth?name=yixuan&scope=snsapi_base&backurl=" + encodeURIComponent(window.location.href);
                }
            } else if (openid && access_token) {
                window.localStorage.setItem("imei", query.access_token);
                let data = {
                    client_type: "wechat",
                    appid,
                    openid,
                    city,
                    username: query['nickname']
                };
                return this.fetch('/login/app', {
                    method: 'post',
                    body: data
                }).then(function(json) {
                    window.localStorage.setItem("access_token", json.content.access_token);
                    return func('WECHAT', true, '');
                })
            }
        } else {
            return new Promise(function(resolve, reject) {
                resolve(func('WECHAT', true, ''));
            });
        }
    },
    access_token(query, func) {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') { //微信登陆
            return this.wx_token2(query, func);
        } else if (ua.match(/Alipay/i) == "alipay") { //支付宝登陆
            return this.zfb_token(query, func);
        } else if (ua.match(/colourlife/i) == "colourlife") { //彩之云app
            return this.czy_token(query, func);
        } else {
            var token = window.localStorage.getItem('access_token') || '';
            var res = !(token == "");
            return new Promise(function(resolve, reject) {
                resolve(func('BROWSER', res, ''));
            });
        }
    },
    ...tools
}
export default utils;
