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
    msgList: [],
    scrollHeight: '100vh',
    inputBottom: 0,
    kfdata: {},
    // target_username: "", 
    // target_username: "OYOC_1558775849048", 
    target_username: "",
    items: [
      { name: '5', value: '非常满意', checked: false},
      { name: '2', value: '不满意', checked: false},
      { name: '4', value: '满意', checked: false},
      { name: '1', value: '非常不满意', checked: false},
      { name: '3', value: '一般', checked: false},
    ],
    itemstwo: [
      { name: '1', value: '解决了', checked: false},
      { name: '0', value: '没有解决', checked: false},
    ],
    showheight:0,
    satscore: '0',
    proposaltext: '',
    problemcore: '',
    kfshow: false,
    shopdata:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.shopid!=undefined){
      this.getGoodsInfo(options.shopid)
    }
    // this.setData({
    //   calltypeid: options.calltype
    // })
    // app._ajax(
    //   "post",
    //   "/user/queryUserByUserId",
    //   { userId: options.userId },
    //   (res) => {
    //     console.log(res)
    //     this.setData({
    //       friendimg: res.data.avatarUrl,
    //       target_username: res.data.jiguangUsername,
    //     })
    //   })
    this.setData({
      // luachpeople: options.userId,
      cusHeadIcon: app.globalData.userInfo.avatarUrl,
      tar_cusHeadIcon: "../../res/imgs/default.jpg",
      // tar_cusHeadIcon: options.avatarUrl,        
    });

  },
  getGoodsInfo: function (shopid) {//获取商品详情
    var _this = this;
    app._ajax(
      "post",
      "/product/findById",
      { id: shopid },
      (res) => {
        _this.setData({
          shopdata:res.data,
          shopshow:true,
          showheight:310
        })
      }
    )
  }, 
  getkf: function () {
    let _this = this;
    app._ajax(
      "post",
      "/customerService/queryServiceUser",
      { userId:wx.getStorageSync('uid')},
      (res) => {
        _this.setData({
          kfdata: res.data.servicePersonnelPO,
          target_username: res.data.servicePersonnelPO.jpushName
        })
          // 用户信息
        app._ajax(
          "post",
          "/user/queryUserByUserId",
          { userId: wx.getStorageSync('userId') },
          (res) => {
            this.setData({
              userjiguangname: res.data.jiguangUsername,
              userjiguangpassword: res.data.jiguangPassword,
            })
            // 开始服务
            app._ajax(
              "post",
              "/customerService/startService",
              { serviceId: _this.data.kfdata.id, jPushId: res.data.jiguangUsername },
              (res) => {
              }, (msg) => {
                app.tipToast(2, msg)
              })
            this.jimLogin(res.data.jiguangUsername, res.data.jiguangPassword);
          }, (msg) => {
            app.tipToast(2, msg)
          })
        }, (msg) => {
          app.tipToast(2, msg, function () {
            wx.navigateBack()
          })
        }
    )
  },
  // 客服详情
  gokfdetaiil: function () {
    let _this = this
    wx.navigateTo({
      url: '/pages/customerservice/customerindex?kfid=' + _this.data.kfdata.id + '&workid=' + _this.data.kfdata.workNumber,
    })
  },
  // 客服评价页面
  gokfevaluate: function () {
    let _this = this
    wx.navigateTo({
      url: '/pages/customerservice/serviceeval?kfid=' + _this.data.kfdata.id,
    })
  },
  // 打赏客服
  gokfreward: function () {
    let _this = this
    wx.navigateTo({
      url: '/pages/customerservice/rewardkf?kfid=' + _this.data.kfdata.id,
    })
  },
  showkfshow: function () {
    this.setData({
      kfshow: true
    })
  },
  showkfhiden: function () {
    this.setData({
      kfshow: false
    })
  },
  pushkfpj:function(){
    let _this =this;
    if (_this.data.satscore == '0' || _this.data.problemcore==''){
      app.tipToast(2,'请填写完整信息')
    }else{
      app._ajax(
          "post",
          "/customerService/insertServiceComment",
        { userId: wx.getStorageSync('uid'), serviceId: _this.data.kfdata.id, level: _this.data.satscore, solved: _this.data.problemcore, content:_this.data.proposaltext},
          (res) => {
            app.tipToast(1, '本次服务评价成功')
            _this.setData({
              kfshow:false
            })
          },(msg) => {
          app.tipToast(2, msg)
        })
    }
  },
  // 满意度评分
  checkboxChange: function (e) {
    let _this = this;
    let itemslength = e.detail.value
    let itemsdata = _this.data.items;
    let itemscore = '0'
    for (let i = 0; i < itemsdata.length; i++) {
      itemsdata[i].checked = false
    }
    for (let i = 0; i < itemsdata.length; i++) {
      if (itemsdata[i].name == itemslength[itemslength.length - 1]) {
        itemsdata[i].checked = true
      }
    }
    this.setData({
      items: itemsdata,
      satscore: itemslength[itemslength.length - 1]
    })
  },
  // 是否解决问题
  checkboxChangetwo: function (e) {
    let _this = this;
    let itemslength = e.detail.value
    let itemsdata = _this.data.itemstwo;
    for (let i = 0; i < itemsdata.length; i++) {
      itemsdata[i].checked = false
    }
    for (let i = 0; i < itemsdata.length; i++) {
      if (itemsdata[i].name == itemslength[itemslength.length - 1]) {
        itemsdata[i].checked = true
      }
    }
    this.setData({
      itemstwo: itemsdata,
      problemcore: itemslength[itemslength.length - 1]
    })
  },
  // 建议
  changeproposal: function (e) {
    this.setData({
      proposaltext: e.detail.value
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
            _this.setData({
              msgList: []
            })
            //监听实时会话信息
            jim.onMsgReceive(function (data) {
              let launchshow = 0;
              let datacontent = {}
              let contentdatas = data.messages[0].content.msg_body.text
              if (data.messages[0].content.msg_body.extras != undefined ) {
                let shopdata = {}
                if (data.messages[0].content.msg_body.extras.content != undefined) {
                  shopdata = JSON.parse(data.messages[0].content.msg_body.extras.content)
                }
                if (data.messages[0].content.msg_body.extras.type == 1) {
                  datacontent = shopdata
                  contentdatas = '商品链接'
                  launchshow = 1;
                }
                if (data.messages[0].content.msg_body.extras.type == 2) {
                  contentdatas = '商城订单';
                  datacontent = shopdata;
                  launchshow = 2;
                }
                if (data.messages[0].content.msg_body.extras.type == 3) {
                  contentdatas = '确认订单';
                  datacontent = shopdata;
                  launchshow = 3;
                }
                if (data.messages[0].content.msg_body.extras.type == 6) {
                  contentdatas = '聊天结束';
                  _this.setData({
                    overshow: true,
                    kfshow:true,
                    showheight: 220
                  })
                  datacontent = shopdata;
                  launchshow = 6;
                }
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
              let userdata = []
              for (let i = 0; i < data.length; i++) {
                if (_this.data.target_username == data[i].from_username) {
                  userdata = data[i].msgs
                }
              }
              let index = 0;
              if (userdata.length > 50) {
                index = userdata.length - 50
              }
              for (let i = index; i < userdata.length; i++) {
                let launchshow = 0;
                let showtype = 'customer'
                let datacontent = {}
                if (_this.data.target_username == userdata[i].content.from_id) {
                  showtype = 'server'
                }
                let contentdatas = userdata[i].content.msg_body.text
                if (userdata[i].content.msg_body.extras != undefined ) {
                  let shopdata = {}
                  if (userdata[i].content.msg_body.extras.content!=undefined){
                    shopdata = JSON.parse(userdata[i].content.msg_body.extras.content)
                  }
                  if (userdata[i].content.msg_body.extras.type == 1) {
                    datacontent = userdata[i].content.msg_body.extras.shopdata
                    contentdatas = '商品链接'
                    launchshow = 1;
                  }
                  if (userdata[i].content.msg_body.extras.type == 2) {
                    contentdatas = '商城订单';
                    datacontent = shopdata;
                    launchshow = 2;
                  }
                  if (userdata[i].content.msg_body.extras.type == 3) {
                    contentdatas = '确认订单';
                    datacontent = shopdata;
                    launchshow = 3;
                  }
                  if (userdata[i].content.msg_body.extras.type == 6) {
                    contentdatas = '聊天结束';
                    datacontent = shopdata;
                    launchshow = 6;
                  }
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
    let _this = this;
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
  gotodetail:function(e){
    wx.navigateTo({
      url: '/pages/order/orderdetaile?orderid='+e.currentTarget.dataset.orderid,
    })
  },
  pushshop: function (e) {
    let _this =this;
    let pushdata ={}
    let content ='商品详情';
    let shopid =0
    let shopdatas = _this.data.shopdata
    let showdatas ={}
    if(e.currentTarget.dataset.type==1){
      shopid=1;
      showdatas = shopdatas
      pushdata = { shopdata: shopdatas, type: 1 }
    }
    if (e.currentTarget.dataset.type == 2) {
      content = '确认订单'
      pushdata = { type: 4, orderid: e.currentTarget.dataset.orderid}
    }
    if (e.currentTarget.dataset.type == 3) {
      content = '修改订单'
      pushdata = { type: 5, orderid: e.currentTarget.dataset.orderid}
    }
    app.jim.sendSingleMsg({
      'target_username': _this.data.target_username,
      'content': content,
      'extras': pushdata,
    }).onSuccess(function (data) {
      inputVal = '';
      _this.setData({
        inputVal
      });
      _this.addMsg("customer", "text", content, shopid, showdatas);
      }).onFail(function (data) {
      })
  },
  sendImages: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: 'album', // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        app.jim.sendSinglePic({
          'target_username': _this.data.target_username,
          'image': res.tempFilePaths[0] //设置图片参数
        }).onSuccess(function (data, msg) {
          _this.addMsg("customer", "image", res.tempFilePaths[0])
        }).onFail(function (data) {
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getkf()
    // console.log(this.data.luachpeople)
    // app._ajax(
    //   "post",
    //   "/user/queryUserByUserId",
    //   { userId: wx.getStorageSync('userId') },
    //   (res) => {
    //     console.log(res)
    //     this.setData({
    //       userjiguangname: res.data.jiguangUsername,
    //       userjiguangpassword: res.data.jiguangPassword
    //     })
    //     this.jimLogin(res.data.jiguangUsername, res.data.jiguangPassword);
    //   })
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
    let _this = this;
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
    let _this = this;
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