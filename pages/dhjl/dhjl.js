// pages/square/principal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userdetail:[],
    pageNum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getuserjl()
  },
  getuserjl:function(){
    let _this =this;
    app._ajax(
      "post",
      "/partner/pagePartnerRecord",
      {
        userId: wx.getStorageSync('userId'), pageNum: _this.data.pageNum,pageSize:10
      },
      (data) => {
        let datas = data.data.content;
        for (let i = 0; i < datas.length;i++){
          datas[i].payfun = ''
          if (datas[i].type == 1){
            datas[i].nowzt ='请求中'
          }
          if (datas[i].auserId == wx.getStorageSync('userId')) {
            datas[i].username = datas[i].auserPO.userName
          }else{
            datas[i].username = datas[i].buserPO.userName
          }
          if (datas[i].type == 2) {
            if (datas[i].auserId == wx.getStorageSync('userId')){
              if (datas[i].atype == 0) {
                datas[i].nowzt = '搭伙中'
              }
              if (datas[i].atype == 1) {
                datas[i].nowzt = '已到场'
              }
              if (datas[i].atype == 2) {
                datas[i].nowzt = '未到场'
              }
            }
            if (datas[i].buserId == wx.getStorageSync('userId')) {
              if (datas[i].btype == 0) {
                datas[i].nowzt = '搭伙中'
              }
              if (datas[i].btype == 1) {
                datas[i].nowzt = '已到场'
              }
              if (datas[i].btype == 2) {
                datas[i].nowzt = '未到场'
              }
            }
          }
          if (datas[i].type == 3) {
            datas[i].nowzt = '已拒绝'
          }
          if(datas[i].payType=='AA'){
            if ( datas[i].type == 2){
              if (datas[i].payType == 'A' && datas[i].auserId == wx.getStorageSync('userId')) {
                if (datas[i].atype == 0) {
                  datas[i].payfun = '抵扣10能量值'
                }
                if (datas[i].atype == 1) {
                  datas[i].payfun = '返还10能量值'
                }
                if (datas[i].atype == 2) {
                  datas[i].payfun = '扣除10能量值'
                }
              }else{
                if (datas[i].btype == 0) {
                  datas[i].payfun = '抵扣10能量值'
                }
                if (datas[i].btype == 1) {
                  datas[i].payfun = '返还10能量值'
                }
                if (datas[i].btype == 2) {
                  datas[i].payfun = '扣除10能量值'
                }
              }
            }
          }
          if (datas[i].payType == 'A' && datas[i].auserId==wx.getStorageSync('userId')) {
            if (datas[i].type == 2 && datas[i].auserId == wx.getStorageSync('userId')) {
              if (datas[i].atype == 0) {
                datas[i].payfun = '抵扣20能量值'
              }
              if (datas[i].atype == 1) {
                datas[i].payfun = '返还20能量值'
              }
              if (datas[i].atype == 2) {
                datas[i].payfun = '扣除20能量值'
              }
            }else{
              datas[i].payfun = ''
            }
          }
          if (datas[i].payType == 'B' && datas[i].buserId == wx.getStorageSync('userId')) {
            if (datas[i].type == 2 && datas[i].buserId == wx.getStorageSync('userId')) {
              if (datas[i].btype == 0) {
                datas[i].payfun = '抵扣20能量值'
              }
              if (datas[i].btype == 1) {
                datas[i].payfun = '返还20能量值'
              }
              if (datas[i].btype == 2) {
                datas[i].payfun = '扣除20能量值'
              }
            } else {
              datas[i].payfun = ''
            }
          }
          let ydtime =''
          ydtime = datas[i].startTime.split(' ')[0].split('-')[1] + '-' + datas[i].startTime.split(' ')[0].split('-')[2] +'  '+ datas[i].startTime.split(' ')[1].split(':')[0] + ':' + datas[i].startTime.split(' ')[1].split(':')[1] + '-' + datas[i].endTime.split(' ')[1].split(':')[0] + ':' + datas[i].endTime.split(' ')[1].split(':')[1]
          datas[i].ydtimes = ydtime
        }
        _this.setData({
          userdetail: datas
        })
      }
    )
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
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.getuserjl()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})