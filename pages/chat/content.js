// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList:[],
    scrollHeight: '100vh',
    inputBottom: 0,
    multiIndex:0,
    // target_username: "", 
    // target_username: "OYOC_1558775849048", 
    target_username: "OYOC_1560252592938", 
    regionValue: [{ name: "浙江省", id: 933 }, { name: "杭州市", id: 934 }, { name: "下城区", id: 935 }],//区域筛选
    showRegion: false,
    regionname:'',
    faqishow:false,
    luachpeople:'',
    friendimg:'',
    multiArray: [[],[]],
    gymshoplist:[],
    paylist: [{ name: '公平公正,双方押金各自付', value: 'AA'}, { name: '积极邀约,双方押金我全担', value: 'A'}, { name: '尝试受邀,双方押金他全担', value: 'B'}],
    launchday:'日期',
    launchtime: '时间段',
    servicepoint:'选择',
    servicepointid:'',
    paytype:'选择',
    paytypevalue:'',
    yearDay:[],
    changetime:'',
    userjiguangname:'',
    userjiguangpassword:'',
    calltypeid:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      calltypeid: options.calltype
    })
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: options.userId },
      (res) => {
        this.setData({
          friendimg: res.data.avatarUrl,
          target_username: res.data.jiguangUsername,
        })
      })
    this.setData({
      luachpeople: options.userId,
      cusHeadIcon: app.globalData.userInfo.avatarUrl,
      tar_cusHeadIcon: "../../res/imgs/default.jpg",
      // tar_cusHeadIcon: options.avatarUrl,        
    });
    let date = new Date();

    var monthDay = [];
    let yearDay =[];
    // 月-日
    for (var i = 0; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      let nowmonth = date1.getMonth() + 1;
      let nowdate = date1.getDate();
      if (nowmonth < 10) {
        nowmonth = '0' + nowmonth
      }
      if (nowdate < 10) {
        nowdate = '0' + nowdate
      }
      let yeartime = date1.getFullYear()+'-'+ nowmonth+'-'+nowdate;
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
      yearDay.push(yeartime)
    }
    let datatime = this.data.multiArray;
    datatime[0]=monthDay
    datatime[1]=['05:00-11:00','11:00-14:00','14:00-17:00','17:00-22:00']
    this.setData({
      multiArray: datatime,
      yearDays: yearDay
    })

  },
  gofirenddata:function(){
    wx.navigateTo({
      url: "/pages/chat/usergrzl?userId=" + this.data.luachpeople,
    })
  },
  gotoour:function(){
    wx.navigateTo({
      url: "/pages/chat/usergrzl?userId=" + wx.getStorageSync('userId'),
    })
  },
  pickerTap:function(e){
  },
  bindStartMultiPickerChange:function(e){
    let _this =this;
    let changetime = _this.data.multiArray
    _this.setData({
      launchday: _this.data.multiArray[0][e.detail.value[0]],
      launchtime: _this.data.multiArray[1][e.detail.value[1]],
      changetime:_this.data.yearDays[e.detail.value[0]]
    })
  },
  bindTypeChange:function(e){
    let _this = this;
    let changetype = _this.data.paylist;
    _this.setData({
      paytype:changetype[e.detail.value].name,
      paytypevalue:changetype[e.detail.value].value
    })
  },
  bindGymshop:function(e){
    let _this =this;
    let gymshopname = _this.data.gymshoplist;
    _this.setData({
      servicepoint: gymshopname[e.detail.value].gymName,
      servicepointid: gymshopname[e.detail.value].gymShopId
    })
  },
  jimLogin: function (username, password) {
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
            'username': username,
            'password': password,
          }).onSuccess(function (data) {
            // var count = jim.getUnreadMsgCnt({
            //   'username': username
            // });
            //监听实时会话信息
            jim.onMsgReceive(function (data) {
              let launchshow =0;
              let datacontent ={}
              let contentdatas = data.messages[0].content.msg_body.text
              if(data.messages[0].content.msg_body.text=='oyoc共享健身搭伙发起asdorjaihjiadpqo'){
                contentdatas='搭伙邀请'
                launchshow =1;
                datacontent = data.messages[0].content.msg_body.extras
              }
              if (data.messages[0].content.msg_body.text == 'oyoc共享健身搭伙同意asdorjaihjiadpqo') {
                contentdatas = '搭伙邀约成功!'
                launchshow = 2;
              }
              if (data.messages[0].content.msg_body.text == 'oyoc共享健身搭伙拒绝asdorjaihjiadpqo') {
                contentdatas = '搭伙邀约失败!'
                launchshow = 3;
              }
              if (data.messages[0].content.msg_type == 'image') {
                jim.getResource({
                  'media_id': data.messages[0].content.msg_body.media_id,
                }).onSuccess(function (data2) {
                  _this.addMsg("server", contentdatas, data2.url, launchshow, datacontent);
                });
              } else {
                _this.addMsg("server", data.messages[0].content.msg_type, contentdatas, launchshow, datacontent);
              }
            });
            //监听离线新消息
            jim.onSyncConversation(function (data) {
              let userdata=[]
              for(let i=0;i<data.length;i++){
                if (_this.data.target_username == data[i].from_username){
                  userdata = data[i].msgs
                }
              }
              let index = 0;
              if(userdata.length>50){
                index =userdata.length-50
              }
              for (let i = index; i < userdata.length;i++){
                let launchshow = 0;
                let showtype = 'customer'
                let datacontent = {}
                if (_this.data.target_username == userdata[i].content.from_id){
                  showtype = 'server'
                }
                let contentdatas = userdata[i].content.msg_body.text
                if (userdata[i].content.msg_body.text == 'oyoc共享健身搭伙发起asdorjaihjiadpqo') {
                  datacontent = userdata[i].content.msg_body.extras
                  contentdatas = '搭伙邀请'
                  launchshow = 1;
                }
                if (userdata[i].content.msg_body.text == 'oyoc共享健身搭伙同意asdorjaihjiadpqo') {
                  contentdatas = '搭伙邀约成功!'
                  launchshow = 2;
                }
                if (userdata[i].content.msg_body.text == 'oyoc共享健身搭伙拒绝asdorjaihjiadpqo') {
                  contentdatas = '搭伙邀约失败'
                  launchshow = 3;
                }
                if (userdata[i].content.msg_type == 'image') {
                  jim.getResource({
                    'media_id': userdata[i].content.msg_body.media_id,
                  }).onSuccess(function (data2) {
                    _this.addMsg(showtype, contentdatas, data2.url, launchshow, datacontent);
                  });
                } else {
                  _this.addMsg(showtype, userdata[i].content.msg_type, contentdatas, launchshow, datacontent);
                }
              }
            });
          }).onFail(function (data) {
            //同上
          });
        }).onFail(function (data) {
          _this.setData({
            msgList: data[0].msgs
          })
        });
      }
    )
  },

  addMsg: function (speaker, type, msg, launchid, datacontent) {
    let _this=this;
    let msglists = _this.data.msgList;
    msglists.push({
      speaker: speaker,
      contentType: type,
      content: msg,
      showid: launchid,
      datacontents: datacontent
    })
    this.setData({
      msgList: msglists
    })
  },
  launchdahuo:function(){
    this.setData({
      faqishow: false
    })
    var _this = this;
    if (_this.data.changetime == '' || _this.data.regionId == '' || _this.data.servicepoint == '选择' || _this.data.paytype=='选择'){
    }else{
      let startendtime = _this.data.launchtime
      let timearr = startendtime.split('-')
      let startTime = _this.data.changetime+" "+timearr[0]+':00';
      let endTime = _this.data.changetime + " " + timearr[1] + ':00';
      app._ajax(
        "post",
        "/partner/addPartnerRecord",
        {
          gymShopId: _this.data.servicepointid,
          auserId: wx.getStorageSync('userId'),
          buserId:_this.data.luachpeople,
          time:startTime,
          endTime: endTime,
          payType: _this.data.paytypevalue,
          cityName: _this.data.regionname,
          promiseTime: _this.data.changetime,
        },
        (data) => {
          if(data.code==200){
            app.jim.sendSingleMsg({
              'target_username': _this.data.target_username,
              'content': 'oyoc共享健身搭伙发起asdorjaihjiadpqo',
              'extras': { gymname: _this.data.servicepoint, starttimes: starttimes, cityname1: usercitys[0], cityname2: usercitys[1], cityname3: usercitys[2], startdate: startDate,jlid:data.data },
            }).onSuccess(function (data) {
              inputVal = '';
              _this.setData({
                inputVal
              });
              _this.addMsg("customer", "text", '邀请发送', 1, '');
            })
          }
        },
        (msg) => {
          app.tipToast(2, msg);
        }
      )
    }
  },
  launchshowbtn:function(){
    this.setData({
      faqishow: !this.data.faqishow
    })
  },
  launchok:function(){
    app._ajax(
      "post",
      "/partner/queryByABuserId",
      { buserId: wx.getStorageSync('userId'), auserId: this.data.luachpeople },
      (res) => {
        app._ajax(
          "post",
          "/partner/partnerYES",
          { id:res.data[res.data.length-1].id },
          (res) => {
        })
    })
  },
  launchno: function () {
    app._ajax(
      "post",
      "/partner/queryByABuserId",
      { auserId: wx.getStorageSync('userId') },
      (res) => {
        app._ajax(
          "post",
          "/partner/partnerNO",
          { id: res.data[0].id },
          (res) => {

          })
      })
  },
  sendImages:function(){
    var _this=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: 'album', // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        app.jim.sendSinglePic({
          'target_username': _this.data.target_username,
          'image': res.tempFilePaths[0] //设置图片参数
        }).onSuccess(function (data, msg) {
          _this.addMsg("customer","image", res.tempFilePaths[0])
        }).onFail(function (data) {
        });
      }
    })
  },
  // 搭伙弹窗
  chooseRegion: function () {
    this.setData({
      showRegion: true,
    });
  },
  godetails: function(e){
    let _this =this;
    wx.navigateTo({
      url: '/pages/chat/boarddetail?myuserId=' + wx.getStorageSync('userId') + '&heuserId=' + _this.data.luachpeople + '&hisjg=' + _this.data.target_username + '&dhid=' + e.currentTarget.dataset.id,
    })
  },
  emitHideRegion: function (e) {
    let citynames = e.detail.regionValue[0].name + e.detail.regionValue[1].name + e.detail.regionValue[2].name
    this.setData({
      showRegion: e.detail.showRegion,
      regionValue: e.detail.regionValue,
      regionname: citynames
    });
    app._ajax(
      "post",
      "/gymshop/queryByMatching",
      { districtId: e.detail.regionValue[2].id},
      (res) => {
        this.setData({
          gymshoplist:res.data
        });
      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId') },
      (res) => {
        this.setData({
          userjiguangname: res.data.jiguangUsername,
          userjiguangpassword: res.data.jiguangPassword
        })
        this.jimLogin(res.data.jiguangUsername, res.data.jiguangPassword);
      })
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
   * 获取聚焦
   */
  focus: function (e) {
    let _this =this;
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (_this.data.msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    //计算msg高度
    // calScrollHeight(this, keyHeight);

  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    let _this =this;
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (_this.data.msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    var _this=this;
    app.jim.sendSingleMsg({
      'target_username': this.data.target_username,
      'content': e.detail.value,
    }).onSuccess(function (data) {
      inputVal = '';
      _this.setData({
        inputVal
      });
      _this.addMsg("customer", "text", e.detail.value,0,'');
    })
  },
  
  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  }

})