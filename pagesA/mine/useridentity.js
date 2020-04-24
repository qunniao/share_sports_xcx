// pages/agent/team.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimage:'',
    showimage:false,
    usercardnum:'',
    usercardnum:'',
    imageList:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  choosePhoto:function(){
    var _this = this;
    wx.showActionSheet({
      itemList: ['从手机相册选择', '拍照'],
      success: function (res) {
        let type = res.tapIndex == 0 ? ['album'] : ['camera']
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: type, // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            var tempFilePaths = res.tempFilePaths;
            var imageList = _this.data.imageList;
            _this.setData({
              imageList: tempFilePaths[0],
              showimage:true
            })
          }
        })
      },
      fail: function (res) {
      }
    })
  },
  tjidcheck:function(){
    let _this=this;
    let regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    if(_this.data.showimage==false||_this.data.username==''||_this.data.usercardnum==''){
      app.tipToast(2, '还要内容未填写')
    }else{
      if (regIdCard.test(_this.data.usercardnum)) {
        wx.uploadFile({
          url: app.api_url + '/user/certification',
          filePath: _this.data.imageList,
          name: 'files',
          formData: {
            userId:wx.getStorageSync('uid'),
            trueName:_this.data.username,
            idCard:_this.data.usercardnum
          },
          success(res) {
            app.tipToast(2, '信息提交成功')
            if (res.statusCode==200){
              wx.navigateBack({})
            }
          }
        })
      } else {
        app.tipToast(2, '身份证号码输入不正确');
      }
    }
  },
  changeusername:function(e){
    this.setData({
      username:e.detail.value
    })
  },
  changeidcardnum:function(e){
    this.setData({
      usercardnum: e.detail.value
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