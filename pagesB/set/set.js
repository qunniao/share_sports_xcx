const app = getApp()
// pages/set/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoplist: [
    ],
    addressdetail: {},
    count: 1,
    price: 308,
    zongprice: 208,
    ordertype: 0,
    positionnone: false,
    positionshow: true,
    payment: true,
    patconlist_chack_img: false,
    patconlist_chack_imgs: false,
    payments: true,
    detailadrees: {},
    detailadreesshow: 2,
    shoparrlist: [],
    settlementType: 1,
    couponlist: [],
    firstprice:'',
    payshopId:'',
    couponId:'',
    userengry:'',
    coupontext:'使用优惠券'
  },
  getcanuser:function(type,price){
    let _this=this;
    app._ajax(
      "post",
      "/coupon/queryCoupons",
      { userId: wx.getStorageSync('userId'), totalPrices: price, type: type  },
      (data) => {
        let couponlists =data.data;
        for(let i =0;i<couponlists.length;i++){
          couponlists[i].checked=false
        }
        _this.setData({
          couponlist: couponlists
        })
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.getuserengry()
    // _this.setData({
    //   settlementType: options.settlementType
    // })
    // _this.getcoupon(options.settlementType)
    if (options.shoptype == 2) {
      app._ajax(
        "post",
        "/product/findById",
        { id: options.productId },
        (data) => {
          if (data.code == 200) {
            let shoplists = [{
              shopid: options.productId,
              shoplist_img: data.data.image,
              title: data.data.name,
              price: data.data.realPrice,
              num: options.number,
              style: options.style,
              settlementType: options.settlementType
            }]
            let allprice = Number(data.data.realPrice) * Number(options.number)
            _this.getcanuser(options.settlementType, allprice)
            let zongprices =allprice
            if (options.settlementType==1){
              if (zongprices < 100) {
                zongprices += 10
              }
            }else{
              if (zongprices < 20) {
                zongprices += 2
              }
            }
            _this.setData({
              shoplist: shoplists,
              price: allprice,
              firstprice: zongprices,
              zongprice: zongprices,
              ordertype: options.shoptype,
              settlementType: options.settlementType
            })
          }
        }, (msg) => {
          app.tipToast(2, msg);
        }
      )
    } else if (options.shoptype == 1) {
      let shoparr = options.payshoids.split(',');
      for (let i = 0; i < shoparr.length; i++) {
        shoparr[i] = Number(shoparr[i])
      }
      app._ajax(
        "post",
        "/cart/queryCart",
        {
          userId: Number(wx.getStorageSync('uid')),
          settlementType: Number(options.settlementType),
          cartIds: options.payshoids
        },
        (data) => {
          let shoplists = [];
          let allprice = 0;
          for (let i = 0; i < data.data.length; i++) {
            let shoplist = {
              shoplist_img: data.data[i].productPO.image,
              title: data.data[i].productPO.name,
              price: data.data[i].productPO.realPrice,
              num: data.data[i].number,
              settlementType: options.settlementType
            }
            shoplists.push(shoplist)
            allprice += Number(data.data[i].productPO.realPrice) * Number(data.data[i].number)
          }
          _this.getcanuser(options.settlementType, allprice)
          let zongprices = allprice;
          if (options.settlementType == 1) {
            if (zongprices < 100) {
              zongprices += 10
            }
          } else {
            if (zongprices < 20) {
              zongprices += 2
            }
          }
          _this.setData({
            shoplist: shoplists,
            price: allprice,
            zongprice: zongprices,
            firstprice: zongprices,
            settlementType: options.settlementType,
            ordertype: options.shoptype,
            shoparrlist: shoparr,
            count: shoplists.length
          })
        }, (msg) => {
          app.tipToast(2, msg);
        }
      )
    }
  },
  getuserengry:function(){
    let _this=this;
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
  getcoupon: function (num) {
    let _this = this;
    let coupondata = {
      userId: wx.getStorageSync('userId'),
      status: 1,
      pageNum: 1,
      pageSize: 20,
      type: 3
    }
    if (num == 2) {
      coupondata.type = 1
    }
    app._ajax(
      "post",
      "/coupon/pageCouponOperation",
      coupondata,
      (data) => {
        _this.setData({
          couponlist: data.data.content
        })
      }, (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  zhifu: function () {
    var that = this;
    if (that.data.ordertype == 2) {
      if (that.data.settlementType==1){
        if (that.data.detailadrees.area == undefined || that.data.addressdetail.detailedAddress == undefined || that.data.addressdetail.id == undefined){
          app.tipToast(2, '收货地址未选择');
        }else{
          let orderdeatil = {
            productInfo: [{ productId: Number(that.data.shoplist[0].shopid), number: Number(that.data.shoplist[0].num), style: that.data.shoplist[0].style }],
            addressId: Number(that.data.addressdetail.id),
            userId: Number(wx.getStorageSync('uid')),
            contactName: that.data.addressdetail.consignee,
            phone: that.data.addressdetail.phoneNumber,
            couponId: that.data.couponId,
            address: that.data.detailadrees.area + that.data.addressdetail.detailedAddress,
            settlementType: Number(that.data.settlementType),
          }
          app._ajaxjson(
            "post",
            "/shopOrder/submitOrder",
            orderdeatil,
            (data) => {
              if (data.code == 200) {
                that.setData({
                  payshopId: data.data,
                  payment: false
                })
              }
            }, (msg) => {
              app.tipToast(2, msg);
            }
          )
        }
        
      }else{
        if (that.data.detailadrees.area == undefined || that.data.addressdetail.detailedAddress == undefined || that.data.addressdetail.id == undefined ){
          app.tipToast(2, '收货地址未选择');
        } else {
          let orderdeatil = {
            productInfo: [{ productId: Number(that.data.shoplist[0].shopid), number: Number(that.data.shoplist[0].num), style: that.data.shoplist[0].style }],
            addressId: Number(that.data.addressdetail.id),
            userId: Number(wx.getStorageSync('uid')),
            contactName: that.data.addressdetail.consignee,
            phone: that.data.addressdetail.phoneNumber,
            couponId: that.data.couponId,
            address: that.data.detailadrees.area + that.data.addressdetail.detailedAddress,
            settlementType: Number(that.data.settlementType),
          }
          app._ajaxjson(
            "post",
            "/shopOrder/submitOrder",
            orderdeatil,
            (data) => {
              if (data.code == 200) {
                that.setData({
                  payshopId: data.data,
                  payments: false
                })
              }
            }, (msg) => {
              app.tipToast(2, msg);
            }
          )
        }
      }
    } else if (that.data.ordertype == 1) {
      if (that.data.detailadrees.area == undefined || that.data.addressdetail.detailedAddress == undefined || that.data.addressdetail.id == undefined) {
        app.tipToast(2, '收货地址未选择');
      } else {
        if (that.data.settlementType == 1) {
          let shoplists = '';
          for (let i = 0; i < that.data.shoparrlist.length; i++) {
            if (i + 1 != that.data.shoparrlist.length) {
              shoplists += that.data.shoparrlist[i] + ','
            } else {
              shoplists += that.data.shoparrlist[i]
            }
          }
          let orderdeatiltwo = {
            cartIds: shoplists,
            addressId: Number(that.data.addressdetail.id),
            userId: Number(wx.getStorageSync('uid')),
            couponId: that.data.couponId,
            contactName: that.data.addressdetail.consignee,
            phone: that.data.addressdetail.phoneNumber,
            address: that.data.detailadrees.area + that.data.addressdetail.detailedAddress,
            settlementType: Number(that.data.settlementType),
          }
          app._ajax(
            "post",
            "/shopOrder/submitCart",
            orderdeatiltwo,
            (data) => {
              if (data.code == 200) {
                that.setData({
                  payshopId: data.data,
                  payment: false
                })
              }
            }, (msg) => {
              app.tipToast(2, msg);
            }
          )
        } else {
          let shoplists = '';
          for (let i = 0; i < that.data.shoparrlist.length; i++) {
            if (i + 1 != that.data.shoparrlist.length) {
              shoplists += that.data.shoparrlist[i] + ','
            } else {
              shoplists += that.data.shoparrlist[i]
            }
          }
          let orderdeatiltwo = {
            cartIds: shoplists,
            addressId: Number(that.data.addressdetail.id),
            userId: Number(wx.getStorageSync('uid')),
            couponId: that.data.couponId,
            contactName: that.data.addressdetail.consignee,
            phone: that.data.addressdetail.phoneNumber,
            address: that.data.detailadrees.area + that.data.addressdetail.detailedAddress,
            settlementType: Number(that.data.settlementType),
          }
          app._ajax(
            "post",
            "/shopOrder/submitCart",
            orderdeatiltwo,
            (data) => {
              if (data.code == 200) {
                that.setData({
                  payshopId: data.data,
                  payments: false
                })
              }
            }, (msg) => {
              app.tipToast(2, msg);
            }
          )
          // that.setData({
          //   payments: false
          // })
        }
      }
      
    }
  },
  paynow: function () {
    let _this=this;
    if (_this.data.patconlist_chack_img){
      app._ajax(
        "post",
        "/pay/wxPayOrder",
        {
          userId: wx.getStorageSync('userId'),
          orderNumber: _this.data.payshopId
        },
        (data) => {
          if (data.code == 200) {
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
                wx.navigateTo({
                  url: '/pages/order/order',
                })
              },
              fail(res) {
                console.log(res)
                app.tipToast(2, res);
              }
            })
          }
        }, (msg) => {
          app.tipToast(2, msg);
        }
      )
    } else{
      app.tipToast(2, '请选择支付方式');
    }
  },
  buyshop: function () {
    let _this = this;
      app._ajax(
        "post",
        "/pay/wxPayOrder",
        {
          userId: wx.getStorageSync('userId'),
          orderNumber: _this.data.payshopId
        },
        (data) => {
          if (data.code == 200) {
            app.tipToast(1, '付款成功');
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
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
  paymentnones: function () {
    var that = this;
    that.setData({
      payments: true
    })
  },
  radioChange:function(e){
    let _this = this;
    let yhqlist = _this.data.couponlist;
    for (let i = 0; i < yhqlist.length; i++) {
      yhqlist[i].checked = false
      if(yhqlist[i].id==e.detail.value){
        yhqlist[i].checked = true
      }
    }
    this.setData({
      couponlist: yhqlist,
    })
  },
  changecouponok:function(){
    let _this = this;
    let changeprice = _this.data.firstprice
    let yhqlist = _this.data.couponlist;
    for (let i = 0; i < yhqlist.length; i++) {
      if (yhqlist[i].checked) {
        let nowprice = changeprice - yhqlist[i].price
        _this.setData({
          couponId: yhqlist[i].id,
          coupontext: yhqlist[i].title,
          zongprice:nowprice
        })
      }
    }
    _this.setData({
      couponshow: false
    })
  },
  // 优惠券弹窗
  changecouponshow: function () {
    let _this =this;
    let yhqlist = _this.data.couponlist;
    for(let i=0;i<yhqlist.length;i++){
      yhqlist[i].checked=false
    }
    this.setData({
      couponlist: yhqlist,
      couponshow: false
    })
  },
  couponchangeshow: function () {
    this.setData({
      couponshow: true
    })
  },
  Goposition: function () {
    wx.navigateTo({
      url: '../position/position'
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
  getfindAddress: function () {
    let _this = this;
    app._ajax(
      "post",
      "/address/findAddressBySetDefault",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        if (data.data != '' && data.data != null) {
          this.setData({
            detailadreesshow: 1,
            detailadrees: data.data,
            addressdetail: data.data
          })
        } else {
          this.setData({
            detailadreesshow: 2,
          })
        }
      }, (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  onShow: function () {
    this.getfindAddress()
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