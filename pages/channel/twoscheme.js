// pages/agent/scheme.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,//1-未使用 2-已使用 3-已过期
    dataList: [],
    pageNum: 1,
    searchtext: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gettwoqd()
  },
  changesearchtext: function (e) {
    this.setData({
      searchtext: e.detail.value
    })
  },
  searchshop: function () {
    let _this = this;
    if (_this.data.searchtext == '') {
      _this.setData({
        pageNum: 1
      })
      _this.gettwoqd()
    } else {
      let searchdatas = {
        name: _this.data.searchtext,
        level: 2
      }
      if (_this.data.type != 0) {
        searchdatas.type = _this.data.type
      }
      app._ajax(
        "post",
        "/channelScheme/byProductName",
        searchdatas,
        (data) => {
          // let datalists = _this.data.dataList;
          if (data.data != null) {
            let datalists = data.data
            _this.setData({
              dataList: datalists
            })
          }
        }
      )
    }
  },
  gettwoqd: function (num) {
    let _this = this;
    let searchdata = {
      pageNum: _this.data.pageNum,
      userId:43,
      pageSize: 10
    }
    if (_this.data.type != 0) {
      searchdata.type = _this.data.type
    }
    app._ajax(
      "post",
      "/channelScheme/pageTowChannelScheme",
      searchdata,
      (data) => {
        let datalists = _this.data.dataList;
        if (_this.data.pageNum > 1) {
          for (let i = 0; i < data.data.data.content.length; i++) {
            datalists.push(data.data.content[i])
          }
        } else if (_this.data.pageNum == 1) {
          datalists = data.data.content
        }
        _this.setData({
          dataList: datalists
        })
      }
    )
  },
  chooseType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type,
    })
    this.searchshop()
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