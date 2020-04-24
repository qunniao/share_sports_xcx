// pages/agent/scheme.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,//1-健身卡 2-课程
    filter: false,
    listshow: [],
    types:0,
    surplusEneygy:'',
    selectedDate: '',//选中的几月几号
    selectedWeek: '',//选中的星期几
    curYear: 2017,//当前年份
    curMonth: 0,//当前月份,
    daysCountArr: [// 保存各个月份的长度，平年
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    pageNum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    _this.getuserorder()
    app._ajax(
      "post",
      "/order/queryUserEnergyItem",
      { userId: wx.getStorageSync('userId'),type:0 },
      (data) => {
        this.setData({
          surplusEneygy:data.data.userEnergy
        })
      },
      (msg) => { app.tipToast(2, msg) }
    )
  },
  changetype:function(e){
    let _this=this;
    if (e.currentTarget.dataset.typeid==0){
      _this.setData({
        types: e.currentTarget.dataset.typeid,
      })
      _this.getuserorder()
    }else{
      if (_this.data.types == e.currentTarget.dataset.typeid){
        _this.modalChoose()
      }else{
        _this.setData({
          types: e.currentTarget.dataset.typeid,
          selectedDate:'',
          filter:true
        })
      }
    }
  },
  changecard:function(e){
    this.setData({
      type: e.currentTarget.dataset.type,
    })
  },
  modalChoose: function () {
    this.setData({
      filter: !this.data.filter
    })
  },
  getuserorder:function(){
    let _this =this;
    let datas ={
      userId: wx.getStorageSync('userId'),
       pageNum: _this.data.pageNum,
        pageSize: 10
    }
    if(_this.data.types==2){
      datas.handleDate = _this.data.selectedDate
    }
    if (_this.data.types == 1) {
      datas.createDate = _this.data.selectedDate
    }
    app._ajax(
      "post",
      "/order/pageEActivationCode",
      datas,
      (data) => {
        let listshowlist = data.data.content
        for (let i = 0; i < listshowlist.length; i++) {
          listshowlist[i].show = false
          listshowlist[i].creattimes = listshowlist[i].createTime.split(' ')[0]
        }
        this.setData({
          listshow: listshowlist
        })
      },
      (msg) => { app.tipToast(2, msg) }
    ) 
  },
  getDateList: function (y, mon) {
    var vm = this;
    //如果是否闰年，则2月是29日
    var daysCountArr = this.data.daysCountArr;
    if (y % 4 == 0 && y % 100 != 0) {
      this.data.daysCountArr[1] = 29;
      this.setData({
        daysCountArr: daysCountArr
      });
    }
    //第几个月；下标从0开始实际月份还要再+1  
    var dateList = [];
    // console.log('本月', vm.data.daysCountArr[mon], '天');
    dateList[0] = [];
    var weekIndex = 0;//第几个星期
    for (var i = 0; i < vm.data.daysCountArr[mon]; i++) {
      var week = new Date(y, mon, (i + 1)).getDay();
      // 如果是新的一周，则新增一周
      if (week == 0) {
        weekIndex++;
        dateList[weekIndex] = [];
      }
      // 如果是第一行，则将该行日期倒序，以便配合样式居右显示
      let mons = mon
      let nowdates = i + 1;
      if (mons < 10) {
        mons = '0' + (mons + 1)
      }
      if (nowdates < 10) {
        nowdates = '0' + nowdates
      }
      if (weekIndex == 0) {
        dateList[weekIndex].unshift({
          value: y + '-' + mons + '-' + nowdates,
          date: i + 1,
          week: week
        });
      } else {
        dateList[weekIndex].push({
          value: y + '-' + mons + '-' + nowdates,
          date: i + 1,
          week: week
        });
      }
    }
    // console.log('本月日期', dateList);
    vm.setData({
      dateList: dateList
    });
  },
  selectDate: function (e) {
    var vm = this;
    // console.log('选中', e.currentTarget.dataset.date.value);
    vm.setData({
      selectedDate: e.currentTarget.dataset.date.value,
      selectedWeek: vm.data.weekArr[e.currentTarget.dataset.date.week],
      filter: false
    });
    var _this = this;
    _this.getuserorder()
  },
  preMonth: function () {
    // 上个月
    var vm = this;
    var curYear = vm.data.curYear;
    var curMonth = vm.data.curMonth;
    curYear = curMonth - 1 ? curYear : curYear - 1;
    curMonth = curMonth - 1 ? curMonth - 1 : 12;
    // console.log('上个月', curYear, curMonth);
    vm.setData({
      curYear: curYear,
      curMonth: curMonth
    });

    vm.getDateList(curYear, curMonth - 1);
  },
  nextMonth: function () {
    // 下个月
    var vm = this;
    var curYear = vm.data.curYear;
    var curMonth = vm.data.curMonth;
    curYear = curMonth + 1 == 13 ? curYear + 1 : curYear;
    curMonth = curMonth + 1 == 13 ? 1 : curMonth + 1;
    // console.log('下个月', curYear, curMonth);
    vm.setData({
      curYear: curYear,
      curMonth: curMonth
    });

    vm.getDateList(curYear, curMonth - 1);
  },
  goapplydetail:function(e){
    wx.navigateTo({
      url: '/pages/applyexchange/applyexchangedetail?jhcode='+e.currentTarget.dataset.jhcode,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goindex:function(){
    wx.navigateTo({
      url: '/pages/index/search',
    })
  },
  changeshow:function(e){
    let _this =this;
    let contentlist = _this.data.listshow;
    contentlist[e.currentTarget.dataset.show].show = !contentlist[e.currentTarget.dataset.show].show
    _this.setData({
      listshow: contentlist,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var today = new Date();//当前时间  
    var y = today.getFullYear();//年  
    var mon = today.getMonth() + 1;//月  
    var d = today.getDate();//日  
    var i = today.getDay();//星期  
    this.setData({
      curYear: y,
      curMonth: mon,
      selectedDate: y + '-' + mon + '-' + d,
      selectedWeek: this.data.weekArr[i]
    });

    this.getDateList(y, mon - 1);
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