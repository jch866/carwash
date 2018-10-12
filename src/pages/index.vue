<template>
  <div>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">首页</mt-tab-item>
      <mt-tab-item id="2">我的</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <section class="content_top">
          <div class="adv_banner"><img src="../assets/banner.jpg"></div>
          <div class="check_title">洗车时长选择</div>
          <my-check-suit :option='config.suits' v-model='checkedVal' @change='setselectVal'></my-check-suit>
          <div class="check_note">
            <p class="orange">备注:</p>
            <p>支付成功以后须在30分钟内启动设备，否则订单失效，失效的订单无法退款，请知悉！</p>
          </div>
        </section>
        <div class='bottom_pay'>
          <span class="pay_info">订单金额：<span class="pay_amount">{{`¥${checkedVal}.00元`}}</span></span>
          <span class="pay_btn">微信支付</span>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <section class="content_top">
            <div class="mine_profile">
                <div class="mine_avatar"><img src="../assets/avatar.png" alt=""></div>
                <div class="mine_phone">13218885998</div>
            </div>
            <mt-cell title="洗车记录" is-link to="/record"></mt-cell>
            <mt-cell title="联系我们" value="关注微信公众号”EP车管家“留言"></mt-cell>
        </section>
        <!-- <div class='bottom_mine'>
            <img src="../assets/adv.jpg">
        </div> -->
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
import util from "../utils";
export default {
  data() {
    let config = util.config;
    return {
      selected: "1",
      checkedVal:'1',//默认套餐
      config,
      api: config.index.url,
    }
  },
  methods: {
    setselectVal(val){
        this.checkedVal = val;
    },
    handleClick() {
      let vm = this;
      vm.$messagebox('haha ')
    },
    getData() {
      let vm = this;
      let url = vm.api.get;
      util.fetch(url).then(res => {
      })
    }
  },
  mounted() {
    let vm = this;
  }
}

</script>
<!-- <style lang="scss" rel="stylesheet/scss" scoped>


</style> -->
