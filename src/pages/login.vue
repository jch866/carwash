<template>
  <div class="login_box">
    <header class="login_title">自助洗车注册</header>
    <div class="login_form">
        <p class="tip">请输入您的手机号码，登录或注册您的自助洗车账号</p>
      <mt-field label="手机号" placeholder="请输入手机号" v-model='mobile'></mt-field>
      <!-- <mt-field label="" placeholder="输入图片验证码" v-model="picyzm">
          <img  @click="getYZCode"  :src="imgSrc" v-if="imgSrc" alt="">
      </mt-field> -->
      <mt-field label="验证码" placeholder="获取验证码" v-model='valicode'>
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
        let cfg = utils.config;
        return {
        api:cfg.login.url,
          mobile:'',
          valicode:'',
          send:false,
          seconds:60,
          timer :null,
          sec:1000,
          logining:false,
          test:true,
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
      sendCode(){
        let vm = this;
        let url = vm.api.send+'?mobile=' + vm.mobile +'&source=mobile_login&captcha_source=mobile_login';
        if( vm.mobile == ''){
            vm.$toast({ message: '请输入正确手机号'});
            return false;
        }
        vm.send = true;
        vm.timer && clearInterval(vm.timer)
        utils.fetch(url).then((data)=>{
            if(data.code == 0){
                vm.timer = setInterval(function(){
                   vm.seconds -- ;
                   if(vm.seconds === 0 ){
                    vm.send = false;
                    vm.seconds = 60;
                    clearInterval(vm.timer)
                   }
                },vm.sec)
            }
            vm.$toast({ message:data.message });
        })
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
        let url = vm.api.login;// /login/app
        window.localStorage.setItem("imei",'mobile_login_'+this.mobile);
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
    },
    mounted(){

    }
}
</script>
