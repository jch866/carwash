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

  </div>
</template>

<script>
import utils from '../utils'
export default {
    data(){
        return {
          mobile:'',
          valicode:'',
          send:false,
          seconds:60,
          timer :null,
          sec:1000,
          logining:false,
        }
    },
    methods:{
      sendCode(){
        let vm = this;
        this.send = true;
        this.timer = setInterval(function(){
           vm.seconds -- ;
           if(vm.seconds === 0 ){
            vm.send = false;
            vm.seconds = 60;
            clearInterval(vm.timer)
           }
        },vm.sec)
      },
      userlogin(){
        let vm = this;
        utils.setCache('login',true);
        let r = { path: '/index'};
        vm.$router.push(r)
      }
    },
    mounted(){

    }
}
</script>
