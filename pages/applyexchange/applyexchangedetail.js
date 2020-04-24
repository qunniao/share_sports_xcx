// pages/gym/coach.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardcontent:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app._ajax(
      "post",
      "/order/pageEActivationCode",
      { userId: wx.getStorageSync('userId'), pageNum: 1, pageSize: 10, activationCode: options.jhcode },
      (data) => {
        let listshowlist = data.data.content
        for (let i = 0; i < listshowlist.length; i++) {
          listshowlist[i].show = false
          listshowlist[i].creattimes = listshowlist[i].createTime.split(' ')[0]
        }
        this.setData({
          cardcontent: listshowlist[0]
        })
      },
      (msg) => { app.tipToast(2, msg) }
    ) 
  },
  gogymshop:function(e){
    wx.navigateTo({
      url: '/pages/gym/index?id=' + e.currentTarget.dataset.gymid,
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