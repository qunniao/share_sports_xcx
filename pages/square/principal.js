// pages/square/principal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[
      { name: 1, follow: true, fabulous: true, chat: true, create_time:"2019-04-18 21:30"},
      { name: "奶黄包2", follow: true, fabulous: false, chat: true, create_time: "2019-04-18 21:30"},
    ],
    userdata:{},
    showtype:2,
    usergxqm:'',
    follow:false,
    userids:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.userId)
    this.getourgroup(options.userId)
    let _this = this;
    if (options.usertype == 1) {
      _this.setData({
        showtype:1,
        userids: options.userId
      })
      _this.getusergz(options.userId)
    }
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: options.userId },
      (res) => {
        _this.setData({
          userdata: res.data
        })
      })
    app._ajax(
      "post",
      "/user/queryUserAdditionPOByUserId",
      { userId: options.userId },
      (ress) => {
        console.log(ress.data)
        if(ress.data!=null){
          _this.setData({
            usergxqm: ress.data.signature
          })
        }
      })
  },
  getusergz:function(userids){
    let _this =this;
    app._ajax(
      "post",
      "/group/isFollow",
      { followUserId: userids, userId:wx.getStorageSync('userId')},
      (res) => {
        console.log(res.data)
        if (res.data) {
          _this.setData({
            follow: true
          })
        }else{
          _this.setData({
            follow: false
          })
        }
      })
  },
  followthis:function(){
    let _this=this;
    if (_this.data.follow) {
      app._ajax(
        "post",
        "/group/unFollowUser",
        { userId: wx.getStorageSync('userId'), followUserId: _this.data.userids },
        (res) => {
          _this.getusergz()
        }, (msg) => {
          app.tipToast(2, msg);
        }
      )
    } else {
      app._ajax(
        "post",
        "/group/followUser",
        { userId: wx.getStorageSync('userId'), followUserId: _this.data.userids },
        (res) => {
          _this.getusergz()
        }, (msg) => {
          app.tipToast(2, msg);
        }
      )
    }
  },
  getourgroup:function(userIds){
    let _this =this;
    app._ajax(
      "post",
      "/group/pageFriendGroup",
      { userId: userIds},
      (res) => {
        let ourdata = res.data.content;
        console.log(ourdata)
        for (let i = 0; i < ourdata.length; i++) {
          let createt = ourdata[i].createTime
            .split(' ')[0]
          let createlist = createt.split('-')
          ourdata[i].createlist = createlist;
        }
        _this.setData({
          dataList:ourdata
        })
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  navigate: function (e) {
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
      success: function (res) {

      },
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