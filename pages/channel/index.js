// pages/agent/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userdata: {},
    peopleacc: '',
    orderacc: '',
    userrole:3,
    usersdata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuserrole()
    this.getuserdetail()
    this.getteam()
    this.getorder()
    this.getusersdetail()
  },
  getteam: function () {
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
  getuserrole:function(){
    let _this=this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        _this.setData({
          userrole: data.data.role 
        })
      })
  },
  getuserdetail: function () {
    let _this = this;
    app._ajax(
      "post",
      "/agent/queryUserInfo",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        _this.setData({
          userdata: data.data
        })
    })
  },
  gotokf:function(){
    wx.navigateTo({
      url: '/pages/customerservice/kfindex',
    })
  },
  gotxdetail: function () {
    wx.navigateTo({
      url: '/pages/txdetail/txdetail',
    })
  },
  //跳转
  navigate: function (e) {
    let _this=this;
    if (e.currentTarget.dataset.url == 'scheme'){
      if (_this.data.userrole == 3) {
        wx.navigateTo({
          url: '/pages/channel/twoscheme',
        })
      }else{
        wx.navigateTo({
          url: '/pages/channel/scheme',
        })
      }
    }else{
      if (_this.data.userrole == 3) {
        wx.navigateTo({
          url: e.currentTarget.dataset.url + '?userrole=3',
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.url + '?userrole=' + _this.data.userrole,
        })
      }
    }
    // wx.navigateTo({
    //   //目的页面地址
    //   url: e.currentTarget.dataset.url,
    //   success: function (res) {

    //   },
    // })
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