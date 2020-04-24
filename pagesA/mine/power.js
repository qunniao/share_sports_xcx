// pages/mine/power.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    levelList: [
      { type: 1, name: "体验会员", img:'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/bc857e5938e44d4e8dbf808e0a04dd35.png'},
      { type: 2, name: "大众会员", img: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/d834c7fc0fc44dcfbb47a7379e76bea9.png' },
      { type: 3, name: "精英会员", img: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/51ad4003bb8b4696aff6a059b68b783c.png' },
      { type: 4, name: "皇家会员", img: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/b1ba4d5d6295494c9818deadbb51edae.png' },
    ],
    level:1,
    dataList: [
      ],
    powerList:[
    ],
    powerdata:[],
    index:0,
    userlevel:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this =this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId:wx.getStorageSync('userId') },
      (data) => {
        let leves = data.data.level;
        if(leves!=0){
          leves = leves-1
        }
        _this.setData({
          userlevel: data.data.level,
          index: leves
        })
        _this.getuserpower()
      },
      (msg) => {
      }
    )  
  },
  gotodetail:function(e){
    wx.navigateTo({
      url: '../mine/powerdetail?powerid=' + e.currentTarget.dataset.id,
    })
  },
  gopurchase:function(){
    let showlevel = this.data.index+1
    wx.navigateTo({
      url: '../../pages/purchase/index?level=' + showlevel,
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

  },
  getuserpower:function(){
    let _this = this;
    app._ajax(
      "post",
      "/coupon/queryPrivilegeCoupon",
      { memberLevel: _this.data.level },
      (data) => {
        let powerlists = data.data
        let hotlist =[]
        for(let i=0;i<powerlists.length;i++){
          if (powerlists[i].isHot==1){
            hotlist.push(powerlists[i])
          }
        }
        _this.setData({
          powerList: hotlist,
          powerdata: powerlists
        })
      },
      (msg) => {
      }
    )  
  },
  swiperchange: function(event){
    this.setData({
      index: event.detail.current,
      level: event.detail.current + 1 
    })
    this.getuserpower()
  }
})