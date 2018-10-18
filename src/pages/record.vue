<template>
  <div>
    <div class="record">
      <div v-if="orders.length==0">当前纪录为空！</div>
      <div v-else class="record_item" v-for='item in orders' :key='item.id'>
        <p>订单号：{{item.tnum}}</p>
        <p>网点：{{item.net_name}}</p>
        <p>套餐：{{getName(item.packageID)}}</p>
        <p>时间：{{item.paytime}}</p>
        <p>状态：<span class="green">{{statusmap[item.status]}}</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import utils from "../utils";
export default {
  data() {
    let config = utils.config.record;
    return {
      api: config.url,
      statusmap: config.status,
      orders: [],
      user: { mobile: '', client_id: '', openid: '', appid: '', userid: '', clientType: '' }
    }
  },
  computed:{
    suits(){
        let suitArr = this.$store.state._wash.suits;
        return suitArr.map(item => { item.name = `${item.price}元 ${Math.floor(item.duration/60)}分钟`; return item })
    }
  },
  beforeMount() {
    let vm = this;
    vm.user = utils.getUserInfo(vm);
  },
  methods: {
    getName(id){
        return this.suits.filter(item=>item.packageID == id)[0].name;
    },
    getData() {
      let vm = this;
      let url = `${vm.api.lists}?page=1&pagesize=200&client_id=${vm.user.client_id}`;
      utils.fetch(url).then(res => {
        if (res && res.code === 0 && res.content) {
          vm.orders = res.content.lists || [];
        } else {
          vm.$toast({ message: res.message });
        }
      })
    },
  },
  mounted() {
    console.log(this.user)
    this.getData();
  }
}

</script>
