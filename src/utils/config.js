const cfg = {
  index: { //首页  index.vue
    url: {
      get: '/flashbox/mealInfo', //2.获取设备套餐信息// 参数：wd_id
      detail: '/flashbox/mealDetail', //3.获取设备套餐详情// 参数：wd_id，packageID
      status: '/flashbox/checkDevice', //1.获取设备状态// 参数：wd_id
      check: '/flashbox/checkMobile', //4.检测用户是否注册手机号// 参数：client_id
      create: '/flashbox/create' //5.创建订单// 参数：source,type,money,wd_id,client_id
    }
  },
  login: { //登录 login.vue
    url: {
      login: '/login/app',
      send: '/user/pushCaptcha',
      sendImgcode: '/user/captcha'
    }
  },
  record: { //洗车纪录 record.vue
    url: {
      lists: '/flashbox/orderLists',
    },
    status:{
      "created":"已创建","paid":"支付成功","invalid":"失效订单","canceld":"取消"
    }
  },

}

export default cfg;
