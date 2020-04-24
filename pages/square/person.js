// pages/square/principal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    follow:true,
    dataList: [
      { name: 1, follow: true, fabulous: true, chat: true, create_time: "2019-04-18 21:30" },
      { name: "奶黄包2", follow: true, fabulous: false, chat: true, create_time: "2019-04-18 21:30" },
      { name: "奶黄包3", follow: false, fabulous: false, chat: true, create_time: "2019-04-18 21:30" },
      { name: "奶黄包4", follow: false, fabulous: false, chat: true, create_time: "2019-04-18 21:30" },
      { name: "奶黄包5", follow: false, fabulous: false, chat: false, create_time: "2019-04-18 21:30" },
      { name: "奶黄包6", follow: false, fabulous: false, chat: false, create_time: "2019-04-18 21:30" },
      { name: "奶黄包7", follow: false, fabulous: true, chat: true, create_time: "2019-04-18 21:30" },
      { name: "奶黄包8", follow: false, fabulous: true, chat: false, create_time: "2019-04-18 21:30" },
      { name: "奶黄包9", follow: false, fabulous: true, chat: false, create_time: "2019-04-18 21:30" },
      { name: "奶黄包10", follow: false, fabulous: true, chat: true, create_time: "2019-04-18 21:30" }
    ],
    userinfodata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  navigate: function (e) {
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
      success: function (res) {

      },
    })
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