<template>
  <div>
    <span>这是一段文字</span>
    <mt-button @click.native="handleClick">测试按钮</mt-button>
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
        vm.$messagebox('haha ')
      }

    },
    mounted(){
      let vm = this;
    }
}
</script>
