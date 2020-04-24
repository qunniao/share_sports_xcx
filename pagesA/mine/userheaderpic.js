// pagesA/mine/userheaderpic.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageshow: '../../res/imgs/default.jpg',
    userheaderpicone: [{ url: '../headportrait/headportrait03.png' }, { url: '../headportrait/headportrait11.png' }, { url: '../headportrait/headportrait12.png' }, { url: '../headportrait/headportrait22.png' }, { url: '../headportrait/headportrait23.png' }, { url: '../headportrait/headportrait31.png' }, { url: '../headportrait/headportrait32.png' }, { url: '../headportrait/headportrait41.png' }, { url: '../headportrait/headportrait42.png' }, { url: '../headportrait/headportrait59.png' }, { url: '../headportrait/headportrait57.png' }, { url: '../headportrait/headportrait52.png' }, { url: '../headportrait/headportrait06.png' }, { url: '../headportrait/headportrait17.png' }, { url: '../headportrait/headportrait27.png' }, { url: '../headportrait/headportrait46.png' }],
    userheaderpictwo: [{ url: '../headportrait/headportrait24.png' }, { url: '../headportrait/headportrait43.png' }, { url: '../headportrait/headportrait02.png' }, { url: '../headportrait/headportrait37.png' }, { url: '../headportrait/headportrait30.png' }, { url: '../headportrait/headportrait60.png' }, { url: '../headportrait/headportrait10.png' }, { url: '../headportrait/headportrait47.png' }, { url: '../headportrait/headportrait33.png' }, { url: '../headportrait/headportrait50.png' }, { url: '../headportrait/headportrait13.png' }, { url: '../headportrait/headportrait21.png' }, { url: '../headportrait/headportrait40.png' }, { url: '../headportrait/headportrait53.png' }, { url: '../headportrait/headportrait16.png' }],
    userheaderpicthree: [{ url: '../headportrait/headportrait34.png' }, { url: '../headportrait/headportrait51.png' }, { url: '../headportrait/headportrait54.png' }, { url: '../headportrait/headportrait09.png' }, { url: '../headportrait/headportrait04.png' }, { url: '../headportrait/headportrait39.png' }, { url: '../headportrait/headportrait14.png' }, { url: '../headportrait/headportrait25.png' }, { url: '../headportrait/headportrait61.png' }, { url: '../headportrait/headportrait44.png' }, { url: '../headportrait/headportrait29.png' }, { url: '../headportrait/headportrait36.png' }, { url: '../headportrait/headportrait20.png' }, { url: '../headportrait/headportrait49.png' }, { url: '../headportrait/headportrait48.png' }],
    userheaderpicfour: [{ url: '../headportrait/headportrait19.png' }, { url: '../headportrait/headportrait15.png' }, { url: '../headportrait/headportrait05.png' }, { url: '../headportrait/headportrait08.png' }, { url: '../headportrait/headportrait07.png' }, { url: '../headportrait/headportrait18.png' }, { url: '../headportrait/headportrait35.png' }, { url: '../headportrait/headportrait28.png' }, { url: '../headportrait/headportrait58.png' }, { url: '../headportrait/headportrait55.png' }, { url: '../headportrait/headportrait56.png' }, { url: '../headportrait/headportrait45.png' }, { url: '../headportrait/headportrait26.png' }, { url: '../headportrait/headportrait38.png' }, { url: '../headportrait/headportrait62.png' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuserdetail()
  },
  changuserheader: function (e) {
    this.setData({
      imageshow: e.currentTarget.dataset.url
    })
  },
  getuserdetail: function () {
    let _this = this;
    app._ajax(
      "post",
      "/user/queryUserAdditionPOByUserId",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        if (data.data.userPO != null && data.data != null) {
          _this.setData({
            imageshow: data.data.userPO.avatarUrl,
          })
        }
      }, (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  picupdate: function () {
    let _this = this;
    wx.getImageInfo({
      src: _this.data.imageshow,
      success(res) {
        wx.uploadFile({
          url: app.api_url + '/system/oss/fileUpload',
          filePath: res.path,
          name: 'image',
          // formData: {
          //   'userId': wx.getStorageSync('userId')
          // },
          success(res) {
            if (res.statusCode == 200) {
              let newdatas = JSON.parse(res.data)
              app._ajax(
                "post",
                "/user/uploadAvatar",
                { userId: wx.getStorageSync('userId'), url: newdatas.data.images[0] },
                (data) => {
                  if (data.code == 200) {
                    app.tipToast(1, '头像修改成功', function () {
                      wx.navigateBack()
                    })
                  }
                })
            }
          }
        })
      }
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