//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    power_1: false,
    power_2: false,
    power_3: false,
    userdata:'',
    pageNum:1,
    levedata:[],
    coupondata:[]
  },
  onLoad: function () {
    var _this = this;
    _this.getlevel()
    _this.pageCoupon()
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId')},
      (data) => {
        _this.setData({
          userdata: data.data
        })
      },
      (msg) => {

      }
    ) 
  },
  gotoshop:function(){
    wx.navigateTo({
      url: '/pages/index/index?type=1&shoptype=6',
    })
  },
  chooseType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },
  pageCoupon: function (e) {
    var _this = this;
    let datas = {
      userId: wx.getStorageSync("userId"),
      pageNum: _this.data.pageNum,
      pageSize: 10,
      type: 2
    }
    app._ajax(
      "post",
      "/coupon/pageCouponOperation",
      datas,
      (res) => {
        _this.setData({
          coupondata: res.data.content
        })
      }, (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  getlevel: function () {
    let _this = this;
    app._ajax(
      "post",
      "/member/querySysMember",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        let levedatas = []
        for (let i = 0; i < data.data.length; i++) {
          levedatas.push(data.data[i])
        }
        _this.setData({
          levedata: levedatas,
        })
      }, (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  gomember:function(){
    wx.navigateTo({
      url: '../../pages/purchase/index',
    })
  },
  switch: function (e) {
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        handlingBtn: !this.data.handlingBtn
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        power_1: !this.data.power_1
      })
    } else if (e.currentTarget.dataset.type == 3) {
      this.setData({
        power_2: !this.data.power_2
      })
    } else if (e.currentTarget.dataset.type == 4) {
      this.setData({
        power_3: !this.data.power_3
      })
    }
  },
})
