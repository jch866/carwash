<template>
  <div class="login_box">
    <header class="login_title">自助洗车注册</header>
    <div class="login_form">
        <p class="tip">请输入您的手机号码，登录或注册您的自助洗车账号</p>
      <mt-field label="手机号" type="number" placeholder="请输入手机号" v-model='mobile'></mt-field>
      <mt-field label="图片验证码" placeholder="图片验证码" v-model="valipic" v-if='!test'>
          <img @click="getValiPic"  :src="imgSrc" v-if="imgSrc" alt=""/>
      </mt-field>
      <mt-field label="验证码" type="number" placeholder="短信验证码" v-model='valicode' v-if='!test'>
         <mt-button  v-if="!send" size="small" @click="sendCode"  type="primary">获取验证码</mt-button>
         <span v-if="send" class="remain_seconds">{{`${seconds}s`}}</span>
      </mt-field>
      <div class="submitBtn">
          <mt-button type="primary" size="large" @click='userlogin' :disabled='logining'>登录</mt-button>
      </div>
    </div>
    <div class="tc"><mt-switch v-model="test">测试模式</mt-switch></div>
  </div>
</template>

<script>
import utils from '../utils'
export default {

    data(){
        let cfg = utils.config.login;
        return {
        api:cfg.url,
          mobile:'',
          valicode:'',
          send:false,
          seconds:60,
          timer :null,
          sec:1000,
          logining:false,
          test:false,
          valipic:'',
          imgCode:'',
          imgSrc:'',
        }
    },
    beforeMount(){
      var clientType = this.$store.state._global.clientType;
        if( clientType == "CZY" || clientType == 'WECHAT' || clientType == 'ZFB' ){
            window.location.href = "/";
        }else{
            var token = window.localStorage.getItem('access_token') ? window.localStorage.getItem('access_token') : '';
            if(token == ''){
                this.get_unique_id();
            }else{
                this.check_unique_id();
                this.getValiPic();
            }
        }
    },
    computed:{
        redirect_addr:function(){
            var q = this.$router.currentRoute.query;
            if( typeof(q.redirect_addr) != 'undefined' && q.redirect_addr != '' ){
                return q.redirect_addr;
            }
            return '';
        },
    },
    methods:{
      getValiPic(){
          var vm = this;
          let url = vm.api.sendImgcode+'?source=mobile_login';//需要用token去请验证码
          utils.fetch(url).then(function(data){
              if(data.code == 0 && data.content){
                  vm.imgSrc = data.content.captcha;
                  //imgCode可以和图片上的验证对比
                  vm.imgCode = data.content.code && data.content.code.toUpperCase();
                  vm.resetTimer();
              }
          })
      },
      sendCode(){
        let vm = this;
        let data = {
          mobile:vm.mobile,
          code:vm.valipic,
          source:'mobile_login',
          captcha_source:'mobile_login'
        }
        let url = vm.api.send+'?'+utils.setQueryString(data);
        if( vm.mobile == ''){
            vm.$toast({ message: '请输入正确手机号'});
            return;
        }
        if( vm.valipic == ''){
            vm.$toast({ message: '请输入正确的图片验证码'});
            return;
        }
        vm.send = true;
        vm.timer && clearInterval(vm.timer)
        utils.fetch(url).then((data)=>{
            if(data.code == 0){
                vm.timer = setInterval(function(){
                   vm.seconds -- ;
                   (vm.seconds <= 0 ) && vm.resetTimer()
                },vm.sec)
            }
            vm.$toast({ message:data.message });
        })
      },
      resetTimer(){
        this.send = false;
        this.seconds = 60;
        this.timer&&clearInterval(this.timer)
      },
      userlogin(){
        let vm = this;
        if(vm.test){
            vm.testlogin();
        }else{
            vm.login();
        }
      },
      testlogin(){
        var vm = this;
        let url = vm.api.login;// /login/app
        var param = {
            client_type:'mobile',
            mobile:'15811202074',
            openid:5
        };
        utils.fetch(url, { method: "POST", body: param }).then((data)=>{
            window.localStorage.setItem(
                "access_token",
                data.content.access_token
            );
            vm.$router.push("/index");
        });
      },
      login(){
        var vm = this;
        let url = vm.api.login;
        window.localStorage.setItem("imei",'mobile_login_'+this.mobile);
        if (!vm.mobile) { vm.$toast('请输入手机号'); return; }
        if (!vm.valicode) { vm.$toast('请输入短信验证码'); return; }
        let data = {
            client_type:'mobile2',
            user_agent:encodeURIComponent(navigator.userAgent),
            origin:encodeURIComponent(window.location.origin),
            openid:this.mobile,
            mobile:this.mobile,
            code:this.valicode,
        }
        utils.fetch(url,{method:'post',body:data}).then((res)=>{
            if(typeof(res) != 'undefined' && res.code == 0) {
                var token = res.content.access_token;
                window.localStorage.setItem("access_token",token);
                if( vm.redirect_addr ){
                    window.location.href = decodeURIComponent(vm.redirect_addr);
                }else{
                    window.location.href = "/index";
                }
            }
        })
      },
      get_unique_id(){
            var vm = this;
            window.localStorage.setItem("imei",'Tourist');
            var data = "client_type=browser&user_agent=" + encodeURIComponent(navigator.userAgent) + "&origin=" + encodeURIComponent(window.location.origin) + "&openid=13800138000";
            utils.fetch('/index/location').then(function(json){
                data += "&ip="+json.content.ip;
                utils.fetch("/login/app",{method:'post',body:data}).then(function(res){
                    if(typeof(res) != 'undefined' && res.code == 0) {
                        var token = res.content.access_token;
                        window.localStorage.setItem("access_token",token);
                        vm.getValiPic();
                    }
                })
            });
        },
        check_unique_id(){
            utils.fetch('/login/appconfig').then(function(json){
                if( typeof(json) != 'undefined' && json.code == 0 && typeof(json.content.login) == 'undefined' ){
                    window.localStorage.removeItem("imei");
                    window.localStorage.removeItem("access_token");
                    window.location.reload();
                }
            });
        }
    },

    Mounted(){

    }
}
</script>
