const cfg = {
  index: {
    url: {
      get: '/coupon/couType_lists?page=1&pagesize=1',
    }
  },
  suits: [
    { time: '15分钟', value: '1', price: '1元', index: 0 },
    { time: '30分钟', value: '2', price: '2元', index: 1 },
    { time: '45分钟', value: '3', price: '3元', index: 2 }
  ],
  orders:[{
    id:'1',
    num:'1536726373436UTGhlJi',
    time:'2018-10-12 12:26:13',
    status:'待支付',
    net:'碧云湾',
    type:'1元15分钟'
  },{
    id:'2',
    num:'1536726373436UTGhlJi',
    time:'2018-10-12 12:26:13',
    status:'订单成功',
    net:'碧云湾',
    type:'3元45分钟'
  },{
    id:'3',
    num:'1536726373436UTGhlJi',
    time:'2018-10-12 12:26:13',
    status:'订单失效',
    net:'碧云湾',
    type:'1元15分钟'
  },{
    id:'4',
    num:'1536726373436UTGhlJi',
    time:'2018-10-12 12:26:13',
    status:'订单撤销',
    net:'碧云湾',
    type:'1元15分钟'
  },{
    id:'5',
    num:'1536726373436UTGhlJi',
    time:'2018-10-12 12:26:13',
    status:'支付成功',
    net:'碧云湾',
    type:'1元15分钟'
  },{
    id:'6',
    num:'1536726373436UTGhlJi',
    time:'2018-10-12 12:26:13',
    status:'订单失败',
    net:'碧云湾',
    type:'1元15分钟'
  }]
}

export default cfg;
