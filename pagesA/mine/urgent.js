// pages/mine/urgent.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urgetname:'',
    urgetphone:''
  },
  changeurgetname:function(e){
    this.setData({
      urgetname: e.detail.value
    })
  },
  changeurgetphone:function(e){
    this.setData({
      urgetphone: e.detail.value
    })
  },
  saveeurget:function(){
    let _this =this;
    if (_this.data.urgetphone == '' || _this.data.urgetname==''){
      app.tipToast(2,'还有信息未填写')
    }else{
      let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      if (TEL_REGEXP.test(_this.data.urgetphone)) {
        app._ajax(
          "post",
          "/user/updateCrashUser",
          { userId: wx.getStorageSync('userId'), crashName: _this.data.urgetname, crashUserPhone: _this.data.urgetphone },
          (data) => {
            app.tipToast(1, data.msg, function () {
              wx.navigateBack({})
            })
          }, (msg) => {
            app.tipToast(2, msg)
          }
        ) 
      }else{
        app.tipToast(2,'手机号码输入有误')
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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