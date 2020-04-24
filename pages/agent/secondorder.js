// pages/agent/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: 0,//0-全部 1-客户 2-二级
    type: 1,//1-全部 2-待付款 3-已付款 4-已完成
    dataList: [{ type: 2, type2: 1, }, { type: 2, type2: 2, }, { type: 3, type2: 1, }, { type: 4, type2: 2, }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  chooseType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type
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