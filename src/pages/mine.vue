<template>
  <div>
    <mt-button @click.native="handleClick">测试按钮</mt-button>
    <mt-button   size="small"   type="primary">获取验证码</mt-button>
  </div>
</template>

<script>

export default {
    data(){
        return {

        }
    },
    methods:{
      handleClick(){
        let vm = this;
        vm.$alert('haha ')
      }

    },
    mounted(){
      let vm = this;
      this.$toast('Hello world!')
    }
}
</script>
