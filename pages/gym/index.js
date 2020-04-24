//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    coachList:[],
    cardList:[],
    gymInfo:{},
    userInfo2:{},
    BuildingAll:[],
    SubjectAll:[],
    collect:false,
    shopIds:'',
    callphoneNumber:'',
    phoneshow:false,
    tipsModal: false,
    tipshowtext:'',
    shopjs:'',
  },
  onLoad: function (options) {
    var _this=this;
    this.getGymInfo(options);
    if (options.shopjl!=undefined){
      this.setData({
        shopjs: options.shopjl
      })
    }
    this.setData({
      BuildingAll: wx.getStorageSync('BuildingAll'),
      SubjectAll: wx.getStorageSync('SubjectAll'),
      shopIds:options.id,
    })
    app._ajax(
      "post",
      "/collect/queryByUserIdAndGymShopId",
      { gymShopId: options.id, userId:wx.getStorageSync('userId')},
      (data) => {
        if(data.data!=null){
          _this.setData({
            collect: true,
          })
        }
      }
    ) 
    this.getUserInfo();
    this.getCoachInfo(options);
    this.getCardInfo(options);

  },
  // 拨打电话
  callshowhidden:function(){
    this.setData({
      phoneshow:false
    })
  },
  gojsroom:function(){
    let _this=this;
    wx.openLocation({
      latitude: this.data.gymInfo.latitude,
      longitude: this.data.gymInfo.longitude,
      scale: 18,
      name: _this.data.gymInfo.gymName,
      address: _this.data.gymInfo.address
    })
  },
  getGymInfo: function (options){
    var _this=this;
    app._ajax(
      "post",
      "/gymshop/queryByGymShopId",
      {gymShopId: options.id},
      (data)=>{
      _this.setData({
        gymInfo: data.data,
      })
      _this.getuserjl()
      }
    )     
  },
  gotoshopimgs:function(){
    wx.navigateTo({
      url: '/pages/gym/gymshopicdetail?shopId=' + this.data.shopIds,
    })
  },
  getuserjl(){
    let _this = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitudes = res.latitude
        const longitudes = res.longitude
        let datalist = _this.data.gymInfo
        function distanceByLnglat(lng1, lat1, lng2, lat2) {
          var radLat1 = Rad(lat1);
          var radLat2 = Rad(lat2);
          var a = radLat1 - radLat2;
          var b = Rad(lng1) - Rad(lng2);
          var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
          s = s * 6378137.0; // 取WGS84标准参考椭球中的地球长半径(单位:m)
          s = Math.round(s * 10000) / 10000;
          return s
          // //下面为两点间空间距离（非球面体）
          // var value= Math.pow(Math.pow(lng1-lng2,2)+Math.pow(lat1-lat2,2),1/2);
          // alert(value);
        }

        function Rad(d) {
          return d * Math.PI / 180.0;
        }
        let distance = distanceByLnglat(longitudes,latitudes, datalist.longitude, datalist.latitude)
        let shopdata = datalist
        if (distance > 1000) {
          distance = distance / 1000
          distance = distance.toFixed(1) + 'km'
        } else {
          distance = distance.toFixed(1) + 'm'
        }

        shopdata.distancelength = distance
        _this.setData({
          shopjs: distance
        })
      }
    }) 
  },
  gorecharge:function(){
    wx.navigateTo({
      url: '../../pagesA/recharge/recharge',
    })
  },
  getCoachInfo: function (options){
    var _this=this;
    app._ajax(
      "post",
      "/gymshop/queryCoachUserByGymShopId",
      {gymShopId: options.id},
      (data)=>{
      _this.setData({
        coachList: data.data,
      })}
    )    
  },

  getCardInfo: function (options){
    var _this = this;
    app._ajax(
      "post",
      "/gymshop/queryCardTypePOByGymShopId",
      {gymShopId: options.id},
      (data)=>{
      _this.setData({
        cardList: data.data,
      })}
    )    
  },


  getUserInfo:function(){
    var _this=this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      {userId:wx.getStorageSync('userId')},
      (data)=>{
      _this.setData({
        userInfo2: data.data,
      })}
    )    
  },
  /**
    * 生命周期函数--监听页面卸载
    */
  onUnload: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    let pages = getCurrentPages(); //页面栈
    if (pages.length== 2) {
      let currPage = pages[0]; //当前页面
      currPage.getSportsStatu();
    }
  },
  closeModal: function () {
    this.setData({
      tipsModal: false,
    })
  },
  operatorBtn: function (e) {
    this.closeModal();
    wx.navigateTo({
      //目的页面地址
      url: "/pages/purchase/index"
    })
  },
  //扫码
  scanCode: function (e) {
    let id = this.data.gymInfo.gymShopId;
    if (this.data.userInfo2.level == 0) {
      this.setData({
        tipsModal: true,
        tipshowtext:2
      })
      return;
    }
    wx.scanCode({
      success(res) {
        app._ajax(
          "post",
          "/gymshop/startGym",
          {
            code: res.result
          },
          (data) => {
            wx.navigateTo({
              url: '../scan/scan?id=' + data.data.gymShopId,
            })
          },
          (msg) => {
            app.tipToast(2, msg);
          }
        )
      }
    })
    // wx.navigateTo({
    //   url: '../scan/scan?id=' + id, 
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
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
  navigatecard: function (e) {
    let id = this.data.gymInfo.gymShopId;
    if (this.data.userInfo2.level == 0) {
      this.setData({
        tipsModal: true,
        tipshowtext:1
      })
      return;
    }
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
      success: function (res) {

      },
    })
  },
  navigatejl: function (e) {
    wx.navigateTo({
      url: '/pages/gym/coach?jlid=' + e.currentTarget.dataset.id + '&uid=' + e.currentTarget.dataset.uid,
    })
  },
  callPhoneok: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.callphoneNumber + '' // 仅为示例，并非真实的电话号码
    })
  },
  callPhone: function (e) {
    let _this = this;
    _this.setData({
      phoneshow: true,
      callphoneNumber: e.currentTarget.dataset.number // 仅为示例，并非真实的电话号码
    })
  },
  collectBtn: function (e) {
    let _this=this;
    if (this.data.collect) {
      app._ajax(
        "post",
        "/collect/deleteCollectPO",
        { gymShopId: this.data.shopIds, type: 1, userId: wx.getStorageSync('userId') },
        (data) => {
          if (data.code == 200) {
            _this.setData({
              collect: false,
            })
          }
        }
      ) 
    } else {
      app._ajax(
        "post",
        "/collect/addCollectPO",
        { gymShopId: this.data.shopIds,type:1, userId: wx.getStorageSync('userId') },
        (data) => {
          if (data.code==200) {
            _this.setData({
              collect: true,
            })
          }
        }
      ) 
    }
  //  this.setData({
  //    collect:!this.data.collect
  //  })
  },
  onShareAppMessage: function (res) {
    let _this = this;
    return {
      title: '分享',
      path: '/pages/gym/index?id=' + _this.data.shopIds + '&shopjl=' + _this.data.shopjs,
      // imageUrl: 'https://......./img/groupshare.png',  //用户分享出去的自定义图片大小为5:4,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
      },
    }
  },
})
