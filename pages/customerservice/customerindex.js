const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 0,
    kfid:'',
    workid:'',
    kfreward:0,
    kflist:[],
    kfdata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      kfid: options.kfid,
      workid: options.workid
    })
    // this.getusercity(0, 1)
    this.getkfevaluate()
    this.getkfreward()
    this.kflevelavg()
    this.getkfdetail()
  },
  // 客服详情
  getkfdetail:function(){
    let _this = this;
    app._ajax(
      "post",
      "/customerService/queryCustomerService",
      { workNumber : _this.data.workid },
      (res) => {
        _this.setData({
          kfdata: res.data
        })
      }, (msg) => {
        app.tipToast(2, msg)
      }
    )
  },
  // 客服评价
  getkfevaluate:function(){
    let _this = this;
    app._ajax(
      "post",
      "/customerService/findAllByServiceId",
      { serviceId: _this.data.kfid},
      (res) => {
        _this.setData({
          kflist: res.data
        })
      }, (msg) => {
        app.tipToast(2, msg)
      }
    )
  },
  // 客服打赏次数
  getkfreward:function(){
    let _this = this;
    app._ajax(
      "post",
      "/customerService/countByServiceId",
      { serviceId: _this.data.kfid},
      (res) => {
        _this.setData({
          kfreward: res.data
        })
      }, (msg) => {
        app.tipToast(2, msg)
      }
    )
  },
  // 客服满意度
  kflevelavg:function(){
    let _this = this;
    app._ajax(
      "post",
      "/customerService/queryLevelAvg",
      { serviceId: _this.data.kfid },
      (res) => {
        _this.setData({
          flag: res.data
        })
      }, (msg) => {
        app.tipToast(2, msg)
      }
    )
  },
  // 客服评价页面
  gokfevaluate: function () {
    wx.navigateTo({
      url: '/pages/customerservice/serviceeval?kfid=' + this.data.kfid,
    })
  },
  // 打赏客服
  gokfreward: function () {
    wx.navigateTo({
      url: '/pages/customerservice/rewardkf?kfid='+this.data.kfid,
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