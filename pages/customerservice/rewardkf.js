const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    pjdata: '',
    kfid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      kfid: options.kfid
    })
    // this.getusercity(0, 1)
  },
  patconlist: function () {
    var that = this;
    if (that.data.patconlist_chack_img == false) {
      that.setData({
        patconlist_chack_img: true,
        patconlist_chack_imgs: false
      })
    } else {
      that.setData({
        patconlist_chack_img: false
      })
    }
  },
  patconlists: function () {
    var that = this;
    if (that.data.patconlist_chack_imgs == false) {
      that.setData({
        patconlist_chack_imgs: true,
        patconlist_chack_img: false
      })
    } else {
      that.setData({
        patconlist_chack_imgs: false
      })
    }
  },
  paymentshow: function () {
    this.setData({
      payment: false
    })
  },
  paymentnone: function () {
    var that = this;
    that.setData({
      payment: true
    })
  },
  changekfmoney:function(e){
    this.setData({
      money: e.detail.value
    })
  },
  changelength:function(e){
    this.setData({
      pjdata:e.detail.value,
    })
  },
  givekfmoney:function(e){
    let _this =this;
    if (_this.data.pjdata == '' || _this.data.money==''){
      app.tipToast(2, '打赏金额或是评价为空');
    }else{
      if (_this.data.money < 0.1 || _this.data.money>999){
        app.tipToast(2, '请输入正确的打赏金额');
      }else{
        app._ajax(
          "post",
          "/pay/servicePay",
          {
            userId: wx.getStorageSync('uid'),
            serviceId: _this.data.kfid,
            money: _this.data.money,
            content: _this.data.pjdata
          },
          (data) => {
            wx.requestPayment({

              timeStamp: data.data.timeStamp,
              nonceStr: data.data.nonceStr,
              package: data.data.package,
              signType: 'MD5',
              paySign: data.data.sign,
              success(res) {
                app.tipToast(1, '客服打赏成功', function () {
                  wx.navigateBack()
                })
              },
              fail(res) {
                app.tipToast(2, res)
              }
            })
          },
          (msg) => {
            app.tipToast(2, msg);
          }
        )
      }
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

  //跳转
  navigate: function (e) {
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
      success: function (res) {

      },
    })
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