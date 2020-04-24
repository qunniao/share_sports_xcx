// pages/agent/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: 0,//0-全部 1-客户 2-二级
    type:1,//1-全部 2-待付款 3-已付款 4-已完成
    dataList: [],
    pageNums:1,
    userdata:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getuserorder()
    this.getuserdetail()
  },
  getuserdetail: function () {
    let _this = this;
    app._ajax(
      "post",
      "/agent/queryUserInfo",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        _this.setData({
          userdata: data.data,
          // userrole: data.data.role
        })
      })
  },
  getuserorder:function(){
    let _this = this;
    let data = { role: _this.data.filter,  pageNum: _this.data.pageNums, pageSize: 10, userId: wx.getStorageSync('uid') }
    if (_this.data.type != 1 && _this.data.type != 4){
      data.orderState = _this.data.type-1
    }else{
      if (_this.data.type ==1){
        data.orderState = ''
      }else{
        data.orderState = _this.data.type
      }
    }
    app._ajax(
      "post",
      "/shopOrder/pageCustomerOrder",
      data,
      (data) => {
        let odrerdatalist =data.data.content;
        for (let i = 0; i < odrerdatalist.length;i++){
          let sum=0;
          let commission=0;
          for (let j = 0; j < odrerdatalist[i].orderProductPO.length;j++){
            sum += odrerdatalist[i].orderProductPO[j].number
            commission += odrerdatalist[i].orderProductPO[j].agentSchemePO.agentCommission
          }
          odrerdatalist[i].ordersum = sum
          odrerdatalist[i].ordercommission = commission
        }
        _this.setData({
          dataList: odrerdatalist
        })
      })
  },
  filterType: function (e) {
    let types = e.currentTarget.dataset.type;
    // if(types==1){
    //   types=0
    // }
    // if(types==2){
    //   types=1
    // }
    this.setData({
      filter: types
    })
    this.getuserorder()
  },
  chooseType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type,
      dataList:[]
    })
    this.getuserorder()
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