// pages/order/order.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部', '待付款', '待发货','待收货','已完成'],
    navbarlist: [{ name: '商城', type: 1 }, { name: '会员卡', type: 2 }],
    ordertype:1,
    pageNum:1,
    currentTab: 0,
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [],//下拉列表的数据
    selectDate: [{name:'全部月份',id:0}, {name:'1月',id:1}, {name:'2月',id:2}, {name:'3月',id:3}, {name:'4月',id:4}, {name:'5月',id:5}, {name:'6月',id:6}, {name:'7月',id:7}, {name:'8月',id:8}, {name:'9月',id:9}, {name:'10月',id:10}, {name:'11月',id:11}, {name:'12月',id:12}],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    indexa: 0,//选择的下拉列表下标
    orderState:'',
    year:'',
    month:'',
    nowyears:'',
    items:[
    ]
  },
  wanttokf: function (e) {
    wx.navigateTo({
      url: '/pages/customerservice/kfindex',
    })
  },
  changeordertype:function(e){
    this.setData({
      ordertype:e.currentTarget.dataset.typeid,
      pageNum:1
    })
    this.getuserorder()
  },
  // 收货
  changedd:function(e){
    let _this =this;
    if (e.currentTarget.dataset.state==3){
      if (_this.data.ordertype == 1) {
        app._ajax(
          "post",
          "/shopOrder/receiving",
          {
            id: e.currentTarget.dataset.id,
            userId: wx.getStorageSync('uid')
          },
          (data) => {
            if (data.code == 200) {
              _this.getuserorder()
              app.tipToast(1, '成功收货');
            }
          },
          (msg) => {
            app.tipToast(2, msg);
          }
        )
      }else{
        // app._ajax(
        //   "post",
        //   "/order/receiving",
        //   {
        //     id: e.currentTarget.dataset.id,
        //     userId: wx.getStorageSync('userId')
        //   },
        //   (data) => {
        //     if (data.code == 200) {
        //       _this.getuserorder()
        //       app.tipToast(1, '成功收货');
        //     }
        //   },
        //   (msg) => {
        //     app.tipToast(2, msg);
        //   }
        // )
      }
    }
  },
  //导航栏切换
  navbarTap: function (e) {
    let _this =this;
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      pageNum: 1
    })
    if (e.currentTarget.dataset.idx==0){
      _this.setData({
        orderState:''
      })
    }else{
      _this.setData({
        orderState: e.currentTarget.dataset.idx
      })
    }
    _this.getuserorder()
  },
  // 取消订单
  delorder:function(e){
    let _this =this;
    wx.showModal({
      title: '提示',
      content: '您确定要取消该订单',
      success(res) {
        if (res.confirm) {
          if (_this.data.ordertype == 1) {
            app._ajax(
              "post",
              "/shopOrder/cancelShopOrder",
              {
                id: e.currentTarget.dataset.id
              },
              (data) => {
                if (data.code == 200) {
                  _this.getuserorder()
                  app.tipToast(1, '订单取消成功');
                }
              },
              (msg) => {
                app.tipToast(2, msg);
              }
            )
          }else{
            // app._ajax(
            //   "post",
            //   "/order/cancelShopOrder",
            //   {
            //     id: e.currentTarget.dataset.id
            //   },
            //   (data) => {
            //     if (data.code == 200) {
            //       _this.getuserorder()
            //       app.tipToast(1, '订单取消成功');
            //     }
            //   },
            //   (msg) => {
            //     app.tipToast(2, msg);
            //   }
            // )
          }
        } else if (res.cancel) {
        }
      }
    })
  },
  selectTap(e) {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let yearlist =this.data.selectData; 
    if(Index==0){
      this.setData({
        year:'',
        index: Index,
        show: !this.data.show
      });
    }else{
      this.setData({
        year:  yearlist[Index].name,
        index: Index,
        show: !this.data.show
      });
    }
    this.getuserorder()
  },
  // 订单详情
  goorderdetail:function(e){
    let _this=this;
    if (_this.data.ordertype == 1) {
      wx.navigateTo({
        url: '/pages/order/orderdetaile?orderid=' + e.currentTarget.dataset.orderid,
      })
    }else{
      wx.navigateTo({
        url: '/pages/order/cardorderdetail?orderid=' + e.currentTarget.dataset.orderid + '&typeid=' + e.currentTarget.dataset.typeid,
      })
    }
  },
  selectTaq() {
    this.setData({
      showa: !this.data.showa
    });
  },
  // 点击下拉列表
  optionTaq(e) {
    let Indexa = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let monthlist = this.data.selectDate;
    let _this =this;
    if (Indexa == 0) {
      _this.setData({
        month: '',
        indexa: Indexa,
        showa: !this.data.showa
      });
    } else {
      _this.setData({
        month: monthlist[Indexa].id,
        indexa: Indexa,
        showa: !this.data.showa
      });
    }
    _this.getuserorder()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let timestamp = Date.parse(new Date());
    let  date = new Date(timestamp);
    //获取年份  
    let nowyear = date.getFullYear();
    let yearlist = [{ name: '全部年份', type: 0 }, { name: nowyear, type: 1 },]
    for(let i=1;i<6;i++){
      let beforeyear ={
        name:''+(nowyear-i),
        type:1
      }
      yearlist.push(beforeyear)
    }
    _this.setData({
      nowyears:nowyear,
      selectData:yearlist
    })
  },
  // 获取商城订单
  getuserorder:function(){
    let _this = this;
    let yeartime = _this.data.year;
    if (_this.data.month != '' && yeartime == '') {
      yeartime = _this.data.nowyears
    }
    if (_this.data.ordertype==1){
      app._ajax(
        "post",
        "/shopOrder/queryShopOrder",
        {
          userId: wx.getStorageSync('uid'),
          pageNum: _this.data.pageNum,
          pageSize: 10,
          orderState: _this.data.orderState,
          year: yeartime,
          month: _this.data.month
        },
        (data) => {
          if(_this.data.pageNum<=1){
            this.setData({
              items: data.data.content
            })
          }else{
            let itemsdata =_this.data.items;
            for (let i = 0; i < data.data.content.length;i++){
              itemsdata.push(data.data.content[i])
            }
            this.setData({
              items: itemsdata
            })
          }
        },
        (msg) => {
          app.tipToast(2, msg);
        }
      )
    }else{

      app._ajax(
        "post",
        "/order/queryUserCardOrder",
        {
          userId: wx.getStorageSync('userId'),
          pageNum: _this.data.pageNum,
          pageSize: 10,
          orderState: _this.data.orderState,
          year: yeartime,
          month: _this.data.month
        },
        (data) => {
          if (_this.data.pageNum <= 1) {
            this.setData({
              items: data.data.content
            })
          } else {
            let itemsdata = _this.data.items;
            for (let i = 0; i < data.data.content.length; i++) {
              itemsdata.push(data.data.content[i])
            }
            this.setData({
              items: itemsdata
            })
          }
        },
        (msg) => {
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
    this.getuserorder();
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
    this.getuserorder()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})