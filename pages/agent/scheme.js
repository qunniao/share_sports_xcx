// pages/agent/scheme.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,//1-未使用 2-已使用 3-已过期
    dataList: [],
    goods_num:1,
    searchtext:'',
    pageNum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    _this.getagentscheme()
  },
  getagentscheme:function(){
    let _this=this;
    let searchdata={
      pageNum: _this.data.pageNum,
      pageSize: 10
    }
    if(_this.data.type!=0){
      searchdata.type=_this.data.type
    }
    app._ajax(
      "post",
      "/agentScheme/pageAgentScheme",
      searchdata,
      (data) => {
        let datalists = _this.data.dataList;
        if (_this.data.pageNum>1){
          for (let i = 0; i < data.data.content.length;i++){
            datalists.push(data.data.content[i])
          }
        } else if (_this.data.pageNum==1){
          datalists = data.data.content
        }
        _this.setData({
          dataList: datalists
        })
      }
    )
  },
  searchshops:function(e){
    this.setData({
      searchtext: e.detail.value
    })
    this.searchshop()
  },
  // 搜索代理方案
  searchshop:function(e){
    let _this = this;
    if(_this.data.searchtext==''){
      _this.setData({
        pageNum:1
      })
      _this.getagentscheme()
    }else{
      let searchdatas = {
        name: _this.data.searchtext
      }
      if (_this.data.type != 0) {
        searchdatas.type = _this.data.type
      }
      app._ajax(
        "post",
        "/agentScheme/byProductName",
        searchdatas,
        (data) => {
          // let datalists = _this.data.dataList;
          if (data.data != null) {
            let datalists = data.data
            _this.setData({
              dataList: datalists
            })
          }
        }
      )
    }
  },
  changesearchtext:function(e){
    this.setData({
      searchtext:e.detail.value
    })
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
  chooseType: function (e) {
    let _this =this
    this.setData({
      type: e.currentTarget.dataset.type,
      pageNum:1
    })
    if (_this.data.searchtext==''){
      _this.getagentscheme()
    }else{
      _this.searchshop()
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
    let pageno = this.data.pageNum + 1;
      this.setData({
        pageNum: this.data.pageNum + 1
      })
    this.getagentscheme();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})