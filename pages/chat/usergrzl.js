// pages/square/principal.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
      { name: 1, follow: true, fabulous: true, chat: true, create_time: "2019-04-18 21:30" },
      { name: "奶黄包2", follow: true, fabulous: false, chat: true, create_time: "2019-04-18 21:30" },
    ],
    userdata: {},
    usergxqm: '',
    userid: '',
    avatarUrl: '',
    userinfodata: {},
    tixingname: '',
    mudiname: '',
    zhiyename: '',
    shouru: '',
    gxqm: '',
    regionValue:['','',''],
    dhshow:false,
    starttimelist:[],
    usettype:{},
    mudi:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      userid:options.userId
    })
    _this.getuserdetail()
    _this.getourgroup()
    _this.getjsdetail()
    _this.getusergr()
  },
  getusergr:function(){
    let _this=this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: _this.data.userid },
      (data) => {
        _this.setData({
          userdata: data.data,
          userNike: data.data.userNike,
        })
      }
    )
    app._ajax(
      "post",
      "/data/queryUserTypeALL",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        if (data.code == 200) {
          _this.setData({
            usettype: data.data
          })
          _this.getdhjh()
          let typealldata = data.data;
          let txarrs = [];
          let mdarrs = [];
          let zyarrs = [];
          let srarrs = [];
          for (let i = 0; i < typealldata.length; i++) {
            if (typealldata[i].type == 2) {
              txarrs.push(typealldata[i])
            }
            if (typealldata[i].type == 0) {
              mdarrs.push(typealldata[i])
            }
            if (typealldata[i].type == 3) {
              zyarrs.push(typealldata[i])
            }
            if (typealldata[i].type == 4) {
              srarrs.push(typealldata[i])
            }
          }
          _this.setData({
            txarray: txarrs,
            mdarray: mdarrs,
            zyarray: zyarrs,
            srarray: srarrs
          })
          app._ajax(
            "post",
            "/user/queryUserAdditionPOByUserId",
            { userId: _this.data.userid },
            (data) => {
              if (data.data != null) {
                let userinfodatas = data.data
                let tixingnames = '';
                let mudinames = '';
                let zhiyenames = '';
                let shourus = '';
                for (let i = 0; i < typealldata.length; i++) {
                  if (typealldata[i].typeid == data.data.income) {
                    shourus = typealldata[i].name
                  }
                  if (typealldata[i].typeid == data.data.figure) {
                    tixingnames = typealldata[i].name
                  }
                  if (typealldata[i].typeid == data.data.purpose) {
                    mudinames = typealldata[i].name
                  }
                  if (typealldata[i].typeid == data.data.job) {
                    zhiyenames = typealldata[i].name
                  }
                }
                _this.setData({
                  avatarUrl: data.data.userPO.avatarUrl,
                  userinfodata: userinfodatas,
                  tixingname: tixingnames,
                  mudiname: mudinames,
                  zhiyename: zhiyenames,
                  shouru: shourus,
                  gxqm: data.data.signature
                })
              }
            },
            (msg) => {

            }
          )
        }
      },
      (msg) => {

      }
    )
  },
  getdhjh:function(){
      var _this = this;
      app._ajax(
        "post",
        "/partner/queryPartnerpoolByUserId",
        { userId: _this.data.userid },
        (data) => {
          if (data.data != null) {
            _this.setData({
              dhshow:true
            })
            let nowdate =data.data
            let starttime =[]
            for(let i=0;i<_this.data.usettype.length;i++){
              if (nowdate.purpose == _this.data.usettype[i].typeid){
                _this.setData({
                  mudi: _this.data.usettype[i].name
                })
              }
            }
            if (nowdate.startTime1!=null){
              let times = nowdate.startTime1.split(' ')[0] + ' ' + nowdate.startTime1.split(' ')[1].split(':')[0] + ':00-' + nowdate.endTime1.split(' ')[1].split(':')[0] + ':00'
              starttime.push({
                time:'时间段一',
                value: times
              })
            }
            if (nowdate.startTime2 != null) {
              let times = nowdate.startTime2.split(' ')[0] + ' ' + nowdate.startTime2.split(' ')[1].split(':')[0] + ':00-' + nowdate.endTime2.split(' ')[1].split(':')[0] + ':00'
              starttime.push({
                time: '时间段二',
                value: times
              })
            }
            if (nowdate.startTime3 != null) {
              let times = nowdate.startTime3.split(' ')[0] + ' ' + nowdate.startTime3.split(' ')[1].split(':')[0] + ':00-' + nowdate.endTime3.split(' ')[1].split(':')[0] + ':00'
              starttime.push({
                time: '时间段三',
                value: times
              })
            }
            if (nowdate.startTime4 != null) {
              let times = nowdate.startTime4.split(' ')[0] + ' ' + nowdate.startTime4.split(' ')[1].split(':')[0] + ':00-' + nowdate.endTime4.split(' ')[1].split(':')[0] + ':00'
              starttime.push({
                time: '时间段四',
                value: times
              })
            }
            _this.setData({
              starttimelist: starttime
            })
            app._ajax(
              "post",
              "/data/queryCityById",
              { id: data.data.regionId },
              (data) => {
                let cityname = data.data
                let citylist = cityname.cityPO.mergerName.split(',');
                let nowcitliet = _this.data.regionValue;
                for(let i=0;i<citylist.length;i++){
                  nowcitliet[i] = citylist[i]
                }
                _this.setData({
                  regionValue: nowcitliet
                })
            })
        }
    })
  },
  getjsdetail:function(){
    let _this =this;
    app._ajax(
      "post",
      "/partner/queryPartnerpoolByUserId",
      { userId: _this.data.userid},
      (data) => {
        if (data.data != null) {

        }
      }
    )
  },
  getuserdetail:function(){
    let _this =this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: _this.data.userid },
      (res) => {
        _this.setData({
          userdata: res.data
        })
      })
    app._ajax(
      "post",
      "/user/queryUserAdditionPOByUserId",
      { userId: _this.data.userid },
      (ress) => {
        if(ress.data!=null){
          _this.setData({
            usergxqm: ress.data.signature
          })
        }
      })
  },
  getourgroup: function () {
    let _this = this;
    app._ajax(
      "post",
      "/group/pageFriendGroup",
      { userId: _this.data.userid },
      (res) => {
        let ourdata = res.data.content;
        for (let i = 0; i < ourdata.length; i++) {
          let createt = ourdata[i].createTime
            .split(' ')[0]
          let createlist = createt.split('-')
          ourdata[i].createlist = createlist;
        }
        _this.setData({
          dataList: ourdata
        })
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  navigate: function (e) {
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
      success: function (res) {

      },
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