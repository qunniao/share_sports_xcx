const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 0,
    kflist:[{},{},{}],
    pjdata: '',
    pjlength: 0,
    kfid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      kfid:options.kfid
    })
    // this.getusercity(0, 1)
  },
  changeColor1: function () {
    var that = this;
    that.setData({
      flag: 1
    });
  },
  changeColor2: function () {
    var that = this;
    that.setData({
      flag: 2
    });
  },
  changeColor3: function () {
    var that = this;
    that.setData({
      flag: 3
    });
  },
  changeColor4: function () {
    var that = this;
    that.setData({
      flag: 4
    });
  },
  changeColor5: function () {
    var that = this;
    that.setData({
      flag: 5
    });
  },
  changelength:function(e){
    this.setData({
      pjdata:e.detail.value,
      pjlength: e.detail.value.length
    })
  },
  subcontent:function(e){
    let _this =this;
    if (_this.data.flag==0){
      app.tipToast(2, '评价分数为1-5分');
    }else{
      app._ajax(
        "post",
        "/customerService/insertServiceComment",
        {
          userId: wx.getStorageSync('uid'),
          serviceId: _this.data.kfid,
          level : _this.data.flag,
          content: _this.data.pjdata,
          // solved :1
        },
        (data) => {
          app.tipToast(1, '客服评价成功', function () {
            wx.navigateBack()
          })
        },
        (msg) => {
          app.tipToast(2, msg);
        }
      )
    }
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

  //跳转
  navigate: function (e) {
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
      success: function (res) {

      },
    })
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