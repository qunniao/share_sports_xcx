const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    powerdetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this =this;
    app._ajax(
      "post",
      "/coupon/queryDetails",
      { id: options.powerid },
      (data) => {
        _this.setData({
          powerdetail: data.data
        })
      },
      (msg) => {
      }
    )  
  },
  gotoshop:function(){
    wx.navigateTo({
      url: '/pages/index/index?type=1&shoptype=5',
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