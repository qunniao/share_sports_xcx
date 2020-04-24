// pages/index/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gymList:[],
    searchtext:'',
    pagesNum:1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchGymShop();
  },

  //获取健身房信息
  searchGymShop: function () {
    var _this = this;
    app._ajax(
      "post",
      "/gymshop/searchGymShopBy",
      { pageNum: _this.data.pagesNum, pageSize: 10, gymName:_this.data.searchtext},
      (data) => {
        let gymlistdata =_this.data.gymList;
        if (_this.data.pagesNum>1){
          for(let i=0;i<data.data.content.length;i++){
            gymlistdata.push(data.data.content[i])
          }
        }else{
          gymlistdata=data.data.content
        }
        _this.setData({
          gymList: gymlistdata
        })
      }
    )
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
  changesearch:function(e){
    let _this=this;
    _this.setData({
      searchtext:e.detail.value
    })
  },
  searchshop:function(e){
    let _this =this;
    _this.setData({
      pagesNum:1,
      searchtext: e.detail.value
    })
    _this.searchGymShop()
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
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    let pages = getCurrentPages(); //页面栈
    if (pages.length == 2) {
      let currPage = pages[0]; //当前页面
      currPage.getSportsStatu();
    }
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
      this.setData({
        pagesNum: this.data.pagesNum + 1
      })
      this.searchGymShop();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})