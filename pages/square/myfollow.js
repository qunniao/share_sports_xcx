const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firendList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getgzlist()
  },
  getgzlist:function(){
    let _this =this;
    app._ajax(
      "post",
      "/group/findAllFollowUser",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        _this.setData({
          firendList: data.data
        })
        console.log(data)
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