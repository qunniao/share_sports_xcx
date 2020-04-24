// pages/gym/coach.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: false,//true-收藏
    begoodlable: [],
    usercontent: {},
    curriculumVitae: [],
    expertise: [],
    jlid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.uid)
    let _this =this;
    this.setData({
      jlid: options.uid
    })
    app._ajax(
      "post",
      "/coachuser/queryCoachUserByUserId",
      { userId: options.jlid },
      (data) => {
        if (data.code == 200) {
          let goodatlist = data.data.goodat.split(',');
          let curriculumVitaelist = data.data.resume.split(',');
          let expertiselist = data.data.expertise.split(',');
          this.setData({
            begoodlable: goodatlist,
            usercontent: data.data,
            curriculumVitae: curriculumVitaelist,
            expertise: expertiselist
          })
        }
      }
    )
    app._ajax(
      "post",
      "/collect/queryByUserIdAndCoachId",
      { coachId : options.uid, userId: wx.getStorageSync('userId') },
      (data) => {
        console.log(data)
        if (data.data != null) {
          _this.setData({
            collect: true,
          })
        }
      }
    )
  },
  collectBtn: function (e) {
    let _this = this;
    console.log(this.data.collect)
    if (this.data.collect) {
      app._ajax(
        "post",
        "/collect/deleteCollectPO",
        { coachIds: this.data.jlid, type: 2, userId: wx.getStorageSync('userId') },
        (data) => {
          if (data.code == 200) {
            app.tipToast(1, '移除收藏成功');
            _this.setData({
              collect: false,
            })
          }
        }, (msg) => {
          app.tipToast(2, msg);
        }
      )
    } else {
      app._ajax(
        "post",
        "/collect/addCollectPO",
        { coachId: this.data.jlid, type: 2, userId: wx.getStorageSync('userId') },
        (data) => {
          if (data.code == 200) {
            app.tipToast(1, '添加收藏成功');
            _this.setData({
              collect: true,
            })
          }
        }, (msg) => {
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