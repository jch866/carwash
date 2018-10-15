import config from "./config";
import hostsRoot from "./host.js";
let tools = {
    setCache(key,val){
      if(!window.localStorage)return;
      window.localStorage.setItem(key,JSON.stringify(val))
    },
    getCache(key){
      if(!window.localStorage)return;
      return window.localStorage.getItem(key)
    },
    setQueryString: function(obj){
        var query = '';
        for(var key in obj){
          if(obj[key] !== "" && typeof(obj[key]) !== 'undefined' && obj[key] !== null){
            query += key + "=" + obj[key] + "&";
          }
        }
        query = query.substring(0,query.length-1);
        return query;
    },
};
const utils = {
    config,
    fetch(){
        var url = '';
        var params = {};
        var host = hostsRoot.url;
        var len = arguments.length;
        if(len == 1){
            url = arguments[0]; params = {method:'GET'};
        }else if(len == 2){
            url = arguments[0]; params = arguments[1];
        }else{
            return false;
        }
        var token = window.localStorage.getItem('access_token') ? window.localStorage.getItem('access_token') : '';
        var imei = window.localStorage.getItem('imei') ? window.localStorage.getItem('imei') : '000000cdddd';
        if( typeof(params.headers) == 'undefined'){
            params.headers = {};
            params.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        params.headers['Access-Control-Request-Headers'] = 'Origin, X-Requested-With, Content-Type, Access-Token';
        params.headers['Access-Control-Request-Method'] = 'POST, GET, PUT, DELETE, OPTIONS';
        params.headers['Access-Token'] = token;
        if( typeof(params.body) == 'object')params.body = tools.setQueryString(params.body);
        params.headers['IMEI'] = imei;
        if( typeof(params.mode) == 'undefined' ) params.mode = 'cors';
        url = host + url;
        return fetch(url,params).then(
            function(response){
                if(response.ok) return response.json();
            },function(error){
                console.error('网络异常！' + url);
            }
        );

    },
    ...tools
}
export default utils;
