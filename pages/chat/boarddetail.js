// pages/contact/contact.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boarddata:{},
    minute:'',
    boardId:'',
    qyadress:['','',''],
    shopname:'',
    dates:'',
    times:'',
    hispeoplename:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this =this ;
    this.setData({
      hispeoplename: options.hisjg
    })
    app._ajax(
      "post",
      "/partner/queryByABuserId",
      { buserId: wx.getStorageSync('userId'), auserId: options.heuserId },
      (res) => {
        let detaillist =res.data
        for (let i = 0; i < detaillist.length;i++){
          if (detaillist[i].id == options.dhid){
            let nowdata = res.data[i]
            let nowadress = _this.data.qyadress;
            for (let i = 0; i < nowadress.length; i++) {
              nowadress[i] = nowdata.cityName.split(',')[i]
            }
            let nowdate = nowdata.promiseTime.split('-')[1] + '-' + nowdata.promiseTime.split('-')[2]
            let nowtimes = nowdata.startTime.split(' ')[1].split(':')[0] + ':00-' + nowdata.endTime.split(' ')[1].split(':')[0] + ':00'
            _this.setData({
              dates: nowdate,
              times: nowtimes,
              qyadress: nowadress,
              boarddata: nowdata,
              boardId: nowdata.id
            })
          }
        }
      })
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId') },
      (res) => {
        this.jglogins(res.data.jiguangUsername, res.data.jiguangPassword)
      })
  },
  jglogins:function(usernames,userpasswd){
    var jim = app.jim;
    var _this = this;
    jim.loginOut();
    app._ajax(
      "post",
      "/jiguangs/jgtm",
      "",
      (res) => {
        var data = res.data;
        data.flag = 1;
        jim.init(
          data
        ).onSuccess(function (data) {
          jim.login({
            'username': usernames,
            'password': userpasswd,
          }).onSuccess(function (data) {
            
          })
        })
      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  launchno: function () {
    let _this=this;
    app._ajax(
      "post",
      "/partner/partnerNO",
      { id:this.data.boardId},
        (res) => {
          if(res.code==200){
            app.tipToast(1, '拒绝搭伙成功', function () {
              app.jim.sendSingleMsg({
                'target_username': _this.data.hispeoplename,
                'content': 'oyoc共享健身搭伙拒绝asdorjaihjiadpqo',
              }).onSuccess(function (data) {
                wx.navigateBack()
              })
            })
          }
      },(msg) => {
          app.tipToast(2, msg,)
      }
    )
  },
  launchok: function () {
    let _this =this;
    app._ajax(
      "post",
      "/partner/partnerYES",
      { id: _this.data.boardId },
      (res) => {
        app.tipToast(1, '同意搭伙', function () {
          app.jim.sendSingleMsg({
            'target_username': _this.data.hispeoplename,
            'content': 'oyoc共享健身搭伙同意asdorjaihjiadpqo',
          }).onSuccess(function (data) {
            wx.navigateBack()
          })
        })
      }, (msg) => {
        app.tipToast(2, msg)
      })
  },
  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})