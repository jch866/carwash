<template>
  <div>
    <div class="record">
      <div class="record_item" v-for='item in orders' :key='item.id'>
        <p>订单号：{{item.num}}</p>
        <p>网点：{{item.net}}</p>
        <p>套餐：{{item.type}}</p>
        <p>时间：{{item.time}}</p>
        <p>状态：{{item.status}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../utils";
export default {
    data(){
      let config = util.config;
        return {
          orders:config.orders,
        }
    },
    methods:{

    },
    mounted(){

    }
}
</script>
