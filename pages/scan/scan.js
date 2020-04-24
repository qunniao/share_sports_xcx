const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: '',//定时器名字
    type:1,
    status:false,//false-未开始 true-开始
    countdown:0,
    scanModal:false,
    countdown2:0,
    userInfo2:{},
    gymInfo:{},
    imagesList:[],
    scanshow:0,
    tititle:'',
    latitude:'',
    longitude:'',
    gymshopid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imagesList: wx.getStorageSync('imagesList'),
      gymshopid:options.id
    })
    this.getUserInfo();
    var _this = this;
    app._ajax(
      "post",
      "/gymshop/queryGymFitnessRecordPOByUserId",
      {userId:wx.getStorageSync('userId')},
      (data) => {
        _this.setData({
          status: true,
          countdown2: data.data.second
        })
        _this.getGymshopInfo(data.data.gymShopId);
        if (data.data.userType==1){
          _this.countDown();
        } else if (data.data.userType == 2){
          _this.setData({
            scanModal:true,
            scanshow:1,
            countdown: data.data.second
          })
        }
      }, (msg) => {
        _this.getGymshopInfo(options.id);
      }
    )     
  },
  endgymbtn:function(e){
    var _this = this;
    let userlatitude='';
    let userlongitude='';
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        userlatitude = res.latitude
        userlongitude = res.longitude
        app._ajax(
          "post",
          "/gymshop/addUserEndGym",
          {
            userId: wx.getStorageSync('userId'),
            lat: userlatitude,
            lnt: userlongitude
          },
          (data) => {
            if (data.code == 200) {
              _this.setData({
                scanshow: 2,
                status: false
              })
              app.tipToast(1, '核销成功');
              _this.getUserInfo();
            }
          }, (msg) => {
            app.tipToast(2, msg);
          }
        )
      }
    })
  },
  callphone:function(){
    app._ajax(
      "post",
      "/user/queryUserAdditionPOByUserId",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        if (data.data != null) {
          if (data.data.crashUserPhone == null || data.data.crashUserPhone==''){
            app.tipToast(2, '未设置紧急联系人')
          }else{
            let callphone = '' + data.data.crashUserPhone
            wx.makePhoneCall({
              phoneNumber: callphone //仅为示例，并非真实的电话号码
            })
          }
        }else{
          app.tipToast(2,'未设置紧急联系人')
        }
      })
  },
  getGymshopInfo: function (id) {
    var _this = this;
    app._ajax(
      "post",
      "/gymshop/queryByGymShopId",
      {
        gymShopId: id
      },
      (data) => {
        _this.setData({
          gymInfo: data.data,
          latitude: data.data.latitude,
          longitude: data.data.longitude
        })
        wx.setNavigationBarTitle({
          title: data.data.gymName
        })
      }
    )
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getUserInfo: function () {
    var _this = this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      {userId:wx.getStorageSync('userId')},
      (data) => {
        _this.setData({
          userInfo2: data.data,
        })
      }, (msg) => {
        app.tipToast(2, msg);
      }
    )
  },

  chooseNumber: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type,
    })
  },

  countDown: function () {
    var _this = this;
    let countdown2 = _this.data.countdown2;
    _this.setData({
      timer: setInterval(function () {
        countdown2++;
        _this.setData({
          countdown2: countdown2
        })
      }, 1000)
    })
  },

  start:function(){
    var _this=this;
    let lat=0;
    let lnt=0;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        lat = res.latitude
        lnt = res.longitude
        if (!_this.data.status) {
          app._ajax(
            "post",
            "/gymshop/addStratGym",
            {
              peopleNum: _this.data.type,
              gymShopId: _this.data.gymshopid,
              lat: lat,
              lnt: lnt,
              userId: wx.getStorageSync('userId')
            },
            (data) => {
              _this.setData({
                status: true
              })
              _this.countDown();
              _this.getUserInfo();
            }, (msg) => {
              app.tipToast(2, msg);
            }
          )
        } else {
          wx.scanCode({
            success(res) {
              console.log(res.result);
              app._ajax(
                "post",
                "/gymshop/addEndGym",
                {
                  userId: wx.getStorageSync('userId'),
                  code: res.result
                },
                (data) => {
                  if (data.code == 200) {
                    clearInterval(_this.data.timer);
                    _this.setData({
                      scanModal: true,
                      status: false,
                      countdown: data.data.second,
                      countdown2: 0,
                      scanshow: 1
                    })
                    _this.getUserInfo();
                  }
                  app.tipToast(1, '健身结束');
                }, (msg) => {
                  app.tipToast(2, msg);
                }
              )
            }
          })
        }
      }
    })
    

  },
  closeModal: function (e) {
    this.setData({
      scanModal: false,
    })
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
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    let pages = getCurrentPages(); //页面栈
    if (pages.length == 2) {
      let currPage = pages[0]; //当前页面
      currPage.getSportsStatu();
    }
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