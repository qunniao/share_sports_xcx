// pages/recharge.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    price: '',
    text: '补能量值差额',
    payment:true,
    dataList: [
      { id: 1, price: 2000, power: 400, text: '（升级为大众会员）' },
      { id: 2, price: 5000, power: 1000, text: '（升级为精英会员）' },
      { id: 3, price: 10000, power: 2000, text: '（升级为皇家会员）' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nowmoney = options.money*5
    this.setData({
      price: nowmoney
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  changeprice: function (e) {
    console.log(e)
    this.setData({
      price: e.detail.value
    })
  },
  chooseMember: function (e) {
    this.setData({
      price: e.currentTarget.dataset.value,
      type: e.currentTarget.dataset.type,
      value: e.currentTarget.dataset.value,
      text: e.currentTarget.dataset.text
    })
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
  paynow: function (e) {
    let _this = this;
    if (_this.data.price != '') {
      let _this = this;
      if (_this.data.patconlist_chack_img) {
        app._ajax(
          "post",
          "/order/energyRecharge",
          { money: _this.data.price, userId: wx.getStorageSync('userId') },
          (data) => {
            if (data.code == 200) {
              app._ajax(
                "post",
                // "/pay/wxPayOrder",   
                "/pay/orderPay",
                { orderNumber: data.data, userId: wx.getStorageSync('userId') },
                (data) => {
                  wx.requestPayment({

                    timeStamp: data.data.timeStamp,
                    nonceStr: data.data.nonceStr,
                    package: data.data.package,
                    signType: 'MD5',
                    paySign: data.data.sign,
                    success(res) {
                      app.tipToast(1, '充值成功', function () {
                        wx.navigateBack({})
                      })
                    },
                    fail(res) {
                      app.tipToast(2, res)
                    }
                  })
                }
              )
            }
          },
          (msg) => {
            app.tipToast(2, msg);
          }
        )
      }else {
        app.tipToast(2, '请选择支付方式');
      }
    }
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