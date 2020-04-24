//index.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter: false,
    // 日历
    selectedDate: '',//选中的几月几号
    selectedWeek: '',//选中的星期几
    curYear: 2017,//当前年份
    curMonth: 0,//当前月份
    daysCountArr: [// 保存各个月份的长度，平年
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dateList:[],
    historydata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app._ajax(
      "post",
      "/gymshop/queryGymFitnessRecordByGymShopId",
      { userId:wx.getStorageSync('userId'),type:1},
      (data) => {
       let historydatas = data.data;
       for(let i = 0;i<historydatas.length;i++){
         let jstime1 = historydatas[i].startTime.split(' ')
         let yeartime = jstime1[0].split('-')[0] + '年' + jstime1[0].split('-')[1] + '月' + jstime1[0].split('-')[2]+'日'
         let starttime = jstime1[1].split(':')[0] +':'+ jstime1[1].split(':')[1]
         let jstime2 = historydatas[i].towEndTime.split(' ')[1]
         let endtime = jstime2.split(':')[0] +':'+ jstime2.split(':')[1]
         let motion= yeartime+' '+starttime+'-'+endtime
         historydatas[i].motionTime = motion 
       }
        _this.setData({
          historydata: historydatas
        })
      },
      (msg) => {
        app.tipToast(2, msg)
      }
    ) 
  },

  modalChoose: function () {
    this.setData({
      filter: !this.data.filter
    })
  },

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
      let mons =mon+1
      let nowdates = i+1;
      if(mons<10){
        mons = '0'+ mons
      }
      if(nowdates <10){
        nowdates= '0'+ nowdates
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
    vm.setData({
      dateList: dateList
    });
  },
  selectDate: function (e) {
    var vm = this;
    vm.setData({
      selectedDate: e.currentTarget.dataset.date.value,
      selectedWeek: vm.data.weekArr[e.currentTarget.dataset.date.week],
      filter:false
    });
    var _this = this;
    app._ajax(
      "post",
      "/gymshop/queryGymFitnessRecordByGymShopId",
      {
        userId: wx.getStorageSync('userId'),
        type: 1,
        startTime: e.currentTarget.dataset.date.value + ' 00:00:00',
        endTime: e.currentTarget.dataset.date.value + ' 23:59:59'
      },
      (data) => {
        let historydatas = data.data;
        for (let i = 0; i < historydatas.length; i++) {
          let jstime1 = historydatas[i].startTime.split(' ')
          let yeartime = jstime1[0].split('-')[0] + '年' + jstime1[0].split('-')[1] + '月' + jstime1[0].split('-')[2] + '日'
          let starttime = jstime1[1].split(':')[0] + ':' + jstime1[1].split(':')[1]
          let jstime2 = historydatas[i].towEndTime.split(' ')[1]
          let endtime = jstime2.split(':')[0] + ':' + jstime2.split(':')[1]
          let motion = yeartime + ' ' + starttime + '-' + endtime
          historydatas[i].motionTime = motion
        }
        _this.setData({
          historydata: historydatas
        })
      },
      (msg) => {
        app.tipToast(2, msg)
      }
    ) 
  },
  preMonth: function () {
    // 上个月
    var vm = this;
    var curYear = vm.data.curYear;
    var curMonth = vm.data.curMonth;
    curYear = curMonth - 1 ? curYear : curYear - 1;
    curMonth = curMonth - 1 ? curMonth - 1 : 12;
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
    vm.setData({
      curYear: curYear,
      curMonth: curMonth
    });

    vm.getDateList(curYear, curMonth - 1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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