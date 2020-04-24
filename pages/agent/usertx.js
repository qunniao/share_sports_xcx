// pages/agent/team.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    surplusmoney:0,
    gettype:1,
    getuserprice:'',
    username:'',
    useraccount:'',
    checkaccount:'',
    modalHidden:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getusermoney()
    this.setData({
      gettype:options.gettype
    })
  },
  getusermoney: function () {
    let _this=this;
    app._ajax(
      "post",
      "/commission/queryWithdraw",
      { agentId: wx.getStorageSync('uid') },
      (data) => {
        _this.setData({
          surplusmoney: data.data.canCarry
        })
      })
  },
  changeuserprice:function(e){
    this.setData({
      getuserprice: e.detail.value
    })
  },
  changeusername:function(e){
    this.setData({
      username:e.detail.value
    })
  },
  changeuseraccount: function (e) {
    this.setData({
      useraccount: e.detail.value
    })
  },
  changecheckuseraccount: function (e) {
    this.setData({
      checkaccount: e.detail.value
    })
  },
  gotolast:function(){
    let _this =this;
    if (_this.data.username == '' || _this.data.useraccount == '' || _this.data.checkaccount == '' || _this.data.getuserprice==''){
      app.tipToast(2, '还有信息未填写')
    }else{
      if (_this.data.getuserprice <= _this.data.surplusmoney){
        if (_this.data.useraccount == _this.data.checkaccount) {
          _this.setData({
            modalHidden: false
          })
        } else {
          app.tipToast(2, '两次输入账号不一致')
        }
      }else{
        app.tipToast(2, '提现金额不能大于可提现金额')
      }
    }
  },
  /**
 * 点击取消
 */
  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },

  /**
   *  点击确认
   */
  modalConfirm: function () {
    // do something
    let _this =this;
      app._ajax(
        "post",
        "/withdraw/requestWithdrawal",
        { userId: wx.getStorageSync('uid'), amount: _this.data.getuserprice, trueName: _this.data.username, account: _this.data.useraccount, type: _this.data.gettype },
        (data) => {
          if (data.code == 200) {
            app.tipToast(1, '成功提现')
            _this.setData({
            modalHidden: true
          })
            wx.navigateBack({})
          }
        }, (msg) => {
          app.tipToast(2, msg)
          _this.setData({
            modalHidden: true
          })
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

  }
})