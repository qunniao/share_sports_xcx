// pages/square/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    dataList:[
      { name: "奶黄包1", follow: true, fabulous: true, chat: true, create_time:"2019-04-18 21:30"},
    ],
    pageNum:1,
    userdata:{},
    searchtext:'',
    followpeople:[],
    usernoread:0,
    usergxqm:'',
    ourdata: { attentionNumber: 0, friendNumber:0}
  },
  // getusercont
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this =this;
    _this.getfollowpeople()
    _this.getgzdata()
    let noread =0; 
    let noreadlist =app.data.jiguanglist;
    for(let i=0;i<noreadlist.length;i++){
      noread += noreadlist[i].unread_msg_count
    }
    _this.setData({
      usernoread:noread
    })
    this.getuserdata()
  },
  navigateuser:function(){
    wx.navigateTo({
      url: "/pages/square/principal?userId=" + wx.getStorageSync('userId')+'&usertype=2',
    })
  },
  gotousers:function(e){
    wx.navigateTo({
      url: "/pages/square/principal?userId=" + e.currentTarget.dataset.id +'&usertype=1',
    })
  },
  getuserdata:function(){
    let _this =this;
    // 获取用户信息
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId') },
      (res) => {
        console.log(res)
        _this.setData({
          userdata: res.data
        })
      })
      // 获取个性签名
    app._ajax(
      "post",
      "/user/queryUserAdditionPOByUserId",
      { userId: wx.getStorageSync('userId') },
      (ress) => {
        _this.setData({
          usergxqm: ress.data.signature
        })
      })
      // 获取好友人数及关注人数
  },
  getgzdata:function(){
    let _this =this;
    app._ajax(
      "post",
      "/user/countUserData",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        _this.setData({
          ourdata: data.data
        })
      })
  },
  getfollowpeople: function () {
    let _this=this;
    app._ajax(
      "post",
      "/group/findAllFollowUser",
      { userId: wx.getStorageSync('userId') },
      (res) => {
        _this.setData({
          followpeople:res.data
        })
      })
  },
  searchtextchange:function(e){
    this.setData({
      searchtext:e.detail.value
    })
  },
  searchshop: function (e) {
    let _this = this;
    _this.setData({
      searchtext: e.detail.value
    })
    _this.searchsquare()
  },
  searchsquare:function(){
    let _this =this;
    app._ajax(
      "post",
      "/group/searchFriendGroup",
      { pageNum: 1, pageSize: 20, word:_this.data.searchtext },
      (res) => {
        let datalists = res.data
        let followlist = _this.data.followpeople;
        for (let i = 0; i < datalists.length; i++) {
          datalists[i].grouplength = datalists[i].groupPraisePOList.length
          datalists[i].follow = false
          for(let j=0;j<followlist.length;j++){
            console.log(datalists[i].userId)
            if (datalists[i].userId == followlist[j].followUserId){
              datalists[i].follow = true
            }
          }
        }
        
        _this.setData({
          dataList: datalists
        })
      })
  },
  getnearby:function(){
    let _this=this;
    app._ajax(
      "post",
      "/group/pageFriendGroup",
      { userId: wx.getStorageSync('userId') },
      (res) => {
        let datalists = res.data.content
        let followlist = _this.data.followpeople;
        for (let i = 0; i < datalists.length; i++) {
          datalists[i].grouplength = datalists[i].groupPraisePOList.length
          datalists[i].follow = false
          for (let j = 0; j < followlist.length; j++) {
            if (datalists[i].userId == followlist[j].followUserId) {
              datalists[i].follow = true
            }
          }
        }
        _this.setData({
          dataList: datalists
        })
      })
  },
  // 跳转到我的关注
  gomyfollow:function(){
    wx.navigateTo({
      url: '/pages/square/myfollow',
    })
  },
  // 点赞
  giveFabulous:function(e){
    let  _this =this;
    console.log(e.currentTarget.dataset.index)
    let fabulouslist = _this.data.dataList;
    app._ajax(
      "post",
      "/group/addFriendGroupNums",
      { userId: wx.getStorageSync('userId'), mid: e.currentTarget.dataset.mid},
      (res) => {
        if(res.code==200){
          fabulouslist[e.currentTarget.dataset.index].grouplength = fabulouslist[e.currentTarget.dataset.index].grouplength+1
          _this.setData({
            dataList:fabulouslist
          })
          app.tipToast(1, res.msg);
        }
      }, (msg) => {
        app.tipToast(2, msg);
        }      
      )
    // app._ajax(
    //   "post",
    //   "/group/deleteFriendGroupNums",
    //   { userId: wx.getStorageSync('userId'), mid: e.currentTarget.dataset.mid },
    //   (res) => {
    //     console.log(res)
    //   })
  },
  //跳转
  navigate: function (e) {
    console.log(e.currentTarget.dataset.url)
    wx.navigateTo({
      //目的页面地址
      url: e.currentTarget.dataset.url,
      success: function (res) {

      },
    })
  },
  // 添加取消关注
  followthis:function(e){
    let _this =this;
    let ischecked = e.currentTarget.dataset.ischeck
    let typeid = _this.data.type;
    if(ischecked){
      app._ajax(
        "post",
        "/group/unFollowUser",
        { userId: wx.getStorageSync('userId'), followUserId: e.currentTarget.dataset.id },
        (res) => {
          this.setData({
            pageNum: 1
          })
          this.getgzdata()
          this.getfollowpeople()
          if (typeid == 1) {
            _this.getnearby()
          } else if (typeid == 2) {
            _this.getfollow()
          } else if (typeid == 3) {
            _this.getnearby()
          }
        }, (msg) => {
          app.tipToast(2, msg);
        }
      )
    }else{
      app._ajax(
        "post",
        "/group/followUser",
        { userId: wx.getStorageSync('userId'), followUserId:e.currentTarget.dataset.id },
        (res) => {
          this.setData({
            pageNum: 1
          })
          this.getfollowpeople();
          this.getgzdata()
          if (typeid == 1) {
            _this.getnearby()
          } else if (typeid == 2) {
            _this.getfollow()
          } else if (typeid == 3) {
            _this.getnearby()
          }
        },(msg) => {
          app.tipToast(2, msg);
        }  
      )
    }
  },
  getfollow:function(){
    let _this=this;
    app._ajax(
      "post",
      "/group/findFollowMoment",
      { userId: wx.getStorageSync('userId') },
      (res) => {
        let datalists = res.data
        let followlist = _this.data.followpeople;
        for (let i = 0; i < datalists.length; i++) {
          datalists[i].grouplength = datalists[i].groupPraisePOList.length
          datalists[i].follow = false
          for (let j = 0; j < followlist.length; j++) {
            if (datalists[i].userId == followlist[j].followUserId) {
              datalists[i].follow = true
            }
          }
        }
        _this.setData({
          dataList: datalists
        })
      }
    )
  },
  // 切换圈子
  chooseType: function (e) {
    let _this=this;
    let typeid = e.currentTarget.dataset.type
    this.setData({
      type: e.currentTarget.dataset.type,
      pageNum:1
    })
    if (typeid == 1) {
      _this.getnearby()
    } else if (typeid == 2) {
      _this.getfollow()
    } else if (typeid == 3) {
      _this.getnearby()
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
    let _this =this
    let typeid =_this.data.type
    if (typeid == 1) {
      _this.getnearby()
    } else if (typeid == 2) {
      _this.getfollow()
    } else if (typeid == 3) {
      _this.getnearby()
    }
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