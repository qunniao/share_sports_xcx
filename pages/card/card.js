// pages/card/card.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    my_energy:0,
    energy:0,
    url:"",
    id:"",
    tcshow: false,
    remakes:'',
    cardname:'',
    cardusername:'',
    carduserphone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    })
    this.setData({
      my_energy: Number(options.my_energy),
      energy: Number(options.energy),
      url: options.url,
      id: options.id,
      remakes: options.remakes,
      cardname: options.name
    })
  },
  tcbtnshow: function () {
    let _this =this;
    if (_this.data.cardusername != '' && _this.data.carduserphone!=''){
      let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      if (TEL_REGEXP.test(_this.data.carduserphone)) {
        _this.setData({
          tcshow: true
        })
      } else {
        app.tipToast(2, '手机号码不正确')
      }
    }else{
      app.tipToast(2, '购买人信息未填写')
    }
  },
  tchiden: function () {
    this.setData({
      tcshow: false
    })
  },
  tccheckok:function(){
    let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
    if (TEL_REGEXP.test(this.data.carduserphone)) {
      app._ajax(
        "post",
        "/order/redemptionCard",
        { cardTypeId: this.data.id, userId: wx.getStorageSync('userId'), reservedName: this.data.cardusername, reservedPhone: this.data.carduserphone },
        (data) => {
          app.tipToast(1, data.msg, function () {
            wx.navigateBack({})
          })
        },
        (msg) => { app.tipToast(2, msg) }
      )
    }else{
      app.tipToast(2, '手机号码输入有误')
    } 
  },
  gorecharge:function(){
    let rechargemoney = this.data.energy - this.data.my_energy
    wx.navigateTo({
      url: "../recharge/recharge?money=" + rechargemoney,
    }) 
  },
  changename:function(e){
    let _this = this;
    let val = e.detail.value
    _this.setData({
      cardusername: val
    })
  },
  changephone: function (e) {
    let _this = this;
    let val = e.detail.value
    _this.setData({
      carduserphone: val
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var _this = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.getUserInfo();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})