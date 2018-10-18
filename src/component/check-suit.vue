<template>
    <div class="check_case">
      <ul>
        <li v-for='(item,index) in option' @click='clickhandler(index,item)'
        :class="{'active': check_value == item.packageID}">
          <div>
            <h2>{{item.price}}元</h2>
            <span>{{Math.floor(item.duration/60)}}分钟</span>
          </div>
        </li>
      </ul>
    </div>
</template>
<script>
export default {
  props:['option','value'],
  data() {
    return {
      check_value:''
    }
  },
  watch:{
    value(...params){
      //console.log(...params)
      this.setval()
    }
  },
  methods: {
    clickhandler(idx,item){
      //console.log(idx,item)
      this.check_value = item.packageID;
      this.$emit('change',{id:item.packageID,val:item.price})
    },
    setval(){
      this.check_value = this.value;
    }
  },
  mounted() {
      this.setval()
  }
}
</script>

