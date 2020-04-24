// pages/agent/scheme.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,//1-未使用 2-已使用 3-已过期
    dataList: [],
    pageNum:1,
    searchtext:''
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
  searchshops: function (e) {
    this.setData({
      searchtext: e.detail.value
    })
    this.searchshop()
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
        level:1
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
  gettwoqd:function(num){
    let _this =this;
    let searchdata = {
      pageNum: _this.data.pageNum,
      pageSize: 10
    }
    if (_this.data.type != 0) {
      searchdata.type = _this.data.type
    }
    app._ajax(
      "post",
      "/channelScheme/pageOneChannelScheme",
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
  //跳转
  navigate: function (e) {
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
      success: function (res) {

      },
    })
  },
  chooseType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type,
    })
    this.searchshop()
  },
  goconfig:function(e){
    if (e.currentTarget.dataset.level!=null){
      wx.navigateTo({
        url: '/pages/channel/schemeconfig?sechmeid=' + e.currentTarget.dataset.id + '&oneoperid=' + e.currentTarget.dataset.oneoperid + '&channelcode=' + e.currentTarget.dataset.channelcode + '&typeid=' + e.currentTarget.dataset.typeid + '&shopprice=' + e.currentTarget.dataset.price + '&userlevel=' + e.currentTarget.dataset.level + '&schemetype=2',
      })
    }else{
      wx.navigateTo({
        url: '/pages/channel/schemeconfig?sechmeid=' + e.currentTarget.dataset.id + '&oneoperid=' + e.currentTarget.dataset.oneoperid + '&channelcode=' + e.currentTarget.dataset.channelcode + '&typeid=' + e.currentTarget.dataset.typeid + '&shopprice=' + e.currentTarget.dataset.price+'&schemetype=1',
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