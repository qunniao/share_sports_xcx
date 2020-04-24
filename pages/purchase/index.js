//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    types: 1,
    type: 1,//1-体验 2-大众 3-精英 4-皇家
    handlingBtn: false,//会员办理
    handlingBtn2: false,//会员激活
    power_1: false,
    power_2: false,
    power_3: false,
    levelList: [{ img: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/c9041d908fcf41349be5ff63da028fef.png' }, { img: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/d2082478d8f948528a8ba41d3bb0e6de.png' }, { img: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/1690e14e847c4a79b1d1cd3175bdd166.png' }, { img: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/eb104e8455ed45c98ea1d0864db331ea.png' }],
    index:0,
    buyname:'',
    buyphone:'',
    buycode:'',
    buynum:0,
    buyadress:'',
    btntext:'获取验证码',
    btntext2: '获取验证码',
    allbuymoney:'',
    handleid:1,
    membername: '',
    memberphone: '',
    membercode: '',
    memberacc:'',
    memberpwd:'',
    handlelist: [{ name: '会员购买并激活', id: 1,level:100 }, { name: '会员购买待激活', id: 2,level:1 }],
    levedata:[],
    multiArray: [[], []],
    cityname:'杭州市',
    numlist:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
  },
  onLoad: function (options) {
    if (options.level!=undefined){
      this.setData({
        type: options.level,
        index: options.level - 1
      })
    }else{
      this.getUserLevel()
    }
    if (wx.getStorageSync('cityname')!=undefined){
      this.setData({
        cityname: wx.getStorageSync('cityname')
      })
    }
    this.getusercity(0, 1)
  },
  choosePay: function (e) {
    this.setData({
      types: e.currentTarget.dataset.type
    })
  },
  chooseRegion: function () {
    this.setData({
      changeadresswRegion: true,
    });
  },
  changeadress:function(e){
    this.setData({
      buyadress:e
    })
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
    if (cityname != '杭州市') {
      app.tipToast(2, '该城市暂无开放健身房')
    } else {
      // _this.getcitylist(cityname)
      _this.setData({
        pageNum: 1,
        cityname: cityname,
        regionid: regionidss
      })
      // _this.pageGymShop()
    }
  },
  bindMultiPickerColumnChange: function (e) {
    let _this = this;
    if (e.detail.column == 0) {
      _this.gettwocity(_this.data.multiArray[0][e.detail.value].name)
    }
    if (e.detail.column == 2) {
      // console.log(_this.data.multiArray[2][e.detail.value])
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
    // console.log(e);
  },
  getUserLevel: function () {
    var _this = this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        let userlevel =data.data.level;
        if (userlevel<4){
          userlevel+=1;
        }
        _this.getlevelmoney()
        _this.setData({
          type: userlevel,
          index: userlevel-1
        })
      }
    )
  },
  getlevelmoney:function(){
    let _this=this;
    app._ajax(
      "post",
      "/member/querySysMember",
      { userId: wx.getStorageSync('uid') },
      (data) => {
        let levedatas =[]
        for(let i=0;i<data.data.length;i++){
          levedatas.push(data.data[i])
        }
        let allusermoney = levedatas[_this.data.type - 1].price
        _this.setData({
          levedata: levedatas,
          allbuymoney: allusermoney
        })
      }
    )
  },
  changebuyfun:function(e){
      let _this =this;
      let levelprice = 0
      if (_this.data.type == 1 && e.currentTarget.dataset.id == 1) {
        levelprice = _this.data.levedata[0].price
      } else if (_this.data.type == 2 && e.currentTarget.dataset.id == 1) {
        levelprice = _this.data.levedata[1].price
      } else if (_this.data.type == 3 && e.currentTarget.dataset.id == 1) {
        levelprice = _this.data.levedata[2].price
      } else if (_this.data.type == 4 && e.currentTarget.dataset.id == 1) {
        levelprice = _this.data.levedata[3].price
      }else{
        if (_this.data.type == 1) {
          levelprice = _this.data.levedata[0].price * Number(_this.data.buynum)
        } else if (_this.data.type == 2) {
          levelprice = _this.data.levedata[1].price * Number(_this.data.buynum)
        } else if (_this.data.type == 3) {
          levelprice = _this.data.levedata[2].price * Number(_this.data.buynum)
        } else if (_this.data.type == 4) {
          levelprice = _this.data.levedata[3].price * Number(_this.data.buynum)
        }
      }
    this.setData({
      handleid: e.currentTarget.dataset.id,
      allbuymoney:levelprice
    })
  },
  gochangeadress:function(e){
    wx.navigateTo({
      url: '/pages/purchase/changedz?dzadress=' + this.data.buyadress,
    })
  },
  changbuyphone: function (e) {
    this.setData({
      buyphone: e.detail.value
    })
  },
  changbuyname:function(e){
    this.setData({
      buyname: e.detail.value
    })
  },
  // 获取验证码
  getusercode:function(e){
    let _this=this;
    let eid=e.currentTarget.dataset.id;
    let phone ='';
    if(eid==1){
      phone = _this.data.buyphone
    }else{
      phone=_this.data.memberphone
    }
    let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
    if (TEL_REGEXP.test(phone)){
      app._ajax(
        "post",
        "/codelog/geCheckCode",
        { userPhone: phone,type:0 },
        (data) => {
          if(data.code==200){
            app.tipToast(1, '验证码已发送')
            var coden = 60    // 定义60秒的倒计时
            if(eid==1){
              let codeV = setInterval(function () {
                _this.setData({    // _this这里的作用域不同了
                  btntext: '重新获取' + (--coden) + 's'
                })
                if (coden == -1) {  // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
                  clearInterval(codeV)
                  _this.setData({
                    btntext: '获取验证码'
                  })
                }
              }, 1000)  //  1000是1秒
            }else{
              let codeV1 = setInterval(function () {
                _this.setData({    // _this这里的作用域不同了
                  btntext2: '重新获取' + (--coden) + 's'
                })
                if (coden == -1) {  // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
                  clearInterval(codeV1)
                  _this.setData({
                    btntext2: '获取验证码'
                  })
                }
              }, 1000)  //  1000是1秒
            }
          }
        },(msg) => {
          app.tipToast(2, msg)
        }
        )
    }else{
      app.tipToast(2, '您输入的手机号码不正确')
    }
  },
  buylevel:function(){
    let _this =this;
    if (_this.data.handleid==1){
      if (_this.data.buyname == '' || _this.data.buyphone == '' || _this.data.buycode == '') {
        app.tipToast(2, '还有信息未填写')
      } else {
        let phone = _this.data.buyphone;
        let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
        if (TEL_REGEXP.test(phone)) {
          let levelprice = 0
          if (_this.data.type == 1) {
            levelprice = _this.data.levedata[0].price
          } else if (_this.data.type == 2) {
            levelprice = _this.data.levedata[1].price 
          } else if (_this.data.type == 3) {
            levelprice = _this.data.levedata[2].price 
          } else if (_this.data.type == 4) {
            levelprice = _this.data.levedata[3].price 
          }
          app._ajax(
            "post",
            "/order/createMember",
            { userId: wx.getStorageSync('userId'), name: _this.data.buyname, phone: _this.data.buyphone, level: _this.data.type, price: levelprice, code: _this.data.buycode, type: 1, number:1},
            (data) => {
              if (data.code == 200) {
                if(_this.data.types==1){
                  app._ajax(
                    "post",
                    // "/pay/wxPayOrder",   
                    "/pay/orderPay",
                    { orderNumber: data.data, userId: wx.getStorageSync('userId') },
                    (data) => {
                      wx.requestPayment({

                        timeStamp: data.data.timeStamp,
                        nonceStr: data.data.nonceStr,
                        package: data.data.package,
                        signType: 'MD5',
                        paySign: data.data.sign,
                        success(res) {
                          app.tipToast(1, '开通会员成功')
                        },
                        fail(res) {
                          app.tipToast(2, '付款失败')
                        }
                      })
                    }
                  )
                }
              }
            }, (msg) => {
              app.tipToast(2, msg);
            }
            )
        } else {
          app.tipToast(2, '您输入的手机号码不正确')
        }
      }
    }else{
      if (_this.data.buyname == '' || _this.data.buyphone == '' || _this.data.buycode == '' || _this.data.buyadress == '' || _this.data.buynum == 0) {
        app.tipToast(2, '还有信息未填写')
      } else {
        let phone = _this.data.buyphone;
        let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
        if (TEL_REGEXP.test(phone)) {
          let levelprice = 0
          if (_this.data.type == 1) {
            levelprice = _this.data.levedata[0].price * Number(_this.data.buynum)
          } else if (_this.data.type == 2) {
            levelprice = _this.data.levedata[1].price * Number(_this.data.buynum)
          } else if (_this.data.type == 3) {
            levelprice = _this.data.levedata[2].price * Number(_this.data.buynum)
          } else if (_this.data.type == 4) {
            levelprice = _this.data.levedata[3].price * Number(_this.data.buynum)
          }
          app._ajax(
            "post",
            "/order/createMember",
            { userId: wx.getStorageSync('userId'), name: _this.data.buyname, phone: _this.data.buyphone, level: _this.data.type, price: levelprice, code: _this.data.buycode, type: 3, number: _this.data.buynum, address: _this.data.buyadress },
            (data) => {
              if (data.code == 200) {
                app._ajax(
                  "post",
                  // "/pay/wxPayOrder",   
                  "/pay/orderPay",
                  { orderNumber: data.data, userId: wx.getStorageSync('userId') },
                  (data) => {
                    wx.requestPayment({

                      timeStamp: data.data.timeStamp,
                      nonceStr: data.data.nonceStr,
                      package: data.data.package,
                      signType: 'MD5',
                      paySign: data.data.sign,
                      success(res) {
                        console.log(res)
                      },
                      fail(res) {
                        console.log(res)
                      }
                    })
                  }
                )
              }
            },(msg) => {
              app.tipToast(2, msg);
            })
        } else {
          app.tipToast(2, '您输入的手机号码不正确')
        }
      }
    }
  },
  changbuynum:function(e){
    let _this =this;
    let changenum = Number(e.detail.value)+1
    if (!isNaN(e.detail.value)){
      let levelprice = 0
      if (_this.data.type == 1) {
        levelprice = _this.data.levedata[0].price * Number(e.detail.value)
      } else if (_this.data.type == 2) {
        levelprice = _this.data.levedata[1].price * Number(e.detail.value)
      } else if (_this.data.type == 3) {
        levelprice = _this.data.levedata[2].price * Number(e.detail.value)
      } else if (_this.data.type == 4) {
        levelprice = _this.data.levedata[3].price * Number(e.detail.value)
      } 
      this.setData({
        buynum: changenum,
        allbuymoney: levelprice
      })
    }else{
      app.tipToast(2, '购买数目不能为数字')
    }
  },
  changbuyadress:function(e){
    this.setData({
      buyadress: e.detail.value
    })
  },
  changbuycode: function (e) {
    this.setData({
      buycode: e.detail.value
    })
  },
  chooseType: function (e) {
    let _this=this;
    this.setData({
      type: e.currentTarget.dataset.type,
      index: e.currentTarget.dataset.type-1
    })
    let levelprice = 0
    if (_this.data.type == 1 && _this.data.handleid == 1) {
      levelprice = _this.data.levedata[0].price
    } else if (_this.data.type == 2 && _this.data.handleid == 1) {
      levelprice = _this.data.levedata[1].price
    } else if (_this.data.type == 3 && _this.data.handleid == 1) {
      levelprice = _this.data.levedata[2].price
    } else if (_this.data.type == 4 && _this.data.handleid == 1) {
      levelprice = _this.data.levedata[3].price
    } else {
      if (_this.data.type == 1) {
        levelprice = _this.data.levedata[0].price * Number(_this.data.buynum)
      } else if (_this.data.type == 2) {
        levelprice = _this.data.levedata[1].price * Number(_this.data.buynum)
      } else if (_this.data.type == 3) {
        levelprice = _this.data.levedata[2].price * Number(_this.data.buynum)
      } else if (_this.data.type == 4) {
        levelprice = _this.data.levedata[3].price * Number(_this.data.buynum)
      }
    }
    _this.setData({
      allbuymoney:levelprice
    })
  },
  // 激活会员
  changmembername:function(e){
    this.setData({
      membername:e.detail.value
    })
  },
  changmemberphone: function (e) {
    this.setData({
      memberphone: e.detail.value
    })
  },
  changmembercode: function (e) {
    this.setData({
      membercode: e.detail.value
    })
  },
  changmemberact: function (e) {
    this.setData({
      memberacc: e.detail.value
    })
  },
  changememberpwd: function (e) {
    this.setData({
      memberpwd: e.detail.value
    })
  },
  checkpwd:function(e){
    let _this=this;
    if (_this.data.memberacc == '' || _this.data.memberpwd == ''){
      app.tipToast(2, '请填写卡账号密码')
    }else{
      app._ajax(
        "post",
        "/card/verifyCard",
        { cardNum: _this.data.memberacc, password: _this.data.memberpwd },
        (data) => {
          if (data.data == true) {
            app.tipToast(1, '卡账号密码正确')
          }else{
            app.tipToast(2, '卡账号密码不正确')
          }
        }, (msg) => {
          app.tipToast(2, msg);
        })
    }
  },
  memberactivation:function(){
    let _this=this;
    if (_this.data.membername == '' || _this.data.memberphone == '' || _this.data.membercode == '' || _this.data.memberacc == '' || _this.data.memberpwd=='') {
      app.tipToast(2, '还有信息未填写')
    } else {
      let phone = _this.data.memberphone;
      let TEL_REGEXP = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
      if (TEL_REGEXP.test(phone)) {
        app._ajax(
          "post",
          "/card/activationCard",
          { userId: wx.getStorageSync('uid'), cardNum: _this.data.memberacc, cardPassword: _this.data.memberpwd, userName: _this.data.membername, phone: _this.data.memberphone, code:_this.data.membercode},
          (data) => {
            if (data.code == 200) {
              app.tipToast(1, '会员卡激活成功')
            }
          }, (msg) => {
            app.tipToast(2, msg);
          })
      } else {
        app.tipToast(2, '您输入的手机号码不正确')
      }
    }
  },
  switch: function (e) {
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        handlingBtn: !this.data.handlingBtn
      })
    } else if (e.currentTarget.dataset.type == 2) {
      this.setData({
        power_1: !this.data.power_1
      })
    } else if (e.currentTarget.dataset.type == 3) {
      this.setData({
        power_2: !this.data.power_2
      })
    } else if (e.currentTarget.dataset.type == 4) {
      this.setData({
        power_3: !this.data.power_3
      })
    }else if (e.currentTarget.dataset.type == 5) {
      this.setData({
        handlingBtn2: !this.data.handlingBtn2
      })
    }
  },
  swiperchange:function(e){
    this.setData({
      type: e.detail.current+1,
      index: e.detail.current
    })
  },
  
  //微信支付
  wx_pay_fun: function (Rdata) {
    let that = this;
    // 发起微信支付
    wx.requestPayment({
      'timeStamp': Rdata.timestamp,
      'nonceStr': Rdata.nonceStr,
      'package': Rdata.package,
      'signType': Rdata.signType,
      'paySign': Rdata.paySign,
      success: function (res) {
        // 跳转到订单展示界面
        wx.redirectTo({
          url: './detail?id=' + that.data.id
        })
      },
      fail: function (res) {
        App.showError('订单未支付', function () {
          // 跳转到未付款订单展示界面

        });
      },
    });
  }
})
