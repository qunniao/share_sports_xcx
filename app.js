//app.js
var JMessage = require('./libs/jmessage-wxapplet-sdk-1.4.0.min.js')
App({
  // //全局API地址
  api_url:  'https://back.zhanchengwlkj.com/gymnasium',
  // api_url: 'https://danbrown.mynatapp.cc/gymnasium', 
  // api_url: 'https://danbrown.mynatapp.cc', 
  // api_url:'http://47.96.31.157:8080/gymnasium',
  // api_url:'http://192.168.1.20:8080',
  // api_url:'http://192.168.1.24:8080',
  jim: "",
  data:{
    jiguanglist:[],
    noreads:''
  },
  onLaunch: function () {
    var _this = this;
    //如果需要一进入小程序就要求授权登录,可在这里发起调用
    // this.check(function (ret) {});
    this._ajax(
      "post",
      "/datab/queryBuildingAll",
      "",
      (data) => { wx.setStorageSync('BuildingAll', data.data); }
    )
    this._ajax(
      "post",
      "/datab/querySubjectAll",
      "",
      (data) => { wx.setStorageSync('SubjectAll', data.data); }
    )
    this._ajax(
      "post",
      "/files/queryObjFilePO",
      "",
      (data) => { wx.setStorageSync('imagesList', data.data); }
    )
    this.jim = new JMessage({
      debug : true
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // console.log(res)
              this.globalData.userInfo = res.userInfo;
              // _this._ajax(
              //   "post",
              //   "/user/updateUser",
              //   {
              //     userNike: res.userInfo.nickName,
              //     avatarUrl: res.userInfo.avatarUrl,
              //   }
              // )
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  jglogins: function () {
    let _this =this;
    let jim = this.jim
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
              let usernicke = res.data.userNike;
              jim.login({
                'username': res.data.jiguangUsername,
                'password': res.data.jiguangPassword,
              }).onSuccess(function (data) {
                jim.updateSelfInfo({
                  'nickname': res.data.userNike,
                }).onSuccess(function (data) {
                  console.log('修改个人信息成功')
                  //data.code 返回码
                  //data.message 描述
                }).onFail(function (data) {
                  //同上
                });
                //监听实时会话信息
                console.log('登录成功了')
                // jim.onMsgReceive(function (data) {
                //   let launchshow = 0;
                //   let contentdatas = data.messages[0].content.msg_body.text
                //   console.log('聊天数据')
                //   console.log(data)
                //   if (data.messages[0].content.msg_body.text == 'oyoc共享健身搭伙发起asdorjaihjiadpqo') {
                //     contentdatas = '搭伙邀请'
                //     launchshow = 1;
                //   }
                // });
                //监听离线新消息
                jim.onSyncConversation(function (data) {
                  let jshistorylist =[]
                  for(let i=0;i<data.length;i++){
                      jshistorylist.push(data[i])
                  }
                    // jiguanglist=jshistorylist
                  _this.data.jiguanglist = jshistorylist
                  let noread = '';
                  let noreadlist = jshistorylist;
                  for (let i = 0; i < noreadlist.length; i++) {
                    noread += noreadlist[i].unread_msg_count
                  }
                  if (noread == 0) {
                    noread = ''
                  }
                  _this.data.noreads = noread
                  console.log('聊天数据')
                  console.log(jshistorylist)
                  // console.log(jim.islogin())
                  jim.loginOut()
                });
              }).onFail(function (data) {
              });
            }).onFail(function (data) {
              console.log(data);
              console.log('聊天登录失败')
              msgList: data[0].msgs
            });
          }
        )
      })
  },

  _ajax: function (type, url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    let app = this;
    data == "" ? data = {} : data;
    // data.userId = wx.getStorageSync('userId');
    wx.request({
      url: app.api_url + url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: type,
      data: data,
      success: function (res) {
        if (res.data.code === 200) {
          success && success(res.data);
        } else {
          fail && fail(res.data.msg);
        }
        return;
      },
      fail: function (res) {
        fail && fail("网络状况不佳,请稍后再试");
      },
      complete: function (res) {
        // wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res);
      }
    });
  },
  _ajaxjson: function (type, url, data, success, fail, complete) {
    wx.showNavigationBarLoading();
    let app = this;
    data == "" ? data = {} : data;
    // console.log(JSON.stringify(data));
    // data.userId = wx.getStorageSync('userId');
    wx.request({
      url: app.api_url + url,
      header: {
        'content-type': 'application/json',
      },
      dataType: "json",
      method: type,
      data: JSON.stringify(data),
      success: function (res) {
        if (res.data.code === 200) {
          success && success(res.data);
        } else {
          fail && fail(res.data.msg);
        }
        return;
      },
      fail: function (res) {
        fail && fail("网络状况不佳,请稍后再试");
      },
      complete: function (res) {
        // wx.hideLoading();
        wx.hideNavigationBarLoading();
        complete && complete(res);
      }
    });
  },

  tipToast: function (type, msg, callback) {
    wx.showToast({
      title: msg,
      icon: type == 1 ? 'success' : 'none',
      success: function () {
        callback && (setTimeout(function () {
          callback();
        }, 2500));
      }
    });
  },

  /* 关于登录 */
  //判断是否登录
  check: function () {
    let _this=this;
    if (wx.getStorageSync('userId')) {
      wx.checkSession({
        success() {
          // session_key 未过期，并且在本生命周期一直有效
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          _this.login(); // 重新登录
        }
      })
    } else {
      _this.login(); // 登录
    }

  },
  //登录
  login: function () {
    var _this = this;
    //调用登录接口
    wx.login({
      success: function (res) {
        if (res.code) {
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxc2c9c1f68146c9a6&secret=5fcf886f6f5ba74d6a357fd404b2d6dd&js_code=' + res.code + '&grant_type=authorization_code',
          //   data: {},
          //   header: {
          //     'content-type': 'json'
          //   },
          //   success: function (res) {
          //     var openid = res.data.openid //返回openid
          //     wx.setStorageSync('openid', res.data.openid)
          //     console.log('openid为' + openid);
          //   }
          // })
          // console.log(res.code);
          _this._ajax(
            "post",
            "/wxlog/loginUserForWX",
            {
              code: res.code,
            },
            (data) => {
              // console.log(data);
              wx.setStorageSync('userId', data.data.userId);
              wx.setStorageSync('uid', data.data.uid);
            }, (msg) => {
              wx.setStorageSync('userId', "");
              wx.showToast({
                title: msg,
                icon: 'none',
                success: function () {
                  // callback && (setTimeout(function () {
                  //   callback();
                  // }, 2500));
                }
              });
              // console.log("用户登录失败");
            }
          )
        } else {
          // console.log("用户登录失败");
        }
      },
    });
  },
  globalData: {
    userInfo: null,//头像和昵称
  }
})