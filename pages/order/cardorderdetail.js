// pages/agent/scheme.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderdata: {},
    orderid: '',
    orderNumbers: '',
    payment: true,
    payments: true,
    paytype: '',
    patconlist_chack_img: false,
    patconlist_chack_imgs: false,
    userengry: '',
    ordertype:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderid: options.orderid,
      ordertype: options.typeid
    })
    this.getuserengry()
    this.getorderdetail()
  },
  wanttokf: function (e) {
    wx.navigateTo({
      url: '/pages/customerservice/kfindex',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getuserengry: function () {
    let _this = this;
    app._ajax(
      "post",
      "/order/queryUserEnergyItem",
      {
        type: 0,
        userId: wx.getStorageSync('userId')
      },
      (data) => {
        _this.setData({
          userengry: data.data.userEnergy
        })
      }, (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  paymentnone: function () {
    var that = this;
    that.setData({
      payment: true
    })
  },
  paymentnones: function () {
    var that = this;
    that.setData({
      payments: true
    })
  },
  payshow: function () {
    let _this = this;
      _this.setData({
        payment: false
      })
  },
  orderpaymoney: function () {
    let _this = this;
    app._ajax(
      "post",
      "/pay/orderPay",
      {
        userId: wx.getStorageSync('userId'),
        orderNumber: _this.data.orderNumbers
      },
      (data) => {
        if (data.code == 200) {
          if (data.data == null) {
            _this.getorderdetail()
            _this.setData({
              payments: true
            })
            app.tipToast(1, '付款成功')
          } else {
            wx.requestPayment({

              timeStamp: data.data.timeStamp,
              nonceStr: data.data.nonceStr,
              package: data.data.package,
              signType: 'MD5',
              paySign: data.data.sign,
              success(res) {
                _this.setData({
                  payment: true
                })
                app.tipToast(1, '付款成功');
                _this.getorderdetail()
                _this.setData({
                  payment: true
                })
              },
              fail(res) {
                app.tipToast(2, res);
              }
            })
          }
        }
      }, (msg) => {
        app.tipToast(2, msg);
      }
    )
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
  paynow: function () {
    let _this = this;
    if (_this.data.patconlist_chack_img) {
      _this.orderpaymoney()
    } else {
      app.tipToast(2, '请选择支付方式');
    }
  },
  copydata: function () {
    let _this = this;
    console.log(123)
    wx.setClipboardData({
      data: _this.data.orderdata.orderNumber,
      success(res) {
        app.tipToast(1, '订单编号复制成功');
        // wx.hideToast(); //隐藏复制成功的弹窗提示,根据需求可选
      }
    })
  },
  getorderdetail: function (orderid) {
    let _this = this;
    app._ajax(
      "post",
      "/order/queryDetails",
      {
        orderId : _this.data.orderid,
        type: _this.data.ordertype
      },
      (data) => {
        _this.setData({
          orderNumbers: data.data.orderNumber,
          orderdata: data.data,
        })
        console.log(data)
        console.log(data.data.id)
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
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