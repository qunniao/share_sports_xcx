// pages/agent/commission.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,//1-wechat 2-alipay
    usercomdata:{},
    userdata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuserCommission()
    this.getusermoney()
  },
  gotxdetail:function(){
    wx.navigateTo({
      url: '/pages/txdetail/txdetail',
    })
  },
  getuserCommission:function(){
    let _this = this;
    app._ajax(
      "post",
      "/commission/queryCommission",
      {
        agentId:wx.getStorageSync('uid')
      },
      (data) => {
        _this.setData({
         usercomdata:data.data
        })
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  getmoney:function(e){
    wx.navigateTo({
      url: '/pages/agent/usertx?gettype='+this.data.type,
    })
  },
  // 获取佣金
  getusermoney: function () {
    let _this = this;
    app._ajax(
      "post",
      "/agent/queryUserInfo",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        _this.setData({
          userdata: data.data,
        })
      }),
      (msg) => {
        app.tipToast(2, msg);
      }
  },
  choosePay:function(e){
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },

  //跳转
  navigate: function (e) {
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
      success: function (res) {

      },
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