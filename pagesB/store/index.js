//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    autoplay: true,
    interval: 5000,
    duration: 1000,
    parameter:true,
    detailsList: [],
    chostyle: true,
    purchnum: 1,
    parameterlist: [],
    speclist:[],
    choose_spec:"",
    shopcardprice:0,
    buyshop:0,
    gobuy:1,
    shopstock:1,
    shopprices:0,
    kcnum:0,
    shopids:'',
    setType:1,
    shopnums:0,
    goodspiclist:[]
  },
  onLoad: function (options) {
    let _this =this;
    _this.setData({
      shopids: options.id
    })
    this.getGoodsInfo(options);
  },
  onShow:function(){
    let _this= this;
  },
  reduce: function(){
    var _this = this;
    if (_this.data.purchnum > 1){
      _this.data.purchnum --
    }
    _this.setData({
      purchnum: _this.data.purchnum
    })
  },
  add: function () {
    var _this=this;
    let kunums = _this.data.kcnum
    if (kunums > _this.data.purchnum++){
      // _this.data.purchnum++;
      _this.setData({
        purchnum: _this.data.purchnum
      })
    }else{
      app.tipToast(2, '购买数量不能超过当前库存')
    }
  },
  wanttokf:function(e){
    wx.navigateTo({
      url: '/pages/customerservice/kfindex?shopid=' + this.data.shopids,
    })
  },
  completest: function () {
    this.setData({
      parameter: true
    })
  },
  completesf: function(){
    this.setData({
      parameter: false
    })
  },
  chostylet: function (e) {
    var _this = this;
    _this.setData({
      chostyle: true
    })
  },
  chostylef: function (e) {
    var _this = this;
    _this.setData({
      chostyle: false
    })
  },
  choosespec:function(e){
    this.setData({
      choose_spec: e.currentTarget.dataset.value
    })
  },
  //跳转
  navigate: function (e) {
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
    })
  },
  onShareAppMessage: function (res) {
    let _this =this;
    return {
      title: '分享',
      path: '/pagesB/store/index?id=' + _this.data.shopids,
      // imageUrl: 'https://......./img/groupshare.png',  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
      },
    }
  },
  //添加购物车
  addshopping:function(){
    let _this = this;
    if(_this.data.gobuy == 1){
      if (_this.data.choose_spec == '') {
        _this.setData({
          chostyle: false
        })
        app.tipToast(2, '款式未选择');
      } else {
        app._ajax(
          "post",
          "/cart/addCart",
          {
            userId: wx.getStorageSync('uid'),
            productId: _this.data.goodsInfo.id,
            number: _this.data.purchnum,
            settlementType: _this.data.goodsInfo.settlementType,
            style: JSON.stringify(_this.data.choose_spec)
          },
          (res) => {
            _this.getshopcard()
            _this.setData({
              chostyle: true,
            })
            app.tipToast(1,'加入购物车成功');
          },(msg) => {
            app.tipToast(2, msg);
          }
        )
      }
    }else{
      app._ajax(
        "post",
        "/cart/addCart",
        {
          userId: wx.getStorageSync('uid'),
          productId: _this.data.goodsInfo.id,
          number: _this.data.purchnum,
          settlementType: _this.data.goodsInfo.settlementType,
          style: JSON.stringify(_this.data.choose_spec)
        },
        (res) => {
          _this.getshopcard(1)
          app.tipToast(1, '加入购物车成功');
        }, (msg) => {
          app.tipToast(2, msg);
        }
      )
    }
  },
  buyshow:function(){
    let _this = this;
    if (_this.data.gobuy == 1) {
      if (_this.data.choose_spec == '') {
        _this.setData({
          chostyle: false
        })
        app.tipToast(2, '款式未选择');
      } else {
        if (_this.data.shopnums >= _this.data.purchnum){
          _this.setData({
            chostyle: false
          })
        }else{
          app.tipToast(2, '该商品暂无库存');
        }
      }
    } else {
      _this.buyimmediately()
    }
  },
  buyimmediately:function(){
    let _this = this;
    if(_this.data.gobuy == 1){
      if (_this.data.choose_spec == '') {
        _this.setData({
          chostyle: false
        })
        app.tipToast(2, '款式未选择');
      } else {
        if (_this.data.shopnums >= _this.data.purchnum) {
          let shoplist = [];
          let shopdetail = {
            productId: _this.data.goodsInfo.id,
            number: _this.data.purchnum,
            settlementType: _this.data.goodsInfo.settlementType,
            style: _this.data.choose_spec,
            imgage: _this.data.goodsInfo.image
          }
          wx.setStorageSync('buyshop', shopdetail)
          wx.navigateTo({
            url: '/pagesB/set/set?productId=' + _this.data.goodsInfo.id + '&number=' + _this.data.purchnum + '&style=' + _this.data.choose_spec + '&settlementType=' + _this.data.goodsInfo.settlementType + '&shoptype=2',
          })
        } else {
          app.tipToast(2, '该商品暂无库存');
        }
      }
    }else{
      if (_this.data.shopnums >= _this.data.purchnum) {
        let shoplist = [];
        let shopdetail = {
          productId: _this.data.goodsInfo.id,
          number: _this.data.purchnum,
          settlementType: _this.data.goodsInfo.settlementType,
          style: _this.data.choose_spec,
          imgage: _this.data.goodsInfo.image
        }
        wx.setStorageSync('buyshop', shopdetail)
        wx.navigateTo({
          url: '/pagesB/set/set?productId=' + _this.data.goodsInfo.id + '&number=' + _this.data.purchnum + '&style=' + _this.data.choose_spec + '&settlementType=' + _this.data.goodsInfo.settlementType + '&shoptype=2',
        })
      } else {
        app.tipToast(2, '该商品暂无库存');
      }
    }
  },
  getGoodsInfo: function (options){//获取商品详情
    var _this=this;
    app._ajax(
      "post",
      "/product/findById",
      { id: options.id},
      (res) => {
        let goodsinfopiclist = [{url:'../../res/imgs/social_nav_bg.png'}]
        if (res.data.productCarousel.length>=1){
          goodsinfopiclist = res.data.productCarousel
        }
        _this.setData({
          goodspiclist: goodsinfopiclist,
          shopnums: res.data.inventory,
          goodsInfo: res.data,
          setType: res.data.settlementType,
          kcnum: res.data.inventory
        })
        _this.getshopcard()
        let gobuy = 1
        if (res.data.style == '' || res.data.style==null){
            gobuy=2
        }
        let detailsList=[]
        if(res.data.details!=null){
          detailsList = res.data.details.split(",");
        }
        wx.setNavigationBarTitle({
          title: res.data.name,
        })
        let param =[]
        let style=[]
        if (res.data.param != null && res.data.param !=''){
          param = res.data.param.split(",");
        }
        if (res.data.style != null && res.data.style != ''){
          style = res.data.style.split(",");
        }
        // let param = res.data.param.split(",");
        let parameterlist = [];
        // let style = res.data.style.split(",");
        for (let i in param) {
          let params = { title: param[i].split(":")[0], text: param[i].split(":")[1] };
          parameterlist.push(params);
        }
        _this.setData({
          detailsList: detailsList,
          parameterlist: parameterlist,
          speclist: style,
          gobuy:gobuy,
        })
      }
    )  
  },
  // 获取购物车
  getshopcard: function (e) {
    let _this = this;
    app._ajax(
      "post",
      "/cart/countCart",
      {
        userId: wx.getStorageSync('uid'),
        settlementType: _this.data.setType
      },
      (data) => {
        _this.setData({
          buyshop:data.data.amount,
          shopprices: data.data.totalPrice
        })
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
  }
})
