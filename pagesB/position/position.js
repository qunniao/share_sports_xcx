const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poslist: [
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressList();
  },
  //跳转
  navigate: function (e) {
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
    })
  },
  navigate2: function (e) {
    let item = JSON.stringify(e.currentTarget.dataset.value);
    wx.navigateTo({
      //目的页面地址
      url: "../editpos/editpos?item=" + item,
    })
  },
  changeadress:function(e){
    // wx.showModal({
    //   title: '提示',
    //   content: '您确定选择该收货地址',
    //   success(res) {
    //     if (res.confirm) {
          let nowadress = e.currentTarget.dataset.adress
          let data = {
            consignee: nowadress.consignee,
            phoneNumber: nowadress.phoneNumber,
            area: nowadress.area,
            id: nowadress.id,
            detailedAddress: nowadress.detailedAddress,
            isDefault: 1,
            userId: wx.getStorageSync('uid')
          }
          app._ajax(
            "post",
            "/address/updateAddress",
            data,
            (data) => {
              app.tipToast(1, data.msg, function () {
                wx.navigateBack({})
              })
            },
            (msg) => {
              app.tipToast(2, msg);
            }
          )
        // }
    //   }
    // })
  },
  getAddressList:function(){
    var _this=this;
    app._ajax(
      "post",
      "/address/queryAddress",
      {userId:wx.getStorageSync('uid')},
      (res) => {
        this.setData({
          poslist:res.data,
        })
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