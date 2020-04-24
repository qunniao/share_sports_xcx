var bmap = require('../../libs/bmap-wx.min.js');
const app = getApp()
Page({
  data: {

    /**
     * 所有前端数据对应的值
     * 
     */
    navData: [
      {
        text: "健身",  //文本
        current: 0,
        iconPath: '../../res/imgs/icon_home.png',
        selectedIconPath: '../../res/imgs/icon_home_active.png',
      },
      {
        text: "社交",  //文本
        current: 1,
        iconPath: '../../res/imgs/icon_social.png',
        selectedIconPath: '../../res/imgs/icon_social_active.png',
      },
      {
        current: 2,//扫一扫
      },
      {
        text: "商城",  //文本
        current: 3,
        iconPath: '../../res/imgs/icon_store.png',
        selectedIconPath: '../../res/imgs/icon_store_active.png',
      },
      {
        text: "我的",  //文本
        current: 4,    //是否是当前页，0不是  1是
        iconPath: '../../res/imgs/icon_mine.png',
        selectedIconPath: '../../res/imgs/icon_mine_active.png',
      },
    ],
    // 日历
    selectedDate: '',//选中的几月几号
    selectedWeek: '',//选中的星期几
    curYear: 2017,//当前年份
    curMonth: 0,//当前月份
    daysCountArr: [// 保存各个月份的长度，平年
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    avatarUrl:'',
    weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dateList: [],
    current: 0,
    // 首页和社交商城轮播图 
    imgUrls: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    changesearctext:'',

    // 用户信息
    hasUserInfo: true,
    userInfo: {},
    userInfo2: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    //健身房列表
    gymList: [],
    gymcitylist: [{ name: '全部区域', id: 0 }],
    cityquname:{cityname:'全部区域',id:0},
    BuildingAll: [],
    SubjectAll: [],
    bid: [],
    sid: [],
    latitude: '',
    longitude: '',
    pageNum: 1,
    pageSize: 10,
    SportsStatu: false,
    second: 0,
    gymShopId: '',




    type: 1,//1-搭伙计划 2-临时搭伙 3-好友
    body: "",
    income: "",
    filter_0_list: [],//健身目的
    filter_1_list: [],//体型
    filter_2_list: [],//身材
    filter_3_list: [],//职业
    filter_4_list: [],//年收入
    gender: 0,//0-男 1-女
    level: 2,//2-大众 3-精英 4-皇家
    choose_age: "16",
    left: "69",
    //筛选
    filter_6_list: [
      { name: '时间段一', id: 1,selectDate:'', content: '', checked: false ,selecttime:[]},
      { name: '时间段二', id: 2,  selectDate: '', content: '', checked: false, selecttime: []},
      { name: '时间段三', id: 3,  selectDate: '', content: '', checked: false, selecttime: []},
      { name: '时间段四', id: 4, selectDate: '', content: '', checked: false, selecttime: []}
    ],
    filter_6_listtime: [
      { content: '上午\n5:00-11:00',id:1, checked: false },
      { content: '中午\n11:00-14:00',id:2, checked: false },
      { content: '下午\n14:00-17:00',id:3, checked: false },
      { content: '晚上\n17:00-22:00',id:4, checked: false }
    ],
    
    userFilter: false,//用户筛选条件

    boardTemporaryList: [],
    pageNumBoard: 1,
    firendList: [],
    // 开关
    switch_1: false,//搭伙时间
    switch_2: false,//基本筛选
    switch_3: false,//精英筛选
    switch_4: false,//人脉筛选
    buyshoplength: 0,//购物车数目






    regionValue: [{ name: "浙江省", id: 933 }, { name: "杭州市", id: 934 }, { name: "下城区", id: 935 }],//区域筛选
    showRegion: false,
    regionValue2: [{ name: "浙江省", id: 933 }, { name: "杭州市", id: 934 }, { name: "下城区", id: 935 }],//区域筛选
    showRegion2: false,
    tipsModal: false,
    tips_1: false,
    tips_2: false,
    tips_3: false,
    tips_4: false,
    tips_5: false,
    //我的导航栏
    navList: [
      { name: '会员办理', icon: '../../res/imgs/icon_member_hander.png', url: "../../pages/purchase/index" ,checked:true},
      { name: '代理中心', icon: '../../res/imgs/icon_agent_center.png', url: "../agent/index", checked: false},
      { name: '分享中心', icon: '../../res/imgs/icon_share.png', url: "../sharingcenter/sharingcenter", checked: true},
      { name: '结束健身核销', icon: '../../res/imgs/icon_scan.png', url: "pd", checked: true},
      { name: '渠道中心', icon: '../../res/imgs/icon_center.png', url: "../channel/index", checked: false},
      // { name: '优惠核销', icon: '../../res/imgs/icon_preferential.png' },
    ],
    navList2: [
      { name: '查看我的全部订单', icon: '../../res/imgs/icon_all_order.png', url: "../order/order" },
      { name: '咨询我的私人客服', icon: '../../res/imgs/icon_custom.png', url: "../customerservice/kfindex" },
    ],
    navList3: [
      { name: '我的会员', icon: '../../res/imgs/my_member.png', line: true, url: "../../pagesA/mine/member" },
      { name: '我的特权', icon: '../../res/imgs/my_power.png', line: true, url: "../../pagesA/mine/power" },
      { name: '我的钱包', icon: '../../res/imgs/my_wallet.png', line: true, url: "../../pagesA/mine/wallet" },
      { name: '我的优惠券', icon: '../../res/imgs/my_coupon.png', line: false, url: "../../pagesA/mine/coupon" },
      { name: '我的礼包', icon: '../../res/imgs/my_gift_package.png', line: true, url: "../../pagesA/mine/coupon?coupontype=2" },
      { name: '训练历史', icon: '../../res/imgs/sport_history.png', line: true, url: "../../pagesA/mine/history" },
      { name: '转换时卡', icon: '../../res/imgs/my_turn_time.png', line: true, url: "../applyexchange/applyexchange" },
      { name: '我的收藏', icon: '../../res/imgs/my_collection.png', line: false, url: "../../pagesA/mine/collect" },
    ],
    storeNavList: [
      { id: 0, name: "热门\n推荐", active: "../../image/icon_store_active_1.png", unactive: "../../image/icon_store_unactive_1.png" },
      { id: 1, name: "运动\n营养", active: "../../image/icon_store_active_2.png", unactive: "../../image/icon_store_unactive_2.png" },
      { id: 2, name: "训练\n工具", active: "../../image/icon_store_active_3.png", unactive: "../../image/icon_store_unactive_3.png" },
      { id: 3, name: "健身\n装备", active: "../../image/icon_store_active_4.png", unactive: "../../image/icon_store_unactive_4.png" },
      { id: 4, name: "运动\n娱乐", active: "../../image/icon_store_active_5.png", unactive: "../../image/icon_store_unactive_5.png" },
      { id: 5, name: "特权\n产品", active: "../../image/icon_store_active_6.png", unactive: "../../image/icon_store_unactive_6.png" },
      { id: 6, name: "礼包\n产品", active: "../../image/icon_store_active_7.png", unactive: "../../image/icon_store_unactive_7.png" },
    ],
    currentNav: 0,
    goodsList: [],
    goods_num: 1,//商品分页
    phoneshow: false,
    callphoneNumber: '',
    cityname: '杭州市',
    nowselectedDate:'',
    nowfilterId:'',
    multiArray: [[], []],
    index:0,
    usernoread:'',
    mypeople:'',
    remanum:'',
    userrole:'',
    isgetrole:false
  },
  onLoad: function (options) {
    let _this = this;
    if (options.type == 1) {
      this.setData({
        current:3,
        currentNav: options.shoptype,
        goodsList: [],
        goods_num: 1,
      })
      this.tabbar()
      this.getGoodsList(options.shoptype)
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({
            isgetrole: true
          })
          if (wx.getStorageSync('userId')) {
            wx.checkSession({
              success() {
                // session_key 未过期，并且在本生命周期一直有效
              },
              fail() {
                // session_key 已经失效，需要重新执行登录流程
                app.login(); // 重新登录
              }
            })
          } else {
            app.login(); // 登录
          }
          // app.login()
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        }
      }
    })
    this.getusercity(0, 1)
    let that = this;
    let BuildingAlldata = wx.getStorageSync('BuildingAll');
    let SubjectAlldata = wx.getStorageSync('SubjectAll');
    for(let i=0;i<BuildingAlldata.length;i++){
      BuildingAlldata[i].checked == false
    }
    for (let i = 0; i < SubjectAlldata.length; i++) {
      SubjectAlldata[i].checked == false
    }
    this.setData({
      BuildingAll: BuildingAlldata,
      SubjectAll: SubjectAlldata,
    })
    var BMap = new bmap.BMapWX({
      ak: '1ubWxRbc2yyhwm0MsRNyM2GRIZCnamlM'
    });
    this.getImgsList();
    // this.getSportsStatu();
    this.getfilterData();
    this.getGoodsList(this.data.currentNav);
    // this.userInfoMode();
    // 登录判断
    //定位
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        _this.setData({
          latitude: latitude,
          longitude: longitude
        })
        wx.setStorageSync('userlat', latitude)
        wx.setStorageSync('userlong', longitude)
        let locations = latitude + ',' + longitude;
        BMap.regeocoding({
          location: locations,
          fail: function(data){
          },
          success:function(data) {
            wx.setStorageSync('cityname', data.originalData.result.addressComponent.city)
            _this.setData({
              cityname: data.originalData.result.addressComponent.city
            })
              _this.getcitylist(data.originalData.result.addressComponent.city)
          }
        });
      },
      fail: function () {
        wx.hideLoading();

        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.showModal({
                title: '',
                content: '请允许OYOC共享健身获取您的定位',
                confirmText: '授权',
                success: function (res) {
                  if (res.confirm) {

                    that.openSetting();
                  } else {
                  }
                }
              })
            } else {
              //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
              that.showModal({
                title: '',
                content: '请在系统设置中打开定位服务',
                confirmText: '确定',
                success: function (res) {
                }
              })
            }
          }
        })
      },
      complete() {
        _this.pageGymShop()
      }
    })
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId') },
      (res) => {
        wx.setStorageSync('username', res.data.jiguangUsername)
        wx.setStorageSync('password', res.data.jiguangPassword)
      })
    this.getuserrole()
  },
  getuserrole:function(){
    let _this =this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId')},
      (res) => {
        let rolelist = _this.data.navList;
        if (res.data.role == 1 || res.data.role == 2){
          rolelist[1].checked=true
        }
        if (res.data.role == 3 || res.data.role==4){
          rolelist[4].checked = true
        }
        _this.setData({
          userrole: res.data,
          navList: rolelist
        })
        wx.setStorageSync('userrole', res.data)
      }, (msg) => {
      //  app.tipToast(2,msg)
      })
  },
  // 获取区域列表
  getcitylist:function(cityname){
    let _this=this;
    app._ajax(
      "post",
      "/data/queryCityByLikeMergerName",
      { mergerName: cityname, level:3},
      (res) => {
        let qylistdata = res.data;
        let qylists = _this.data.gymcitylist;
        let qylistsdata =[]
        qylistsdata.push(qylists[0])
        for (let i = 0; i < qylistdata.length;i++){
          qylistsdata.push(qylistdata[i])
        }
        _this.setData({
          gymcitylist: qylistsdata
        })
      })
  },
  userInfoMode: function () {
    // 获取用户信息
    let returntype =false
    // 用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
      })
    }
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        } else {
          this.setData({
            hasUserInfo: false
          })
        }
      }
    })
  },
  jglogins: function () {
    let _this = this;
    let jim = new JMessage({
      debug: true
    });
    jim.loginOut();
    this._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId') },
      (res) => {
        _this._ajax(
          "post",
          "/jiguangs/jgtm",
          "",
          (ress) => {
            var data = ress.data;
            data.flag = 1;
            jim.init(
              data
            ).onSuccess(function (data) {
              jim.login({
                'username': res.data.jiguangUsername,
                'password': res.data.jiguangPassword,
              }).onSuccess(function (data) {
                //监听实时会话信息
                // jim.onMsgReceive(function (data) {
                //   let launchshow = 0;
                //   let contentdatas = data.messages[0].content.msg_body.text
                //   if (data.messages[0].content.msg_body.text == 'oyoc共享健身搭伙发起asdorjaihjiadpqo') {
                //     contentdatas = '搭伙邀请'
                //     launchshow = 1;
                //   }
                // });
                //监听离线新消息
                jim.onSyncConversation(function (data) {
                  let jshistorylist = []
                  for (let i = 0; i < data.length; i++) {
                    jshistorylist.push(data[i])
                  }
                  // jiguanglist=jshistorylist
                  _this.data.jiguanglist = jshistorylist
                });
              }).onFail(function (data) {
              });
            }).onFail(function (data) {
              msgList: data[0].msgs
            });
          }
        )
      })
  },

  getSportsStatu: function () {
    var _this = this;
    app._ajax(
      "post",
      "/gymshop/queryGymFitnessRecordPOByUserId",
      {userId:wx.getStorageSync('userId')},
      (data) => {
        if(data.data!==null){
          _this.setData({
            SportsStatu: true,
            second: data.data.second,
            gymShopId: data.data.gymShopId
          })
        }
      },
      (msg) => {
        _this.setData({
          SportsStatu: false,
        })
      }
    )
  },

  // 获取搭伙计划
  getUserFilter: function () {
    var _this = this;
    app._ajax(
      "post",
      "/partner/queryPartnerpoolByUserId",
      {userId:wx.getStorageSync('userId')},
      (data) => {
        _this.setData({
          userFilter: true
        })
        if(data.data!=null){
          app._ajax(
            "post",
            "/data/queryCityById",
            { id: data.data.regionId },
            (data) => {
              let cityname = data.data
              let citylist = cityname.cityPO.mergerName.split(',');
              let nowcitliet =_this.data.regionValue;
              nowcitliet[0].name=citylist[1]
              nowcitliet[0].id = cityname.secondLevel
              nowcitliet[1].name = citylist[2]
              nowcitliet[1].id = cityname.superior
              nowcitliet[2].name = citylist[3]
              nowcitliet[2].id = cityname.cityPO.id
              _this.setData({
                regionValue:nowcitliet
              })
            })
          let purposelist = _this.data.filter_0_list;
          let filtersix = _this.data.filter_6_list;
          let nowtime =_this.data.nowselectedDate;
          let filtersixtime =_this.data.filter_6_listtime;
          let nowfilterIds =0;
          let datapurposlist = data.data.purpose.split(',')
          if (data.data.purpose!=null){
            for (let i = 0; i < purposelist.length; i++) {
              for (let j = 0; j < datapurposlist.length; j++) {
                if (datapurposlist[j] == purposelist[i].typeid) {
                  purposelist[i].checked = true;
                }
              }
            }
          }
          if (data.data.figure != null) {
            let figuredata =_this.data.filter_2_list;
            let figurelist = data.data.figure.split(',')
            for (let i = 0; i < figuredata.length; i++) {
              for (let j = 0; j < figurelist.length; j++) {
                if (figurelist[j] == figuredata[i].typeid) {
                  figuredata[i].checked = true;
                }
              }
            }
            _this.setData({
              filter_2_list:figuredata
            })
          }
          if (data.data.job != null) {
            let jobdata = _this.data.filter_3_list;
            let joblist = data.data.job.split(',')
            for (let i = 0; i < jobdata.length; i++) {
              for (let j = 0; j < joblist.length; j++) {
                if (joblist[j] == jobdata[i].typeid) {
                  jobdata[i].checked = true;
                }
              }
            }
            _this.setData({
              filter_3_list:jobdata
            })
          }
          if (data.data.gender!=null){
            _this.setData({
              gender:data.data.gender
            })
          }
          if (data.data.income != null) {
            _this.setData({
              income: data.data.income
            })
          }
          if (data.data.level != null) {
            _this.setData({
              level: data.data.level
            })
          }
          if (data.data.endAge!=null){
            let leftpx = (data.data.endAge - 16) * 4.78 * 2 + 69
            _this.setData({
              choose_age: data.data.endAge,
              left: leftpx
            })
          }
          if(data.data.startTime1!=null){
            filtersix[0].checked=true;
            let time1 = data.data.startTime1.split(' ')
            let time2 = data.data.endTime1.split(' ')[1]
            nowtime =time1[0]
            filtersix[0].selectDate=time1[0]
            nowfilterIds=1;
            filtersix[0].content = '已经选择时间'
            let startid =0;
            let endid=0;
            switch (time1[1]) {
              case '05:00:00':
                startid=1
                break;
              case '11:00:00':
                startid = 2
                break;
              case '14:00:00':
                startid = 3
                break;
              case '17:00:00':
                startid = 4
                break;
            }
            switch (time2) {
              case '11:00:00':
                endid = 1
                break;
              case '14:00:00':
                endid = 2
                break;
              case '17:00:00':
                endid = 3
                break;
              case '22:00:00':
                endid = 4
                break;
            }
            let selectimg =[]
            for (let i = startid; i <= endid;i++){
              selectimg.push(i)
            }
            filtersix[0].selecttime = selectimg
            for (let i = 0; i < filtersixtime.length; i++) {
              for (let j = 0; j < filtersix[0].selecttime.length; j++) {
                if (filtersixtime[i].id == filtersix[0].selecttime[j]) {
                  filtersixtime[i].checked = true
                }
              }
            }
          }
          if (data.data.startTime2 != null) {
            filtersix[1].checked = true;
            let time1 = data.data.startTime2.split(' ')
            let time2 = data.data.endTime2.split(' ')[1]
            filtersix[1].selectDate = time1[0]
            filtersix[1].content = '已经选择时间'
            if (data.data.startTime1 == null) {
              nowtime = time1[0]
              nowfilterIds = 2;
              let startid = 0;
              let endid = 0;
              switch (time1[1]) {
                case '05:00:00':
                  startid = 1
                  break;
                case '11:00:00':
                  startid = 2
                  break;
                case '14:00:00':
                  startid = 3
                  break;
                case '17:00:00':
                  startid = 4
                  break;
              }
              switch (time2) {
                case '11:00:00':
                  endid = 1
                  break;
                case '14:00:00':
                  endid = 2
                  break;
                case '17:00:00':
                  endid = 3
                  break;
                case '22:00:00':
                  endid = 4
                  break;
              }
              let selectimg = []
              for (let i = startid; i <= endid; i++) {
                selectimg.push(i)
              }
              filtersix[1].selecttime = selectimg
              for (let i = 0; i < filtersixtime.length; i++) {
                for (let j = 0; j < filtersix[1].selecttime.length; j++) {
                  if (filtersixtime[i].id == filtersix[1].selecttime[j]) {
                    filtersixtime[i].checked = true
                  }
                }
              }
            }else{
              let startid = 0;
              let endid = 0;
              switch (time1[1]) {
                case '05:00:00':
                  startid = 1
                  break;
                case '11:00:00':
                  startid = 2
                  break;
                case '14:00:00':
                  startid = 3
                  break;
                case '17:00:00':
                  startid = 4
                  break;
              }
              switch (time2) {
                case '11:00:00':
                  endid = 1
                  break;
                case '14:00:00':
                  endid = 2
                  break;
                case '17:00:00':
                  endid = 3
                  break;
                case '22:00:00':
                  endid = 4
                  break;
              }
              let selectimg = []
              for (let i = startid; i <= endid; i++) {
                selectimg.push(i)
              }
              filtersix[1].selecttime = selectimg
            }
          }
          if (data.data.startTime3 != null) {
            filtersix[2].checked = true;
            let time1 = data.data.startTime3.split(' ')
            let time2 = data.data.endTime3.split(' ')[1]
            filtersix[2].selectDate = time1[0]
            filtersix[2].content = '已经选择时间'
              if (data.data.startTime1 == null && data.data.startTime2 == null) {
                nowtime = time1[0]
                nowfilterIds = 3;
                let startid = 0;
                let endid = 0;
                switch (time1[1]) {
                  case '05:00:00':
                    startid = 1
                    break;
                  case '11:00:00':
                    startid = 2
                    break;
                  case '14:00:00':
                    startid = 3
                    break;
                  case '17:00:00':
                    startid = 4
                    break;
                }
                switch (time2) {
                  case '11:00:00':
                    endid = 1
                    break;
                  case '14:00:00':
                    endid = 2
                    break;
                  case '17:00:00':
                    endid = 3
                    break;
                  case '22:00:00':
                    endid = 4
                    break;
                }
                let selectimg = []
                for (let i = startid; i <= endid; i++) {
                  selectimg.push(i)
                }
                filtersix[2].selecttime = selectimg
                for (let i = 0; i < filtersixtime.length; i++) {
                  for (let j = 0; j < filtersix[2].selecttime.length; j++) {
                    if (filtersixtime[i].id == filtersix[2].selecttime[j]) {
                      filtersixtime[i].checked = true
                    }
                  }
                }
              }else{
                let startid = 0;
                let endid = 0;
                switch (time1[1]) {
                  case '05:00:00':
                    startid = 1
                    break;
                  case '11:00:00':
                    startid = 2
                    break;
                  case '14:00:00':
                    startid = 3
                    break;
                  case '17:00:00':
                    startid = 4
                    break;
                }
                switch (time2) {
                  case '11:00:00':
                    endid = 1
                    break;
                  case '14:00:00':
                    endid = 2
                    break;
                  case '17:00:00':
                    endid = 3
                    break;
                  case '22:00:00':
                    endid = 4
                    break;
                }
                let selectimg = []
                for (let i = startid; i <= endid; i++) {
                  selectimg.push(i)
                }
                filtersix[2].selecttime = selectimg
              }
          }
          if (data.data.startTime4 != null) {
            filtersix[3].checked = true;
            let time1 = data.data.startTime4.split(' ')
            let time2 = data.data.endTime4.split(' ')[1]
            filtersix[3].selectDate = time1[0]
            filtersix[3].content = '已经选择时间'
              if (data.data.startTime1 == null && data.data.startTime2 == null && data.data.startTime3 == null) {
                nowtime = time1[0]
                nowfilterIds = 4;
                let startid = 0;
                let endid = 0;
                switch (time1[1]) {
                  case '05:00:00':
                    startid = 1
                    break;
                  case '11:00:00':
                    startid = 2
                    break;
                  case '14:00:00':
                    startid = 3
                    break;
                  case '17:00:00':
                    startid = 4
                    break;
                }
                switch (time2) {
                  case '11:00:00':
                    endid = 1
                    break;
                  case '14:00:00':
                    endid = 2
                    break;
                  case '17:00:00':
                    endid = 3
                    break;
                  case '22:00:00':
                    endid = 4
                    break;
                }
                let selectimg = []
                for (let i = startid; i <= endid; i++) {
                  selectimg.push(i)
                }
                filtersix[3].selecttime = selectimg
                for (let i = 0; i < filtersixtime.length; i++) {
                  for (let j = 0; j < filtersix[3].selecttime.length; j++) {
                    if (filtersixtime[i].id == filtersix[3].selecttime[j]) {
                      filtersixtime[i].checked = true
                    }
                  }
                }
              }else{
                let startid = 0;
                let endid = 0;
                switch (time1[1]) {
                  case '05:00:00':
                    startid = 1
                    break;
                  case '11:00:00':
                    startid = 2
                    break;
                  case '14:00:00':
                    startid = 3
                    break;
                  case '17:00:00':
                    startid = 4
                    break;
                }
                switch (time2) {
                  case '11:00:00':
                    endid = 1
                    break;
                  case '14:00:00':
                    endid = 2
                    break;
                  case '17:00:00':
                    endid = 3
                    break;
                  case '22:00:00':
                    endid = 4
                    break;
                }
                let selectimg = []
                for (let i = startid; i <= endid; i++) {
                  selectimg.push(i)
                }
                filtersix[3].selecttime = selectimg
              }
          }
          _this.setData({
            body:data.data.body,
            selectedDate:nowtime,
            nowfilterId: nowfilterIds,
            filter_0_list: purposelist,
            filter_6_list:filtersix,
            filter_6_listtime: filtersixtime
          })
        }
      },
      (msg) => {
        _this.setData({
          userFilter: false
        })
        // 初始进入搭伙页面
        if (msg =='用户未存在搭伙池中,请先填写搭伙级计划!'){
          let nowtime =_this.data.filter_6_list
          let nowtimetwo=_this.data.filter_6_listtime
          nowtimetwo[0].checked=true
          nowtime[0].checked=true
          if (nowtime[0].selecttime.length==0){
            nowtime[0].selecttime.push(1)
          }
          nowtime[0].content ='已经选择时间'
          nowtime[0].selectDate = _this.data.nowselectedDate
          _this.setData({
            nowfilterId:1,
            filter_6_list:nowtime,
            filter_6_listtime:nowtimetwo
          })
        }
      }
    )
  },
  getuserdetail:function(){
    let _this =this;
    app._ajax(
      "post",
      "/user/queryUserAdditionPOByUserId",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        if ( data.data != null){
          if (data.data.userPO != null){
            _this.setData({
              avatarUrl: data.data.userPO.avatarUrl,
            })
          }
        }
      }
    )
  },
  getImgsList: function () {
    var _this = this;
    app._ajax(
      "post",
      "/Imgs/queryScrollImgAll",
      "",
      (data) => {
        _this.setData({
          imgUrls: data.data,
        })
      }
    )
    // app._ajax(
    //   "post",
    //   "/Imgs/queryScrollImgAll",
    //   "",
    //   (data) => {
    //     _this.setData({
    //       imgUrls: data.data,
    //     })
    //   }
    // )
  },
  // 区域筛选修改
  bindqy:function(e){
    let _this=this;
    let qylist = _this.data.gymcitylist;
    let qycheckid= e.detail.value;
    let cityqunames ={
      cityname: qylist[qycheckid].name,
      id: qylist[qycheckid].id
    }
    wx.setStorageSync('cityname', qylist[qycheckid].name)
    _this.setData({
      cityquname:cityqunames
    })

  },
  getfilterData: function () {
    let _this = this, filter_0_list = [], body, income,//健身目的
      filter_1_list = [],//体型
      filter_2_list = [],//身材
      filter_3_list = [],//职业
      filter_4_list = [];//年收入
    app._ajax(
      "post",
      "/data/queryUserTypeALL",
      "",
      (data) => {
        for (let i = 0; i < data.data.length; i++) {
          switch (data.data[i].type) {
            case 0:
              data.data[i].checked = false;
              filter_0_list.push(data.data[i])
              break;
            case 1:
              filter_1_list.push(data.data[i])
              break;
            case 2:
              data.data[i].checked = false;
              filter_2_list.push(data.data[i])
              break;
            case 3:
              data.data[i].checked = false;
              filter_3_list.push(data.data[i])
              break;
            case 4:
              filter_4_list.push(data.data[i])
              break;
          }
        }
        body = filter_1_list[0].typeid;
        income = filter_4_list[0].typeid;
        _this.setData({
          filter_0_list: filter_0_list,
          filter_1_list: filter_1_list,
          filter_2_list: filter_2_list,
          filter_3_list: filter_3_list,
          filter_4_list: filter_4_list,
          body: body,
          income: income,
        })
        _this.getUserFilter();
      }
    )
  },

  getUserInfo2: function () {
    var _this = this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      {userId:wx.getStorageSync('userId')},
      (data) => {
        _this.setData({
          userInfo2: data.data,
        })
      }
    )
  },
  tabbars:function(e){
    var _this = this;
    if (e.currentTarget.dataset.current == 1 || e.currentTarget.dataset.current==4){
      if (this.data.isgetrole) {
        this.setData({
          current: e.currentTarget.dataset.current,
        })
        _this.tabbar()
      } else {
        this.userInfoMode()
      }
    }else{
      this.setData({
        current: e.currentTarget.dataset.current,
      })
      _this.tabbar()
    }
  },
  // 取消登录
  closeInfoshow:function(e){
    let _this=this;
    _this.setData({
      hasUserInfo:true
    })
  },
  //切换tabbar
  tabbar: function (e) {
    var _this = this;
    // this.setData({
    //   current: e.currentTarget.dataset.current,
    // })
    if (wx.getStorageSync('scope_1')) {
      _this._ajax(
        "post",
        "/user/updateUser",
        {
          userId: wx.getStorageSync('userId'),
          userNike: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        },
        (data) => {
          wx.setStorageSync('scope_1', true);
        }
      )
    }
    if (_this.data.current == 1) {
      this.getUserFilter();
      let noread = 0;
      let noreadlist = app.data.jiguanglist;
      for (let i = 0; i < noreadlist.length; i++) {
        noread += Number(noreadlist[i].unread_msg_count)
      }
      if(noread==0){
        noread=''
      }
      _this.gettemprorydata()
      _this.setData({
        usernoread: noread
      })
      app._ajax(
        "post",
        "/user/countUserData",
        { userId: wx.getStorageSync('userId') },
        (data) => {
          let peoplenum = data.data.friendNumber
          if(peoplenum==0){
            peoplenum=''
          }
          _this.setData({
            mypeople: peoplenum
          })
        })
    }
    if (_this.data.current == 4) {
      this.getUserInfo2();
    }
    if (_this.data.current == 3) {
      this.getshopcard(1)
    }
  },

  //扫码
  scanCode: function (e) {
    var _this = this;
    if (this.data.isgetrole) {
      if (this.data.userInfo2.level == 0) {
        this.setData({
          tipsModal: true,
          tips_1: true,
        })
        return;
      }
      if (this.data.SportsStatu) {
        wx.navigateTo({
          url: '../scan/scan?id=' + _this.data.gymShopId
        })
      } else {
        wx.scanCode({
          success(res) {
            app._ajax(
              "post",
              "/gymshop/startGym",
              {
                code: res.result
              },
              (data) => {
                wx.navigateTo({
                  url: '../scan/scan?id=' + data.data.gymShopId,
                })
              },
              (msg) => {
                app.tipToast(2, msg);
              }
            )
          }
        })
      }
    } else {
      this.userInfoMode()
    }
  },

  //获取用户信息
  getUserInfo: function (e) {
    let _this=this;
    app.globalData.userInfo = e.detail.userInfo;
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        isgetrole:true
      })
      app.login()
      _this.getuserrole()
    }
  },

  // 筛选弹窗
  setModalStatus: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateX(300).step()
    this.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateX(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },

  navigatetomap:function(e){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = e.currentTarget.dataset.data.latitude
        const longitude = e.currentTarget.dataset.data.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18,
          name: e.currentTarget.dataset.data.gymName,
          address: e.currentTarget.dataset.data.address
        })
      }
    })
  },
  //跳转
  navigate: function (e) {
    // console.log(this.userInfoMode())
    if (this.data.isgetrole){
      if (e.currentTarget.dataset.url == 'pd') {
        app._ajax(
          "post",
          "/gymshop/queryGymFitnessRecordPOByUserId",
          { userId: wx.getStorageSync('userId') },
          (data) => {
            if (data.data != null) {
              if (data.data.userType == 2 || data.data.userType == 1) {
                wx.navigateTo({
                  url: '../scan/scan?id=' + data.data.gymShopId,
                })
              } else {
                app.tipToast(2, '用户未开始健身')
              }
            }
          },
          (msg) => { app.tipToast(2, msg) }
        )
      } else {
        wx.navigateTo({
          //目的页面地址
          url: e.currentTarget.dataset.url,
        })
      }
    }else{
      this.userInfoMode()
    }
  },

  gettemprorydata:function(){
    let _this=this;
    app._ajax(
      "post",
      "/partner/queryMatchRecord",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        let peopledata=''
        if(data.data!=null){
          peopledata = data.data.number;
        }
        _this.setData({
          remanum: peopledata
        })
      },
      (msg) => {
        // app.tipToast(2, msg);
      }
    )
  },
  getBoardTemporaryList: function (e) {//换一换
    let _this=this;
    let pageNum='';
    if (this.data.userInfo2.level < 3) {
      this.setData({
        tipsModal: true,
        tips_3: true
      })
      return;
    }
    app._ajax(
      "post",
      "/partner/queryMatchRecord",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        let peopledata = ''
        if (data.data != null) {
          if (e) {
            pageNum = data.data.page;
            pageNum += 1;
          } else {
            pageNum = data.data.page;
          }
        }else{
          pageNum = 1;
        }
        app._ajax(
          "post",
          "/partner/pagePartnerpool",
          { pageNum: pageNum, userId: wx.getStorageSync('userId') },
          (data) => {
            _this.setData({
              boardTemporaryList: data.data
            })
            _this.gettemprorydata()
          },
          (msg) => {
            _this.gettemprorydata()
            app.tipToast(2, msg);
          }
        )
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
  },

  stopBoard: function () {
    var _this = this;
    app._ajax(
      "post",
      "/partner/partnerSTOP",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        _this.setData({
          type: 1,
          userFilter: false
        })
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  //社交
  chooseType: function (e) {
    var _this = this;
    if (e.currentTarget.dataset.type == 2) {
      if (!this.data.userFilter) {
        app.tipToast(2, "请先填写搭伙级计划!");
        return;
      } else {
        this.getBoardTemporaryList();
      }
    } else if (e.currentTarget.dataset.type == 3) {
      this.getFirendList();
    }
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },
  sliderchange: function (e) {
    let _this =this;
    if (this.data.userInfo2.level < 3) {
      this.setData({
        tipsModal: true,
        tips_4: true
      })
      return;
    }
    this.setData({
      choose_age: e.detail.value,
      left: (e.detail.value - 16) * 4.78 * 2 + 69
    })
  },
  // 搭伙好友排序
  getFirendList: function () {
    var _this = this;
    app._ajax(
      "post",
      "/partner/queryGoodFriendList",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        let nowjglist = app.data.jiguanglist;
        let firendlists =data.data
        for(let i=0;i<firendlists.length;i++){
          firendlists[i].sorttime = 0
          firendlists[i].chatcontent = '暂无聊天记录'
        }
        for(let i=0;i<firendlists.length;i++){
          for(let j=0;j<nowjglist.length;j++){
            if (firendlists[i].jiguangUsername == nowjglist[j].from_username){
              if (nowjglist[j].msgs.length!=0){
                let lasttimes = nowjglist[j].msgs[nowjglist[j].msgs.length - 1].ctime_ms
                let lastcontent = nowjglist[j].msgs[nowjglist[j].msgs.length - 1].content.msg_body.text;
                if (lastcontent =='oyoc共享健身搭伙发起asdorjaihjiadpqo'){
                  firendlists[i].chatcontent='搭伙请求'
                } else if (lastcontent == 'oyoc共享健身搭伙同意asdorjaihjiadpqo') {
                  firendlists[i].chatcontent = '搭伙邀约成功'
                } else if (lastcontent == 'oyoc共享健身搭伙拒绝asdorjaihjiadpqo') {
                  firendlists[i].chatcontent = '搭伙邀约失败'
                }else{
                  firendlists[i].chatcontent = lastcontent
                }
                firendlists[i].sorttime = lasttimes
              }
            }
          }
        }
        firendlists = firendlists.sort(_this.compare2('sorttime'))
        _this.setData({
          firendList: data.data
        })
      }
    )
  },

  switch: function (e) {
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        switch_1: !this.data.switch_1
      })
    } else if (e.currentTarget.dataset.type == 2) {

      this.setData({
        switch_2: !this.data.switch_2
      })
    } else if (e.currentTarget.dataset.type == 3) {
      // if (this.data.userInfo2.level < 3) {
      //   this.setData({
      //     tipsModal: true,
      //     tips_4: true
      //   })
      //   return;
      // }
      this.setData({
        switch_3: !this.data.switch_3
      })
    } else if (e.currentTarget.dataset.type == 4) {
      // if (this.data.userInfo2.level < 4) {
      //   this.setData({
      //     tipsModal: true,
      //     tips_5: true
      //   })
      //   return;
      // }
      this.setData({
        switch_4: !this.data.switch_4
      })
    }
  },
  filter_tap: function (e) {
    let _this=this;
    if (e.currentTarget.dataset.type == 0) {//健身目的
      let filter_0_list = this.data.filter_0_list;
      for (let i = 0; i < filter_0_list.length; i++) {
        if (e.currentTarget.dataset.id == filter_0_list[i].typeid) {
          filter_0_list[i].checked = !filter_0_list[i].checked;
          break;
        }
      }

      this.setData({
        filter_0_list: filter_0_list
      })
    } else if (e.currentTarget.dataset.type == 1) {//体型
      this.setData({
        body: e.currentTarget.dataset.id
      })
    } else if (e.currentTarget.dataset.type == 2) {//身材
      if (_this.data.userInfo2.level < 3) {
        _this.setData({
          tipsModal: true,
          tips_4: true
        })
        return;
      }
      let filter_2_list = this.data.filter_2_list;
      for (let i = 0; i < filter_2_list.length; i++) {
        if (e.currentTarget.dataset.id == filter_2_list[i].typeid) {
          filter_2_list[i].checked = !filter_2_list[i].checked;
          break;
        }
      }
      this.setData({
        filter_2_list: filter_2_list
      })
    } else if (e.currentTarget.dataset.type == 3) {//职业
      if (this.data.userInfo2.level < 4) {
        this.setData({
          tipsModal: true,
          tips_5: true
        })
        return;
      }
      let filter_3_list = this.data.filter_3_list;
      for (let i = 0; i < filter_3_list.length; i++) {
        if (e.currentTarget.dataset.id == filter_3_list[i].typeid) {
          filter_3_list[i].checked = !filter_3_list[i].checked;
          break;
        }
      }
      this.setData({
        filter_3_list: filter_3_list
      })
    } else if (e.currentTarget.dataset.type == 4) {//年收入
      if (this.data.userInfo2.level < 4) {
        this.setData({
          tipsModal: true,
          tips_5: true
        })
        return;
      }
      this.setData({
        income: e.currentTarget.dataset.id
      })
    } else if (e.currentTarget.dataset.type == 5) {//精英筛选
      if (_this.data.userInfo2.level < 3) {
        _this.setData({
          tipsModal: true,
          tips_4: true
        })
        return;
      }
      this.setData({
        level: e.currentTarget.dataset.level,
      })
    } else if (e.currentTarget.dataset.type == 6) {//时间选择
      this.setData({
        switch_1: true
      })
      let filter_6_list = _this.data.filter_6_list;
      let time = ''
      let filterlisttime =_this.data.filter_6_listtime
      let checkid = e.currentTarget.dataset.id
      let nowDatechange=_this.data.nowselectedDate
      for(let i=0;i<filterlisttime.length;i++){
        filterlisttime[i].checked=false
      }
      for (let i = 0; i < filter_6_list.length; i++) {
        if (e.currentTarget.dataset.id == filter_6_list[i].id) {
          filter_6_list[i].checked = !filter_6_list[i].checked;
          time = filter_6_list[i].selectDate;
          for (let j = 0; j < filterlisttime.length; j++) {
            for (let k = 0; k < filter_6_list[i].selecttime.length; k++) {
              if (filterlisttime[j].id == filter_6_list[i].selecttime[k]) {
                filterlisttime[j].checked = true
              }
            }
          }
          if (filter_6_list[i].selecttime.length==0){
            filter_6_list[i].content=''
          }
          break;
        }
      }
      this.setData({
        selectedDate:time,
        nowfilterId: checkid,
        filter_6_list: filter_6_list,
        filter_6_listtime: filterlisttime,
      })
    } else if (e.currentTarget.dataset.type == 7) {//性别
      if (_this.data.userInfo2.level < 3) {
        _this.setData({
          tipsModal: true,
          tips_4: true
        })
        return;
      }
      this.setData({
        gender: e.currentTarget.dataset.gender,
      })
    }
  },
  // 选择日期
  selectDates: function (e) {
    var vm = this;
    let _this =this;
    let nowfilters =vm.data.filter_6_list;
    let selecteddate = e.currentTarget.dataset.date.value;
    if (_this.data.nowfilterId==''){
    }
    if (_this.data.nowfilterId == 1) {
      let check = true
      for (let i = 0; i < nowfilters.length;i++){
        if(i==0){

        }else{
          if (e.currentTarget.dataset.date.value == nowfilters[i].selectDate) {
            check = false
          }
        }
      }
      if(check){
        nowfilters[0].selectDate = e.currentTarget.dataset.date.value;
      }else{
        app.tipToast(2,'当前日期已被选择')
      }
    }
    if (_this.data.nowfilterId == 2){
      let check = true
      for (let i = 0; i < nowfilters.length; i++) {
        if (i ==1) {

        } else {
          if (e.currentTarget.dataset.date.value == nowfilters[i].selectDate) {
            check = false
          }
        }
      }
      if (check) {
        nowfilters[1].selectDate = e.currentTarget.dataset.date.value;
      } else {
        app.tipToast(2, '当前日期已被选择')
      }
      // nowfilters[1].selectDate = e.currentTarget.dataset.date.value;
    }
    if (_this.data.nowfilterId == 3) {
      let check = true
      for (let i = 0; i < nowfilters.length; i++) {
        if (i == 2) {

        } else {
          if (e.currentTarget.dataset.date.value == nowfilters[i].selectDate) {
            check = false
          }
        }
      }
      if (check) {
        nowfilters[2].selectDate = e.currentTarget.dataset.date.value;
      } else {
        app.tipToast(2, '当前日期已被选择')
      }
      // nowfilters[2].selectDate = e.currentTarget.dataset.date.value;
    }
    if (_this.data.nowfilterId == 4) {
      let check = true
      for (let i = 0; i < nowfilters.length; i++) {
        if (i == 3) {

        } else {
          if (e.currentTarget.dataset.date.value == nowfilters[i].selectDate) {
            check = false
          }
        }
      }
      if (check) {
        nowfilters[3].selectDate = e.currentTarget.dataset.date.value;
      } else {
        app.tipToast(2, '当前日期已被选择')
      }
      // nowfilters[3].selectDate = e.currentTarget.dataset.date.value;
    }

    vm.setData({
      filter_6_list: nowfilters,
      selectedDate: e.currentTarget.dataset.date.value,
      selectedWeek: vm.data.weekArr[e.currentTarget.dataset.date.week]
    });
  },
  // 搭伙时间选择
  changefiltertime:function(e){
    let _this =this;
    let checkid = e.currentTarget.dataset.id;
    let checkbtnlist = _this.data.filter_6_listtime;
    let nowfilters = _this.data.nowfilterId;
    let nowfilterlist = _this.data.filter_6_list
    if(_this.data.nowfilterId==''){
        let check = true
        for (let i = 0; i < nowfilters.length; i++) {
          if (_this.data.selectedDate== nowfilterlist[i].selectDate[i]) {
            check = false
          }
        }
        if (check) {

        } else {
          app.tipToast(2, '当前日期已被选择')
        }      
      checkbtnlist[checkid-1].checked = true
    }else{   
      if (_this.data.selectedDate==''){
        app.tipToast(2, '日期未选择')
      }else{
        let check = true
        for (let i = 0; i < nowfilterlist.length; i++) {
          if (i != _this.data.nowfilterId-1){
            if (_this.data.selectedDate == nowfilterlist[i].selectDate) {
              check = false
            }
          }
        }
        if (check) {
            function checktime(index) {
              let ischeck = true
              for (let i = 0; i < nowfilterlist.length; i++) {
                if (i != index) {
                  if (_this.data.selectedDate == nowfilterlist[i].selectDate) {
                    ischeck = false
                  }
                }
              }
              return ischeck
            }
            for (let i = 0; i < checkbtnlist.length; i++) {
              checkbtnlist[i].checked = false
            }
            function checkfilters(filterid) {
              nowfilterlist[filterid].content = '已经选择时间';
              if (nowfilterlist[filterid].selecttime.length == 0) {
                nowfilterlist[filterid].selecttime.push(checkid)
                for (let i = 0; i < checkbtnlist.length; i++) {
                  for (let j = 0; j < nowfilterlist[filterid].selecttime.length; j++) {
                    if (checkbtnlist[i].id == nowfilterlist[filterid].selecttime[j]) {
                      checkbtnlist[i].checked = true
                    }
                  }
                }
              } else {
                let check = true;
                // 取消日期选择
                for (let i = 0; i < nowfilterlist[filterid].selecttime.length; i++) {
                  if (checkid == nowfilterlist[filterid].selecttime[i]) {
                    if (nowfilterlist[filterid].selecttime[0] - checkid == 1 || checkid - nowfilterlist[filterid].selecttime[nowfilterlist[filterid].selecttime.length - 1] == 1 || nowfilterlist[filterid].selecttime[0] - checkid == 0 || checkid - nowfilterlist[filterid].selecttime[nowfilterlist[filterid].selecttime.length - 1] == 0) {
                      nowfilterlist[filterid].selecttime.splice(i, 1)
                      check = false
                    } else {
                      check = false
                      app.tipToast(2, '时间段必须连续')
                    }
                  }
                }
                // 连续添加日期选择
                if (check) {
                  let numone = nowfilterlist[filterid].selecttime[0]
                  let numtwo = nowfilterlist[filterid].selecttime[nowfilterlist[filterid].selecttime.length - 1]
                  if (Number(numone) - Number(checkid) == 1 || Number(checkid) - Number(numtwo) == 1 || Number(numone) - Number(checkid) == 0 || Number(checkid) - Number(numtwo)== 0) {
                    if (nowfilterlist[filterid].selecttime[0] - checkid == 1) {
                      nowfilterlist[filterid].selecttime.unshift(checkid)
                    } else {
                      nowfilterlist[filterid].selecttime.push(checkid)
                    }
                  }else{
                    app.tipToast(2, '时间段必须连续的啊')
                  }
                }
                for (let i = 0; i < checkbtnlist.length; i++) {
                  for (let j = 0; j < nowfilterlist[filterid].selecttime.length; j++) {
                    if (checkbtnlist[i].id == nowfilterlist[filterid].selecttime[j]) {
                      checkbtnlist[i].checked = true
                    }
                  }
                }
                if (nowfilterlist[filterid].selecttime.length==0){
                  nowfilterlist[filterid].content=''
                }
              }
            }
            if (nowfilters == 1) {
              checkfilters(0)
            }
            if (nowfilters == 2) {
              checkfilters(1)
            }
            if (nowfilters == 3) {
              checkfilters(2)
            }
            if (nowfilters == 4) {
              checkfilters(3)
            }
          _this.setData({
            filter_6_list: nowfilterlist,
            filter_6_listtime: checkbtnlist
          })
        } else {
          app.tipToast(2, '当前日期已被选择')
        }
      }
    }
  },
  filterGymBtn: function () {
    this.setData({
      pageNum: 1,
      gymList: [],
    })
    this.pageGymShop();
    this.setModalStatus({ currentTarget: { dataset: { status: 0 } } });
  },

  operatorBtn: function (e) {
    this.closeModal();
    wx.navigateTo({
      //目的页面地址
      url: "../purchase/index"
    })
  },

  board_plan_btn: function () {
    let _this =this;
    if (this.data.userInfo2.level == 0) {
      this.setData({
        tipsModal: true,
        tips_2: true
      })
      return;
    }
    let
      currentTime2 = this.data.selectedDate.split("-"),
      currentTime = "",
      startTime1 = "",
      endTime1 = "",
      startTime2 = "",
      endTime2 = "",
      startTime3 = "",
      endTime3 = "",
      startTime4 = "",
      endTime4 = "",
      filter_6_list = this.data.filter_6_list,
      filter_0_list = this.data.filter_0_list,
      filter_2_list = this.data.filter_2_list,
      filter_3_list = this.data.filter_3_list,
      purpose = "",
      job = "",
      figure = "", data = {}
      ;
    for (let i = 0; i < currentTime2.length; i++) {
      if (currentTime2[i] < 10) {
        currentTime += "0" + currentTime2[i] + "-";
      } else {
        currentTime += currentTime2[i] + "-";
      }
    }
    currentTime = currentTime.substr(0, currentTime.length - 1);
    for (let i = 0; i < filter_6_list.length; i++) {
      if (filter_6_list[i].checked) {
        if (filter_6_list[i].content==''){
          app.tipToast(2, "健身时间段未选择");
          return;
        }else{
          if(i==0){
            switch (filter_6_list[i].selecttime[0]) {
              case 1:
                startTime1 = filter_6_list[i].selectDate + " 05:00:00"
                break;
              case 2:
                startTime1 = filter_6_list[i].selectDate + " 11:00:00"
                break;
              case 3:
                startTime1 = filter_6_list[i].selectDate + " 14:00:00"
                break;
              case 4:
                startTime1 = filter_6_list[i].selectDate + " 17:00:00"
                break;
            }
            switch (filter_6_list[i].selecttime[filter_6_list[i].selecttime.length-1]) {
              case 1:
                endTime1 = filter_6_list[i].selectDate + " 11:00:00"
                break;
              case 2:
                endTime1 = filter_6_list[i].selectDate + " 14:00:00"
                break;
              case 3:
                endTime1 = filter_6_list[i].selectDate + " 17:00:00"
                break;
              case 4:
                endTime1 = filter_6_list[i].selectDate + " 22:00:00"
                break;
            }
          }
          if (i == 1) {
            switch (filter_6_list[i].selecttime[0]) {
              case 1:
                startTime2 = filter_6_list[i].selectDate + " 05:00:00"
                break;
              case 2:
                startTime2 = filter_6_list[i].selectDate + " 11:00:00"
                break;
              case 3:
                startTime2 = filter_6_list[i].selectDate + " 14:00:00"
                break;
              case 4:
                startTime2 = filter_6_list[i].selectDate + " 17:00:00"
                break;
            }
            switch (filter_6_list[i].selecttime[filter_6_list[i].selecttime.length - 1]) {
              case 1:
                endTime2 = filter_6_list[i].selectDate + " 11:00:00"
                break;
              case 2:
                endTime2 = filter_6_list[i].selectDate + " 14:00:00"
                break;
              case 3:
                endTime2 = filter_6_list[i].selectDate + " 17:00:00"
                break;
              case 4:
                endTime2 = filter_6_list[i].selectDate + " 22:00:00"
                break;
            }
          }
          if (i == 2) {
            switch (filter_6_list[i].selecttime[0]) {
              case 1:
                startTime3 = filter_6_list[i].selectDate + " 05:00:00"
                break;
              case 2:
                startTime3 = filter_6_list[i].selectDate + " 11:00:00"
                break;
              case 3:
                startTime3 = filter_6_list[i].selectDate + " 14:00:00"
                break;
              case 4:
                startTime3 = filter_6_list[i].selectDate + " 17:00:00"
                break;
            }
            switch (filter_6_list[i].selecttime[filter_6_list[i].selecttime.length - 1]) {
              case 1:
                endTime3 = filter_6_list[i].selectDate + " 11:00:00"
                break;
              case 2:
                endTime3 = filter_6_list[i].selectDate + " 14:00:00"
                break;
              case 3:
                endTime3 = filter_6_list[i].selectDate + " 17:00:00"
                break;
              case 4:
                endTime3 = filter_6_list[i].selectDate + " 22:00:00"
                break;
            }
          }
          if (i == 3) {
            switch (filter_6_list[i].selecttime[0]) {
              case 1:
                startTime4 = filter_6_list[i].selectDate + " 05:00:00"
                break;
              case 2:
                startTime4 = filter_6_list[i].selectDate + " 11:00:00"
                break;
              case 3:
                startTime4 = filter_6_list[i].selectDate + " 14:00:00"
                break;
              case 4:
                startTime4 = filter_6_list[i].selectDate + " 17:00:00"
                break;
            }
            switch (filter_6_list[i].selecttime[filter_6_list[i].selecttime.length - 1]) {
              case 1:
                endTime4 = filter_6_list[i].selectDate + " 11:00:00"
                break;
              case 2:
                endTime4 = filter_6_list[i].selectDate + " 14:00:00"
                break;
              case 3:
                endTime4 = filter_6_list[i].selectDate + " 17:00:00"
                break;
              case 4:
                endTime4 = filter_6_list[i].selectDate + " 22:00:00"
                break;
            }
          }
        }
      }
    }
    for (let i = 0; i < filter_0_list.length; i++) {
      if (filter_0_list[i].checked) {
        purpose += filter_0_list[i].typeid + ","
      }
    }
    for (let i = 0; i < filter_2_list.length; i++) {
      if (filter_2_list[i].checked) {
        figure += filter_2_list[i].typeid + ","
      }
    }
    for (let i = 0; i < filter_3_list.length; i++) {
      if (filter_3_list[i].checked) {
        job += filter_3_list[i].typeid + ","
      }
    }
    purpose = purpose.substr(0, purpose.length - 1)
    job = job.substr(0, job.length - 1);
    figure = figure.substr(0, figure.length - 1)
    if (!purpose) {
      app.tipToast(2, "健身目的至少选一个");
      return;
    }
    if (!startTime1 && !startTime2 && !startTime3 && !startTime4) {
      app.tipToast(2, "时间段至少选一个");
      return;
    }
    data = {
      regionId: _this.data.regionValue[2].id,
      userId: wx.getStorageSync('userId'),
      purpose: purpose,
      body: this.data.body,
    }
    if (startTime1 != '') {
      data.startTime1 = startTime1
      data.endTime1 = endTime1
    }
    if (startTime2 != '') {
      data.startTime2 = startTime2
      data.endTime2 = endTime2
    }
    if (startTime3 != '') {
      data.startTime3 = startTime3
      data.endTime3 = endTime3
    }
    if (startTime4 != '') {
      data.startTime4 = startTime4
      data.endTime4 = endTime4
    }
    if (this.data.userInfo2.level >= 3) {
      data.startAge = 16;
      data.endAge = this.data.choose_age;
      data.gender = this.data.gender;
      data.level = this.data.level;
      data.figure = figure;
      // if (data.endAge != '' && data.gender != '' && data.level != '' && data.figure!=''){
      // }else{
      //   app.tipToast(2, "精英会员模块还有未选择功能");
      //   return;
      // }
      if (this.data.userInfo2.level == 4) {
        data.job = job,
          data.income = this.data.income
      }
    }
    wx.showLoading({
      title: '搭伙中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    app._ajax(
      "post",
      "/partner/addPartnerpool",
      data,
      (data) => {
        _this.setData({
          userFilter: true,
          type: 2,
        })
        app.tipToast(1, data.msg, () => { _this.getBoardTemporaryList() });
      },
      (msg) => {
        if (msg =='用户详情资料不存在,请填写个人详细资料'){
          app.tipToast(2, msg,function(){
            wx.navigateTo({
              url: '../../pagesA/mine/person',
            })
          })
        }else{
          app.tipToast(2, msg);
        }
      }
    )
  },


  chooseRegion: function () {
    this.setData({
      showRegion: true,
    });
  },
  emitHideRegion: function (e) {
    this.setData({
      showRegion: e.detail.showRegion,
      regionValue: e.detail.regionValue,
    });
  },
  bindMultiPickerColumnChange: function (e) {
    let _this = this;
    if (e.detail.column == 0) {
      _this.gettwocity(_this.data.multiArray[0][e.detail.value].name)
    }
    if (e.detail.column == 1) {
      _this.getthreecity(_this.data.multiArray[1][e.detail.value].name)
    }
    if (e.detail.column == 2) {
    }
  },
  // 城市切换
  getusercity: function (cityid, checktype) {
    let _this = this;
    if (checktype == 1) {
      app._ajax(
        "post",
        "/data/queryCityByLevel",
        { level: 1 },
        (data) => {
          let allcitylist = _this.data.multiArray;
          for (let i = 0; i < data.data.length; i++) {
            allcitylist[0].push(data.data[i])
          }
          _this.setData({
            multiArray: allcitylist
          })
          _this.gettwocity(allcitylist[0][0].name)
        }
      )
    }
  },
  gettwocity: function (cityname) {
    let _this = this;
    app._ajax(
      "post",
      "/data/queryCityByLikeMergerName",
      { level: 2, mergerName: cityname },
      (data) => {
        let allcitylisttwo = _this.data.multiArray;
        let nowtwocitylist = []
        for (let i = 0; i < data.data.length; i++) {
          nowtwocitylist.push(data.data[i])
        }
        allcitylisttwo[1] = nowtwocitylist
        _this.setData({
          multiArray: allcitylisttwo
        })
      }
    )
  },
  bindMultiPickerChange: function (e) {
    let _this = this;
    let changevalue = e.detail.value
    let citynames = _this.data.multiArray;
    let cityname = ''
    let regionidss = ''
    if (e.detail.value[1] == null || e.detail.value[null]) {
      cityname = citynames[1][0].name
      regionidss = citynames[1][0].id
    } else {
      cityname = citynames[1][changevalue[1]].name
      regionidss = citynames[1][changevalue[1]].id
    }
    if(cityname!='杭州市'){
      app.tipToast(2,'该城市暂无开放健身房')
    }else{
      _this.getcitylist(cityname)
      _this.setData({
        pageNum: 1,
        cityname: cityname,
        regionid: regionidss
      })
      _this.pageGymShop()
    }
  },
  bindMultiPickerColumnChange: function (e) {
    let _this = this;
    if (e.detail.column == 0) {
      _this.gettwocity(_this.data.multiArray[0][e.detail.value].name)
    }
    if (e.detail.column == 2) {
    }
  },
  //城市切换结束
  chooseRegion2: function () {
    this.setData({
      showRegion2: true,
    });
  },
  emitHideRegion2: function (e) {
    this.setData({
      showRegion2: e.detail.showRegion,
      regionValue2: e.detail.regionValue,
    });
  },
  //获取健身房信息
  pageGymShop: function () {
    var _this = this;
    app._ajax(
      "post",
      "/data/queryCityByLikeMergerName",
      {
        mergerName:_this.data.cityname,
        level:2
      },
      (res) => {

        let pageShopdata = {
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          pageNum: this.data.pageNum,
          pageSize: this.data.pageSize,
          cityId:res.data[0].id
        }
        if (_this.data.cityquname.id != 0) {
          pageShopdata.districtId = _this.data.cityquname.id
        }
        if (_this.data.bid.length >= 1) {
          pageShopdata.gymBuildingPOS = _this.data.bid
        }
        if (_this.data.sid.length >= 1) {
          pageShopdata.gymSubjectPOS = _this.data.sid
        }
        app._ajaxjson(
          "post",
          "/gymshop/pageGymShop?pageNum=" + this.data.pageNum + '&pageSize=' + this.data.pageSize,
          pageShopdata,
          (res) => {
            var gymList = _this.data.gymList;
            var datalist = res.data.content;
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
            if (_this.data.pageNum==1){
              gymList=[]
            }
            for (let i = 0; i < datalist.length; i++) {
              let distance = distanceByLnglat(_this.data.longitude, _this.data.latitude, datalist[i].longitude, datalist[i].latitude)
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
            })
          }
        )
      },(msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  // 价格排序
  pricesort: function () {
    let _this = this;
    let allshop = _this.data.gymList;
    function compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    }
    allshop = allshop.sort(compare('gymEnergy'))
    _this.setData({
      gymList:allshop
    })
  },
  // 距离排序
  placesort: function () {
    let _this = this;
    let allshop = _this.data.gymList;
    function compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      }
    }
    allshop = allshop.sort(compare('distancecontrasts'))
    _this.setData({
      gymList: allshop
    })
  },
  filterGym: function (e) {
    let _this = this;
    if (e.currentTarget.dataset.type == 1) {
      let biddata = _this.data.bid
      let nowbid = e.currentTarget.dataset.bid
      let BuildingAlldatas = _this.data.BuildingAll
      for(let j=0;j<BuildingAlldatas.length;j++){
        BuildingAlldatas[j].checked=false
      }
      if(biddata.length<1){
        let nowbiddata = { bid: nowbid }
        biddata.push(nowbiddata)
      }else{
        let checked = true;
        let changearr = -1;
        for(let i=0;i<biddata.length;i++){
          if(biddata[i].bid==nowbid){
            checked=false
            biddata.splice(i,1)
          }
        }
        if(checked){
          let nowbiddata = { bid: nowbid }
          biddata.push(nowbiddata)
        }
      }
      for (let i = 0; i < biddata.length; i++) {
        for (let j = 0; j < BuildingAlldatas.length; j++) {
          if (biddata[i].bid == BuildingAlldatas[j].bid) {
            BuildingAlldatas[j].checked = true
          }
        }
      }
      this.setData({
        bid: biddata,
        BuildingAll:BuildingAlldatas
      })
    } else if (e.currentTarget.dataset.type == 2) {
      let siddata = _this.data.sid
      let nowsid = e.currentTarget.dataset.sid
      let SubjectAlldatas = _this.data.SubjectAll
      for (let j = 0; j < SubjectAlldatas.length; j++) {
        SubjectAlldatas[j].checked = false
      }
      if (siddata.length < 1) {
        let nowsiddata = { sid: nowsid }
        siddata.push(nowsiddata)
      } else {
        let checked = true;
        let changearr = -1;
        for (let i = 0; i < siddata.length; i++) {
          if (siddata[i].sid == nowsid) {
            checked = false
            siddata.splice(i, 1)
          }
        }
        if (checked) {
          let nowsiddata = { sid: nowsid }
          siddata.push(nowsiddata)
        }
      }
      for (let i = 0; i < siddata.length; i++) {
        for (let j = 0; j < SubjectAlldatas.length; j++) {
          if (siddata[i].sid == SubjectAlldatas[j].sid) {
            SubjectAlldatas[j].checked = true
          }
        }
      }
      this.setData({
        sid: siddata,
        SubjectAll: SubjectAlldatas
      })
    } else if (e.currentTarget.dataset.type == 3) {
      let SubjectAlldatas = _this.data.SubjectAll
      for (let j = 0; j < SubjectAlldatas.length; j++) {
        SubjectAlldatas[j].checked = false
      }
      let BuildingAlldatas = _this.data.BuildingAll
      for (let j = 0; j < BuildingAlldatas.length; j++) {
        BuildingAlldatas[j].checked = false
      }
      this.setData({
        cityquname: { cityname: '全部区域', id: 0 },
        bid: [],
        sid: [],
        BuildingAll: BuildingAlldatas,
        SubjectAll: SubjectAlldatas
      })
    }
  },
  callPhoneok: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.callphoneNumber + '' // 仅为示例，并非真实的电话号码
    })
  },
  callshowhidden: function (e) {
    let _this = this;
    _this.setData({
      phoneshow: false,
    })
  },
  callPhone: function (e) {
    let _this = this;
    _this.setData({
      phoneshow: true,
      callphoneNumber: e.currentTarget.dataset.number // 仅为示例，并非真实的电话号码
    })
  },
  changesearchshop:function(e){
    this.setData({
      changesearctext:e.detail.value
    })
  },
  searchshop:function(e){
    this.setData({
      changesearctext: e.detail.value
    })
    this.getGoodsList(0)
  },
  // 商品价格排序
  pricerank:function(){
    let _this = this;
    let allshops = _this.data.goodsList;
    allshops = allshops.sort(_this.compare('realPrice'))
    _this.setData({
      goodsList:allshops
    })
  },
  compare: function (property){
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  compare2: function (property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  },
  // 销量排序
  salerank: function () {
    let _this = this;
    let allshops = _this.data.goodsList;
    allshops = allshops.sort(_this.compare('salesVolume'))
    _this.setData({
      goodsList: allshops
    })
  },
  // 商城产品查询
  getGoodsList: function (type) {
    var _this = this;
    let url, data;
    if (type != 0) {
      url = "/product/pageAll";
      data = { productTypeId: type,  pageNum: this.data.goods_num,name:this.data.changesearctext }
    } else {
      url = "/product/pageAll";
      data = { pageNum: this.data.goods_num, pageSize: 10, name: this.data.changesearctext}
    }
    app._ajax(
      "post",
      url,
      data,
      (res) => {
        let goodsList = _this.data.goodsList;
        var data = res.data.content;
        if(_this.data.goods_num>1){
          for (let i = 0; i < data.length; i++) {
            goodsList.push(
              data[i]
            );
          }
        }else{
          goodsList=data
        }
        if (type == 5 || type == 6) {
          this.getshopcard(2)
        } else {
          this.getshopcard(1)
        }
        _this.setData({
          goodsList: goodsList,
        })
      }
    )
  },

  onReachBottom: function () {
    if (this.data.current == 0) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.pageGymShop();
    }
    if (this.data.current == 3) {
      this.setData({
        goods_num: this.data.goods_num + 1
      })
      this.getGoodsList(this.data.currentNav);
    }
  },

  // 商城
  storeNavChoice: function (e) {
    this.setData({
      currentNav: e.currentTarget.dataset.id,
      goodsList: [],
      goods_num: 1,
    })
    this.getGoodsList(e.currentTarget.dataset.id)
  },


  closeModal: function () {
    this.setData({
      tipsModal: false,
      tips_1: false,
      tips_2: false,
      tips_3: false,
      tips_4: false,
      tips_5: false,
    })
  },


  onShow: function () {
    let _this=this;
    app.jglogins()
    this.gettemprorydata()
    this.getUserInfo2();
    this.getSportsStatu();
    var today = new Date();//当前时间  
    var y = today.getFullYear();//年  
    var mon = today.getMonth() + 1;//月  
    var d = today.getDate();//日  
    var i = today.getDay();//星期
    // for()
    let monthtime = mon
    let daytime = d
    if (monthtime < 10) {
      monthtime = '0' + monthtime
    }
    if (daytime < 10) {
      daytime = '0' + daytime
    }
    // let newnowDate = _this.data.filter_6_list;
    // for(let i=0;i<newnowDate.length;i++){
    //   newnowDate[i].selectDate = y + '-' + monthtime + '-' + daytime;
    // }
    this.setData({
      curYear: y,
      curMonth: mon,
      nowselectedDate: y + '-' + monthtime + '-' + daytime,
      selectedDate: y + '-' + monthtime + '-' + daytime,
      selectedWeek: this.data.weekArr[i]
    });

    this.getDateList(y, mon - 1);
    this.getshopcard(1);
    this.getuserdetail();
  },
  // 月份日期
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
    let nowdate =new Date()
    let nowdates = new Date(nowdate.getTime() - 24 * 60 * 60 * 1000); 
    var weekIndex = 0;//第几个星期
    for (var i = 0; i < vm.data.daysCountArr[mon]; i++) {
      var week = new Date(y, mon, (i + 1)).getDay();
      let timecheck =false;
      if (nowdates <= new Date(y, mon, (i + 1))){
        timecheck=true
      }
      // 如果是新的一周，则新增一周
      if (week == 0) {
        weekIndex++;
        dateList[weekIndex] = [];
      }
      let monthtime=mon+1 
      let daytime=i+1
      if(monthtime<10){
        monthtime='0'+monthtime
      }
      if(daytime<10){
        daytime='0'+daytime
      }
      // 如果是第一行，则将该行日期倒序，以便配合样式居右显示
      if (weekIndex == 0) {
        dateList[weekIndex].unshift({
          value: y + '-' + monthtime + '-' + daytime,
          date: i + 1,
          week: week,
          ischeck:timecheck
        });
      } else {
        dateList[weekIndex].push({
          value: y + '-' + monthtime + '-' + daytime,
          date: i + 1,
          week: week,
          ischeck: timecheck
        });
      }
    }
    vm.setData({
      dateList: dateList
    });
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
  // 获取购物车
  getshopcard: function (e) {
    let _this = this;
    app._ajax(
      "post",
      "/cart/countCart",
      {
        userId: wx.getStorageSync('uid'),
        settlementType: e
      },
      (data) => {
        _this.setData({
          buyshoplength: data.data.amount,
          shoptotalPrice: data.data.totalPrice
        });

      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  goliaotian: function (e) {
    wx.navigateTo({
      url: '/pages/chat/content?calltype=' + e.currentTarget.dataset.ltid+'&userId=' + e.currentTarget.dataset.frid,
    })
  }
})