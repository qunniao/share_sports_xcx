// pages/agent/scheme.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,//1-未使用 2-已使用 3-已过期
    twoprice:'',
    shopid:'',
    oneoperatorId:'',
    onedatas:{},
    typeid:'',
    shoptype:1,
    memlevel:'',
    price:"",
    showprice:'',
    schemecode:'',
    updateTime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    if (options.schemetype==2){
      _this.setData({
        shoptype:2,
        memlevel: options.userlevel
      })
    }
    _this.setData({
      typeid: options.typeid,
      shopid: options.sechmeid,
      oneoperatorId: options.oneoperid,
      price: options.shopprice,
      showprice: options.shopprice
    })
    app._ajax(
      "post",
      "/channelScheme/findByChannelCode",
      {
        channelCode: options.channelcode,
      },
      (data) => {
        _this.setData({
          onedatas:data.data
        })
      }
    )
    app._ajax(
      "post",
      "/channelScheme/findByUserIdAndProductId",
      {
        userId: wx.getStorageSync('uid'),
        productId: options.sechmeid,
      },
      (data) => {
        if(data.code==200&&data.data!=''&&data.data!=null){
          let showprices = Number(_this.data.price) + Number(data.data.profit)
          _this.setData({
            schemecode: data.data.channelCode,
            updateTime: data.data.updateTime,
            showprice: showprices,
            twoprice:data.data.profit
          })
        }
      }
    )
  },
  changprice:function(e){
    let _this=this;
    let showprice = _this.data.price
    if(e.detail.value!=null){
      showprice = Number(e.detail.value) + Number(_this.data.price)
    }
    _this.setData({
      showprice: showprice,
      twoprice: e.detail.value
    })
  },
  checkchange:function(){
    let _this = this;
    if(_this.data.twoprice==''){
      app.tipToast(2,'二级渠道利润未填写')
    }else{
      let pushdata={
        userId: wx.getStorageSync('uid'),
        operatorId: _this.data.oneoperatorId,
        productId: _this.data.shopid,
        profit: _this.data.twoprice,
        type: _this.data.typeid,
        channelPrice: _this.data.showprice
      }
      if (_this.data.shoptype == 2) {
        pushdata.memberLevel = _this.data.memlevel
      }
      app._ajax(
        "post",
        "/channelScheme/editSecondLevel",
        pushdata,
        (data) => {
          if(data.code==200){
            app.tipToast(1, data.msg, function () {
              wx.navigateBack({})
            })
          }
        }
      )
    }
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