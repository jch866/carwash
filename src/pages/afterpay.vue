<template>
  <div>
    <div v-if="loading" class="tc">
      <mt-spinner color="#5cb85c" type="triple-bounce"></mt-spinner>
    </div>
    <template v-else>
      <div v-if="!not_exist">
        <div>{{ result == 'waiting' ? '正在支付中，请稍后' : (result == 'success' ? '支付成功' : '支付失败') }}</div>
        <mt-cell title="车牌号" :value="plate"></mt-cell>
        <mt-cell title="金额" :value="amount"></mt-cell>
        <mt-cell title="停车场" :value="station"></mt-cell>
        <mt-cell title="支付渠道" :value="channel"></mt-cell>
        <mt-cell title="支付类型" :value="type"></mt-cell>
        <mt-cell title="商家名称" :value="merchant_name"></mt-cell>
        <mt-cell title="优惠券名称" :value="type_name"></mt-cell>
        <mt-cell title="优惠券数量" :value="coupon_num"></mt-cell>
        <mt-cell title="车位锁名称" :value="lock_name"></mt-cell>
        <mt-cell title="开始时间" :value="begin_time"></mt-cell>
        <mt-cell title="结束时间" :value="end_time"></mt-cell>
        <mt-cell title="订单号" :value="query.sn"></mt-cell>
      </div>
      <div v-else>订单不存在</div>
      <mt-button @click="goback" size="large" type="primary">返回</mt-button>
    </template>
  </div>
</template>
<script type="text/javascript">
import utils from "../utils";
export default {
  data: function() {
    let paymothed = { "wechat": "微信", "czy": "彩之云", "newczy": "彩之云", "alipay": "支付宝" };
    return {
      paymothed,
      loading: true,
      not_exist: false,
      result: 'waiting',
      plate: "",
      amount: "",
      station: "",
      type: "",
      begin_time: "",
      end_time: "",
      merchant_name: "",
      type_name: "",
      coupon_num: "",
      lock_name: "",
      tInt: null,
    };
  },
  computed: {
    // user(){
    //     return utils.getUserInfo(this);
    // },
    query: function() {
      return this.$route.params;
    },
    channel: function() {
      var s = this.$route.params.channel;
      return this.paymothed[s];
    }
  },
  beforeMount: function() {
    debugger;
    this.user = utils.getUserInfo(this);
  },
  mounted: function() {
    debugger;
    let clientType = this.user.clientType || '';
    if (this.query.status == 'fail') {
      this.result = 'error';
    }
    this.init();
  },
  methods: {
    goback() {
      window.location.href = '/';
    },
    init() {
      var vm = this;
      let { sn } = vm.$route.params;
      vm.loading = true;
      vm.tInt = setInterval(function() {
        vm.orderInfo(sn);
      }, 2000);
    },
    orderInfo(sn) {
      var vm = this;
      utils.fetch("/order/payment?page=1&pagesize=1&tnum=" + sn).then((json) => {
        if (json && json.code == 0) {
          if (json.content != "" && json.content.total > 0) {
            var obj = json.content.lists[0];
            vm.plate = obj.plate;
            vm.station = obj.station_name;
            vm.amount = obj.amount + "(元)";
            if (obj.status == 'paid') {
              vm.result = 'success';
              vm.tInt && clearInterval(vm.tInt);
            }
          } else {
            vm.not_exist = true;
            vm.tInt && clearInterval(vm.tInt);
          }
        }
        vm.loading = false;
      });
    },


  },

};

</script>
