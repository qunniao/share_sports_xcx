// pages/agent/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userdata:{},
    peopleacc:'',
    orderacc:'',
    userrole:2,
    usersdata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuserdetail()
    this.getteam()
    this.getorder()
    this.getusersdetail()
  },
  gotxdetail: function () {
    let _this =this;
    wx.navigateTo({
      url: '/pages/txdetail/txdetail?userrole=' + _this.data.userrole,
    })
  },
  getteam:function(){
    let _this = this;
    app._ajax(
      "post",
      "/agentTeam/countTeamSize",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        _this.setData({
          peopleacc: data.data
        })
      })
  },
  getorder: function () {
    let _this = this;
    app._ajax(
      "post",
      "/agentTeam/countOrderNumber",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        _this.setData({
          orderacc: data.data
        })
      })
  },
  getuserdetail:function(){
    let _this =this;
    app._ajax(
      "post",
      "/agent/queryUserInfo",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        _this.setData({
          userdata: data.data,
          userrole:data.data.role
        })
      })
  },
  getusersdetail: function () {
    let _this = this;
    app._ajax(
      "post",
      "/agent/queryDetails",
      { userId: wx.getStorageSync('uid') },
      (data) => {

        _this.setData({
          usersdata: data.data,
        })
      })
  },
  // 客服
  wanttokf: function (e) {
    wx.navigateTo({
      url: '/pages/customerservice/kfindex',
    })
  },
  //跳转

  navigate: function (e) {
    let _this =this;
    if (e.currentTarget.dataset.url =='team'){
      wx.navigateTo({
        url: "/pages/agent/team?type="+_this.data.userrole,
      })
    } else if (e.currentTarget.dataset.url == 'qrcode'){
      wx.navigateTo({
        url: "/pages/agent/qrcode?userrole=" + _this.data.userrole,
      })
    }else{
      wx.navigateTo({
        //目的页面地址
        url: e.currentTarget.dataset.url,
        success: function (res) {

        },
      })
    }
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