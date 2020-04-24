const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: false,
    type: 0,//0-全部 1-特权券 2-礼包券 3-商品券
    type1:1,//1-未使用 2-已使用 3-已过期
    coupondata:[],
    pageNum: 1,
    pageSize: 10,
    current: 0,
    nowtimes:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.coupontype!=undefined){
      this.setData({
        type: options.coupontype
      })
    }
    let _this = this;
    let nowtime = new Date().getTime();
    this.pageCoupon(1)

  },
  gotoshop:function(e){
    let typeid = 0;
    if (e.currentTarget.dataset.type==1){
      typeid=5
    }
    if (e.currentTarget.dataset.type == 2) {
      typeid = 6
    }
    wx.navigateTo({
      url: '/pages/index/index?type=1&shoptype=' + typeid,
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
    this.setData({
      type: e.currentTarget.dataset.type,
      pageNum:1,
    })
    this.pageCoupon(2);
  },

  chooseType1: function (e) {
    this.setData({
      type1: e.currentTarget.dataset.type,
      pageNum: 1,
    })
    this.pageCoupon(2);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let _this =this;
    if (this.data.current == 0) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.pageCoupon(1);
    }
    if (this.data.current == 3) {
      this.setData({
        goods_num: this.data.goods_num + 1
      })
      this.getGoodsList(this.data.currentNav);
    }
  },
  // 分页查询我的优惠券
  pageCoupon: function (e) {
    var _this = this;
    let data ={}
    let status = _this.data.type1
    if(_this.data.type1==2){
      status=0
    }
    if (_this.data.type1 == 3){
      status=''
    }
    let datas ={
      userId: wx.getStorageSync("userId"),
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      status: status,
      type: _this.data.type
    }
    if(_this.data.type==0){
      datas={
        userId: wx.getStorageSync("userId"),
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        status: status,
      }
    }
    app._ajax(
      "post",
      "/coupon/pageCouponOperation",
      datas,
      (res) => {
        if(e==1){
          let gymList = _this.data.coupondata;
          let coupondatas = res.data.content
          for (let i = 0; i < res.data.content.length; i++) {
            let nowdata = res.data.content[i].expirationTime;
            nowdata = nowdata.substring(0, 19);
            nowdata = nowdata.replace(/-/g, '/');
            coupondatas[i].beoverdue = new Date(nowdata).getTime()
            let time = res.data.content[i].createTime.split(' ')
            let timetwo = res.data.content[i].expirationTime.split(' ')
            coupondatas[i].starttimes = time[0];
            coupondatas[i].endtimes = timetwo[0]
          }
          for (let i = 0; i < coupondatas.length; i++) {
            gymList.push(
              coupondatas[i]
            );
          }
          _this.setData({
            coupondata: gymList,
          })
        }else if(e==2){
          let coupondatas = res.data.content
          let guoqilist =[]
          for (let i = 0; i < res.data.content.length; i++) {
            let nowdata = res.data.content[i].expirationTime;
            nowdata = nowdata.substring(0, 19);
            nowdata = nowdata.replace(/-/g, '/');
            coupondatas[i].beoverdue = new Date(nowdata).getTime()
            let time = res.data.content[i].createTime.split(' ')
            let timetwo =res.data.content[i].expirationTime.split(' ')
            coupondatas[i].starttimes = time[0];
            coupondatas[i].endtimes = timetwo[0]
            if (_this.data.type1 == 3){
              if (coupondatas[i].beoverdue < _this.data.nowtimes) {
                guoqilist.push(coupondatas[i])
              }
            }else{
              guoqilist.push(coupondatas[i])
            }
          }
          _this.setData({
            coupondata: guoqilist,
          })
        }
      }
    )
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})