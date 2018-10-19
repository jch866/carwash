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
            <my-check-suit :option='suits' v-model='checkedID' @change='setselectVal'></my-check-suit>
            <div class="check_note">
              <p class="orange">备注:</p>
              <p>支付成功以后须在30分钟内启动设备，否则订单失效，失效的订单无法退款，请知悉！</p>
            </div>
        </section>
        <div class="placeholder"></div>
        <div class='bottom_pay'>
          <span class="pay_info">订单金额：<span class="pay_amount">{{`¥${checkedVal}.00元`}}</span></span>
          <span class="pay_btn" @click='wechatPay'>微信支付</span>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <section class="content_top">
          <div class="mine_profile">
            <div class="mine_avatar"><img src="../assets/avatar.png" alt=""></div>
              <div class="mine_phone">{{user.mobile}}</div>
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
import utils from "../utils";
export default {
  data() {
    let config = utils.config.index;
    return {
      api: config.url,
      selected: "1",
      checkedVal: 0, //默认套餐
      checkedID: 0,
      config,
      suits: [],
      wd_id: 0,
      user: { mobile: '', client_id: '', openid: '', appid: '', userid: '', clientType: '' }
    }
  },
  // mounted() {
  //   let vm = this;
  //   vm.user = utils.getUserInfo(vm);
  // },
  beforeMount() {
    let vm = this;
    vm.user = utils.getUserInfo(vm);
    vm.wd_id = vm.$route.params.wd_id;
    vm.getMealInfo();
  },
  methods: {
    wechatPay() {
      let vm = this;
      let createurl = vm.api.create;
      let unifiedurl = vm.api.unified;
      if (vm.checkedVal <= 0) { vm.$toast({ message: '请选择套餐' }); return; }
      let data = {
        source: 'EPWECHAT',
        type: 'maintain',
        money: vm.checkedVal,
        wd_id: vm.wd_id,
        client_id: vm.user.client_id,
        packageID: vm.checkedID
      }
      utils.fetch(createurl, { method: "POST", body: data }).then(res => {
        vm.$indicator.close();
        if (typeof(res) != 'undefined' && res.code == 0) return res.content;
        vm.$indicator.open({ text: res.message, spinnerType: 'fading-circle' });
        return '';
      }).then(dat => {
        vm.$indicator.close();
        if (!dat) return '';
        let { tnum, amount } = dat;
        vm.$indicator.open({ text: '微信下单中...', spinnerType: 'fading-circle' });
        let perfixer = "https://feedback.aparcar.cn/afterpay/wechat/wash/" + tnum;
        let success_url = perfixer + "/success";
        let error_url = perfixer + "/fail";
        let notify_url = 'https://feedback.aparcar.cn/notify/flashbox/shuangqian';
        let { appid, openid } = vm.user;
        let odata = {
          success_url: encodeURIComponent(success_url),
          error_url: encodeURIComponent(error_url),
          notify_url: encodeURIComponent(notify_url),
          body: "非洗不可",
          channel: "shuangqian",
          appid,
          openid,
          order_type: 1,
          pay_type: 0,
          source: "EPWECHAT",
          sn: tnum,
          qr:0,
          money: Number(amount)
        };
        return odata;
      }).then(res => {
        vm.$indicator.close();
        if (!res) return '';
        utils.fetch(unifiedurl, { method: "POST", body: res }).then(json => {
          if (typeof(json) != 'undefined' && json.code == 0) {
            if (json.content.redirect != '') {
              window.location.href = json.content.redirect;
            } else {
              vm.qr.code = json.content.qr_code; //扫码支付 二维码地址
              vm.qr.type = 'wx';
              vm.qr.show = true;
              let url = `https://${window.location.host}/afterpay/wechat/wash/${tnum}/success`;
              vm.qr_check(param.tnum, url);
            }
          } else {
            vm.$toast("支付信息提交失败");
          }
        })
      })

    },
    setselectVal(obj) {
      this.checkedVal = obj.val;
      this.checkedID = obj.id;
    },
    getMealInfo() {
      let vm = this;
      let url = `${vm.api.get}?wd_id=${vm.wd_id}`;
      utils.fetch(url).then(res => {
        if (res && res.code === 0) {
          vm.suits = res.content.lists || [];
          vm.$store.commit('setSuits', vm.suits)
        }
      })
    },
  },

}

</script>
<!-- <style lang="scss" rel="stylesheet/scss" scoped>


</style> -->
