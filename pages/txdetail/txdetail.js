// pages/wallet/wallet.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: false,
    type: 0,//0-全部 1-转入 2-消费 3-转出 4-冻结
    walletlist: [],
    userwallet: {},
    pageNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
  },
  // 获取消费明细
  getdetailed: function () {
    let _this = this;
    app._ajax(
      "post",
      "/fundFlow/queryFlowRecord",
      { pageNum: _this.data.pageNum, pageSize: 10, userId: wx.getStorageSync('uid') },
      (data) => {
        let walletdata = _this.data.walletlist;
        let resdatas = data.data.content;
        console.log(data)
        if (_this.data.pageNum == 1) {
          walletdata = resdatas
        } else {
          for (let i = 0; i < resdatas.length; i++) {
            walletdata.push(resdatas[i])
          }
        }
        _this.setData({
          walletlist: walletdata
        })
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
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
    let _this = this;
    _this.setData({
      pageNum: 1
    })
    _this.getdetailed()
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

  modalChoose: function () {
    this.setData({
      filter: !this.data.filter
    })
  },
  chooseType: function (e) {
    let _this = this
    let data = {
      pageNum: 1,
      pageSize: 10,
      titleType: e.currentTarget.dataset.type,
      userId: wx.getStorageSync('userId')
    }
    if (e.currentTarget.dataset.type == 0) {
      data = {
        pageNum: 1,
        pageSize: 10,
        userId: wx.getStorageSync('userId')
      }
    }
    this.setData({
      type: e.currentTarget.dataset.type,
      filter: !this.data.filter
    })
    app._ajax(
      "post",
      "/order/pageExpensesRecord",
      data,
      (data) => {
        _this.setData({
          walletlist: data.data.content
        })
      },
      (msg) => {

      }
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let pagesno = this.data.pageNum + 1
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.getdetailed();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})