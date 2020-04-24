// pages/agent/team.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    filter: 0,//0-全部 1-正式二级 2审核中2级
    allcustomer: 0,
    khcommission: 0,
    dlcommission: 0,
    leijinum: 0,
    sales: 0,
    dataList2: [{ type: 1 }, { type: 1 }, { type: 2 }, { type: 2 }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCustomerdata(1)
    let _this = this;
    app._ajax(
      "post",
      "/channelTeam/channelStatistics",
      {
        userId: wx.getStorageSync('uid')
      },
      (data) => {
        _this.setData({
          khcommission: data.data.totalCommission,
          sales: data.data.sales
        })
      }
    )
  },
  getCustomerdata: function (num) {
    let _this = this;
    app._ajax(
      "post",
      "/agentTeam/queryClientTeam",
      {
        pageNum: num,
        pageSize: 10,
        userId: wx.getStorageSync('uid')
      },
      (data) => {
        _this.setData({
          allcustomer: data.data.totalElements,
          dataList: data.data.content
        })
      }
    )
  },
  filterType: function (e) {
    this.setData({
      filter: e.currentTarget.dataset.type
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