<template>
  <div>
    <div v-if="loading" class="pay_spinner">
      <mt-spinner color="#5cb85c" :size="80" type="triple-bounce"></mt-spinner>
    </div>
    <template v-else>
      <div :class="['order_tips',result == 'success' ?'green':'red']">
        {{result == 'success' ? '支付成功！' : '支付失败！'}}
      </div>
      <mt-cell v-if="amount" title="金额" :value="amount"></mt-cell>
      <mt-button @click="goback" size="large" type="primary">返回</mt-button>
    </template>
  </div>
</template>
<script type="text/javascript">
import utils from "../utils";
export default {
  data: function() {
    let config = utils.config.afterpay;
    return {
      api: config.url,
      loading: true,
      not_exist: false,
      result: 'waiting',
      amount: "",
      orderTimer: null,
      timeout: 10000, // 10秒
      getTimerBegin: 0,

    };
  },
  computed: {
    query: function() {
      return this.$route.params;
    },
  },
  beforeMount: function() {
    this.user = utils.getUserInfo(this);
  },
  mounted() {
    this.result = this.query.status;
    if (this.result === 'fail') return;
    this.getOrderStatus();
  },
  methods: {
    goback() {
      window.location.href = '/';
    },
    getOrderStatus() {
      var vm = this;
      let { sn } = vm.$route.params;
      vm.loading = true;
      vm.getTimerBegin = new Date().getTime();
      vm.orderTimer = setInterval(function() {
        vm.orderInfo(sn);
      },2000);
    },
    orderInfo(sn) {
      var vm = this;
      let url = `${vm.api.order}?page=1&pagesize=10&tnum=${sn}`;
      utils.fetch(url).then((json) => {
        if (json && json.code == 0) {
          if (json.content != "" && json.content.total > 0) {
            var obj = json.content.lists[0];
            vm.amount = obj.amount + "(元)";
            if (obj.status == 'paid') {
              vm.result = 'success';
              vm.orderTimer && clearInterval(vm.orderTimer);//成功直接退出定时器
              vm.loading = false;
            }
          }
        }else{
          //失败继续查
          vm.checkTimeout();
        }

      });
    },
    checkTimeout() {
      let vm = this;
      let now = new Date().getTime();
      let diff = now - vm.getTimerBegin;
      if (diff >= vm.timeout) {
        //timeout后,还查不到结果，清除定时器，查询失败
        vm.orderTimer && clearInterval(vm.orderTimer);
        vm.result = 'fail';
        vm.loading = false;
      }
    },
  },

};

</script>
