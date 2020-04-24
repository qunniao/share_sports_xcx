const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consignee: '',
    phoneNumber: '',
    area: '',
    detailedAddress: '',
    isDefault: 0,
    id:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.item){
      let item = JSON.parse(options.item);
      wx.setNavigationBarTitle({
        title: "编辑收货地址",
      })
      this.setData({
        consignee: item.consignee,
        phoneNumber: item.phoneNumber,
        area: item.area,
        detailedAddress: item.detailedAddress,
        isDefault: item.isDefault,
        id: item.id
      })
    }else{
      wx.setNavigationBarTitle({
        title: "添加收货地址",
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
  switchChange:function(){
    this.setData({
      isDefault: this.data.isDefault == 1?0:1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  saveAddress: function () {
    let id = this.data.id;
    let consignee = this.data.consignee;
    let phoneNumber = this.data.phoneNumber;
    let area = this.data.area;
    let detailedAddress = this.data.detailedAddress;
    let isDefault = this.data.isDefault;
    if (!consignee) {
      app.tipToast(2, "请填写收货人姓名");
      return;
    }
    if (!phoneNumber) {
      app.tipToast(2, "请填写收货人手机号");
      return;
    }
    if (!area) {
      app.tipToast(2, "请选择省市区");
      return;
    }
    if (!detailedAddress) {
      app.tipToast(2, "请输入详细地址");
      return;
    }
    let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
    if (!TEL_REGEXP.test(phoneNumber)) {
      app.tipToast(2, "手机号码输入有误");
      return;
    }
   
    let url="";
    let data={
      consignee: consignee,
      phoneNumber: phoneNumber,
      area: area,
      detailedAddress: detailedAddress,
      isDefault: isDefault,
      userId:wx.getStorageSync('uid')
    }
    if(id){
      url ="/address/updateAddress";

        data = {
          consignee: consignee,
          phoneNumber: phoneNumber,
          area: area,
          id: id,
          detailedAddress: detailedAddress,
          isDefault: isDefault,
          userId: wx.getStorageSync('uid')
        }

    }else{
      url ="/address/insertAddress";
    }
    app._ajax(
      "post",
      url,
      data,
      (data) => {
        app.tipToast(1, data.msg, function () {
          wx.navigateBack({})
        })
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  deleteAddess:function(){
    let id=this.data.id;
    app._ajax(
      "post",
      "/address/deleteAddress",
      {id:id},
      (data) => {
        app.tipToast(1, data.msg, function () {
          wx.navigateBack({})
        })
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )   
  },
  recenamechange:function(e){
    let _this = this;
    let val = e.detail.value
    _this.setData({
      consignee: val
    })
  },
  recephonechange: function (e) {
    let _this = this;
    let val = e.detail.value
    _this.setData({
      phoneNumber: val
    })
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
    var _this = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.getAddressList();
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