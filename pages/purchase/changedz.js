const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: '',
    detailedAddress: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this =this;
    console.log(options.dzadress)
    if (options.dzadress != undefined && options.dzadress!=''){
      let adresedetail = options.dzadress.split(' ')
      _this.setData({
        area: adresedetail[0],
        detailedAddress: adresedetail[1]
      })
    }
  },
  goodspos: function (e) {
    let value = e.detail.value;
    let values = value[0] + '-' + value[1] + '-' + value[2];
    this.setData({
      area: values
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  saveAddress: function () {
    let id = this.data.id;
    let area = this.data.area;
    let detailedAddress = this.data.detailedAddress;
    if (!area) {
      app.tipToast(2, "请选择省市区");
      return;
    }
    if (!detailedAddress) {
      app.tipToast(2, "请输入详细地址");
      return;
    }
    console.log(area)
    console.log(detailedAddress)
    let useradress = area + ' ' + detailedAddress
    var pages = getCurrentPages(); // 当前页面
    var beforePage = pages[pages.length - 2]; // 前一个页面
    // console.log("beforePage");
    // console.log(beforePage);
    wx.navigateBack({
      success: function () {
        beforePage.changeadress(useradress); // 执行前一个页面的onLoad方法
      }
    });
  },
  deleteAddess: function () {
    wx.navigateBack({})
  },
  receadreesschange: function (e) {
    let _this = this;
    let val = e.detail.value
    _this.setData({
      detailedAddress: val
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
    // var _this = this;
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    // var prevPage = pages[pages.length - 2];  //上一个页面
    // prevPage.getAddressList();
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