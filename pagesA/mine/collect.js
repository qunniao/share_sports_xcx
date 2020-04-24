// pages/mine/collect.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //健身房列表
    type:1,//1-店铺 2-教练
    gymList: [],
    coachList:[],
    deleteBtn:false,
    all:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this =this;
    _this.getcollectAll();
  },
  getcollectAll:function(){
    let _this =this;
    app._ajax(
      "post",
      "/collect/queryCollectAll",
      { userId: wx.getStorageSync('userId') },
      (res) => {
        let gymList = [];
        let datalist = res.data.shopPOList;
        function distanceByLnglat(lng1, lat1, lng2, lat2) {
          var radLat1 = Rad(lat1);
          var radLat2 = Rad(lat2);
          var a = radLat1 - radLat2;
          var b = Rad(lng1) - Rad(lng2);
          var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
          s = s * 6378137.0; // 取WGS84标准参考椭球中的地球长半径(单位:m)
          s = Math.round(s * 10000) / 10000;
          return s
          // //下面为两点间空间距离（非球面体）
          // var value= Math.pow(Math.pow(lng1-lng2,2)+Math.pow(lat1-lat2,2),1/2);
          // alert(value);
        }

        function Rad(d) {
          return d * Math.PI / 180.0;
        }
          for (let i = 0; i < datalist.length; i++) {
            let distance = distanceByLnglat(wx.getStorageSync('userlong'), wx.getStorageSync('userlat'), datalist[i].longitude, datalist[i].latitude)
            let shopdata = datalist[i]
            let distancecontrast = distance
            if (distance > 1000) {
              distance = distance / 1000
              distance = distance.toFixed(1) + 'km'
            } else {
              distance = distance.toFixed(1) + 'm'
            }

            shopdata.distancelength = distance
            shopdata.distancecontrasts = distancecontrast
            gymList.push(
              shopdata
            );
          }
          function compare(property) {
            return function (a, b) {
              var value1 = a[property];
              var value2 = b[property];
              return value1 - value2;
            }
          }
          gymList = gymList.sort(compare('distancecontrasts'))
        _this.setData({
          gymList: gymList,
          coachList: res.data.coachUserPOList
        })
      }
    )
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  gocoach:function(e){

    wx.navigateTo({
      url: '../../pages/gym/coach?jlid=' + e.currentTarget.dataset.uid + '&uid=' + e.currentTarget.dataset.id,
    })
  },
  navigateshop:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  touchE: function (e) {
    let _this = this;
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      let showdellist = _this.data.gymList
      let nowindex = e.currentTarget.dataset.index;
      if (disX > 100) {
        showdellist[nowindex].showtype = 1
      } else if (disX < -100) {
        showdellist[nowindex].showtype = 2
      }
      _this.setData({
        gymList: showdellist
      })
    }
  },
  chooseType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },
  delgymshop:function(e){
    let _this =this;
    app._ajax(
      "post",
      "/collect/deleteCollectPO",
      { userId: wx.getStorageSync('userId'), type: 1, gymShopId: e.currentTarget.dataset.delid },
      (res) => {
        if(res.code==200){
          _this.getcollectAll();
        }
      }
    )
  },
  delete: function (e) {
    this.setData({
      deleteBtn: !this.data.deleteBtn
    })
  },
  delall:function(){
    let _this =this;
    let coachLists = _this.data.coachList
    let delcol =''
    for(let i=0;i<coachLists.length;i++){
      if (coachLists[i].select){
        if(delcol==''){
          delcol = coachLists[i].id +''
        }else{
          delcol += ',' + coachLists[i].id
        }
      }
    }
    if(delcol==''){
      app.tipToast(2, '您未选择要取关的教练');
    }else{
      app._ajax(
        "post",
        "/collect/deleteCollectPO",
        { coachIds: delcol, type: 2, userId: wx.getStorageSync('userId') },
        (data) => {
          if (data.code == 200) {
            app.tipToast(1, '取关成功');
            _this.getcollectAll();
          }
        },(msg) => {
          app.tipToast(2, msg);
        }
      )
    }
  },
  select:function(e){
    if (e.currentTarget.dataset.type==1){
      var coachList = this.data.coachList;
      for (let i = 0; i < coachList.length; i++) {

        if (coachList[i].id == e.currentTarget.dataset.id) {
          coachList[i].select = !coachList[i].select;
        }
      }
      this.setData({
        coachList: coachList,
      })
    }else{
      var coachList = this.data.coachList;
      if (!this.data.all){
        for (let i = 0; i < coachList.length; i++) {
          coachList[i].select = true;
        }
      }else{
        for (let i = 0; i < coachList.length; i++) {
          coachList[i].select = false;
        }
      }
      this.setData({
        all:!this.data.all,
        coachList: coachList,
      })
      
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