<template>
    <div class="check_case">
      <ul>
        <li v-for='(item,index) in option' @click='clickhandler(index,item)'
        :class="{'active': check_value == item.value}">
          <div>
            <h2>{{item.price}}</h2>
            <span>{{item.time}}</span>
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
      this.check_value = item.value;
      this.$emit('change',item.value)
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

