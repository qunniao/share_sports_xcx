const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    gxqm:'',
    userinfodata: {},
    userdata: {},
    jianshenname: '',
    tixingname: '',
    mudiname: '',
    zhiyename: '',
    shouru: '',
    username: '',
    userNike:'',
    usercitynames:'',
    txarray: [],
    mdarray: [],
    zyarray: [],
    srarray: [],
    multiArray: [[], [], []],
    index: 0,
    height: '',
    weight: '',
    tixingvalue: 0,
    txshowcheck: false,
    changeheight: '',
    changeweight: '',
    changetixing: '',
    mdvalue: 0,
    zyvalue: 0,
    srvalue: 0,
    regionid:'',
    idState: '',
    idCardname: '',
    sexlist: [{ name: '男', value: 0 },{ name: '女', value: 1 }],
    usercheck:false,
    levelcard:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getusercity(0,1)
    this.getuercard()
    // this.chekcuseridents()
  },
  getuercard:function(){
    let _this =this;
    app._ajax(
      "post",
      "/card/queryNewestRecord",
      { useUserId : wx.getStorageSync('userId') },
      (data) => {
        let idcarddata = data.data
        if (idcarddata != null) {
          if (idcarddata.idCard != '') {
            _this.setData({
              levelcard: idcarddata.id,
            })
          }
        }
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  chekcuseridents:function(){
    let _this = this;
    app._ajax(
      "post",
      "/user/queryRealNameUser",
      { userId : wx.getStorageSync('uid') },
      (data) => {
        let idcarddata = data.data
        if (idcarddata != null) {
          if (idcarddata.idCard != '') {
            _this.setData({
              idState: idcarddata.reviewState,
              idCardname: idcarddata.trueName
            })
          }
        }
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )

  },
  getuserdetail:function(){
    let _this = this;
    app._ajax(
      "post",
      "/user/queryUserByUserId",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        _this.setData({
          userdata: data.data,
          userNike: data.data.userNike,
        })
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
    // 获取类别信息
    app._ajax(
      "post",
      "/data/queryUserTypeALL",
      { userId: wx.getStorageSync('userId') },
      (data) => {
        if (data.code == 200) {
          let typealldata = data.data;
          let txarrs = [];
          let mdarrs = [];
          let zyarrs = [];
          let srarrs = [];
          for (let i = 0; i < typealldata.length; i++) {
            if (typealldata[i].type == 2) {
              txarrs.push(typealldata[i])
            }
            if (typealldata[i].type == 0) {
              mdarrs.push(typealldata[i])
            }
            if (typealldata[i].type == 3) {
              zyarrs.push(typealldata[i])
            }
            if (typealldata[i].type == 4) {
              srarrs.push(typealldata[i])
            }
          }
          _this.setData({
            txarray: txarrs,
            mdarray: mdarrs,
            zyarray: zyarrs,
            srarray: srarrs
          })
          app._ajax(
            "post",
            "/user/queryUserAdditionPOByUserId",
            { userId: wx.getStorageSync('userId') },
            (data) => {
              if(data.data!=null){
                let userinfodatas =data.data
                let tixingnames = '';
                let mudinames = '';
                let zhiyenames = '';
                let shourus = '';
                if (data.data.region!=null){
                  let regionids = data.data.region
                  app._ajax(
                    "post",
                    "/data/queryCityById",
                    { id: regionids },
                    (data) => {
                      let citylist = data.data.cityPO.mergerName.split(',')
                      let cityname = citylist[1] + ' ' + citylist[2] + ' ' + citylist[3]
                      _this.setData({
                        regionid: regionids,
                        usercitynames: cityname
                      })
                  })
                }
                for (let i = 0; i < typealldata.length; i++) {
                  if (typealldata[i].typeid == data.data.income) {
                    shourus = typealldata[i].name
                  }
                  if (typealldata[i].typeid == data.data.figure) {
                    tixingnames = typealldata[i].name
                  }
                  if (typealldata[i].typeid == data.data.purpose) {
                    mudinames = typealldata[i].name
                  }
                  if (typealldata[i].typeid == data.data.job) {
                    zhiyenames = typealldata[i].name
                  }
                }
                let avatarUrls = _this.data.avatarUrl;
                if (avatarUrls != data.data.userPO.avatarUrl){
                  _this.setData({
                    avatarUrl: data.data.userPO.avatarUrl,
                  })
                }
                // if (data.data.userPO.avatarUrl!=null){
                // }
                _this.setData({
                  avatarUrl: data.data.userPO.avatarUrl,
                  usercheck:true,
                  mdvalue: data.data.purpose,
                  zyvalue: data.data.job,
                  srvalue: data.data.income,
                  tixingvalue: data.data.figure,
                  userinfodata: userinfodatas,
                  tixingname: tixingnames,
                  mudiname: mudinames,
                  zhiyename: zhiyenames,
                  shouru: shourus,
                  height: data.data.height,
                  weight: data.data.weight,
                  gxqm: data.data.signature
                })
              }
            },
            (msg) => {
              app.tipToast(2, msg);
            }
          )
        }
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    )
  },
  changegxqm:function(e){
    this.setData({
      gxqm: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    let _this =this;
    let changevalue = e.detail.value
    let citynames = _this.data.multiArray;
    let cityname=''
    let regionidss =''
    if(e.detail.value[2]==null||e.detail.value[null]){
      cityname = citynames[0][changevalue[0]].name + ' ' + citynames[1][0].name + ' ' + citynames[2][0].name
      regionidss = citynames[2][0].id
    }else{
      cityname = citynames[0][changevalue[0]].name + ' ' + citynames[1][changevalue[1]].name + ' ' + citynames[2][changevalue[2]].name
      regionidss=citynames[2][changevalue[2]].id
    }
    _this.setData({
      usercitynames:cityname,
      regionid: regionidss
    })
  },
  bindMultiPickerColumnChange: function (e) {
    let _this =this;
    if(e.detail.column==0){
      _this.gettwocity(_this.data.multiArray[0][e.detail.value].name)
    }
    if (e.detail.column == 1) {
      _this.getthreecity(_this.data.multiArray[1][e.detail.value].name)
    }
    if (e.detail.column == 2) {
    }
    // var data = {
    //   multiArray: this.data.multiArray,
    //   multiIndex: this.data.multiIndex
    // };
  },
  getusercity:function(cityid, checktype) {
    let _this = this;
    if (checktype == 1) {
      app._ajax(
        "post",
        "/data/queryCityByLevel",
        { level: 1 },
        (data) => {
          let allcitylist = _this.data.multiArray;
          for(let i =0;i<data.data.length;i++){
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
        { level: 2, mergerName:cityname},
        (data) => {
          let allcitylisttwo = _this.data.multiArray;
          let nowtwocitylist =[]
          for (let i = 0; i < data.data.length; i++) {
            nowtwocitylist.push(data.data[i])
          }
          allcitylisttwo[1] = nowtwocitylist
          _this.setData({
            multiArray: allcitylisttwo
          })
          _this.getthreecity(allcitylisttwo[1][0].name)
        }
      )
  },
  getthreecity: function (cityname) {
    let _this = this;
    app._ajax(
      "post",
      "/data/queryCityByLikeMergerName",
      { level: 3, mergerName: cityname },
      (data) => {
        let allcitylistthree = _this.data.multiArray;
        let nowthreecity = []
        for (let i = 0; i < data.data.length; i++) {
          nowthreecity.push(data.data[i])
        }
        allcitylistthree[2] = nowthreecity
        _this.setData({
          multiArray: allcitylistthree
        })
      }
    )
  },

  // 健身目的选择
  bindmd: function (e) {
    let _this = this;
    let changetype = _this.data.mdarray;
    _this.setData({
      mudiname: changetype[e.detail.value].name,
      mdvalue: changetype[e.detail.value].typeid
    })
  },
  bindsex:function(e){
    let _this = this;
    let sexlistdata = _this.data.sexlist;
    let sexdata =_this.data.userdata
    sexdata.sex = e.detail.value
    _this.setData({
      userdata: sexdata
    })
  },
  bindzy: function (e) {
    let _this = this;
    let changetype = _this.data.zyarray;
    _this.setData({
      zhiyename: changetype[e.detail.value].name,
      zyvalue: changetype[e.detail.value].typeid
    })
  },
  bindsr: function (e) {
    let _this = this;
    let changetype = _this.data.srarray;
    _this.setData({
      shouru: changetype[e.detail.value].name,
      srvalue: changetype[e.detail.value].typeid
    })
  },
  bindPickerChange: function (e) {
    let _this = this;
    let changetype = _this.data.txarray;
    _this.setData({
      tixingname: changetype[e.detail.value].name,
      tixingvalue: changetype[e.detail.value].typeid
    })
  },
  okchange: function (e) {
    let _this = this;
    if (_this.data.mdvalue == 0 || _this.data.tixingvalue == 0 || _this.data.zyvalue == 0 ||  _this.data.srvalue == 0 || _this.data.gxqm==''){
      app.tipToast(2, '还有信息未填写');
    }else{
      let usersdata = {
        userId: wx.getStorageSync('userId'),
        purpose: _this.data.mdvalue,
        bodyType: _this.data.tixingvalue,
        figure: _this.data.tixingvalue,
        age: 21,
        signature: _this.data.gxqm,
        region: _this.data.regionid,
        job: _this.data.zyvalue,
        income: _this.data.srvalue,
        userNike: _this.data.userNike,
      }
      if (_this.data.userdata.sex!=null){
        usersdata.sex = _this.data.userdata.sex
      }
      if (_this.data.userinfodata.crashName != undefined) {
        usersdata.crashName = _this.data.userinfodata.crashName
      }
      if (_this.data.userinfodata.crashUserPhone != undefined) {
        usersdata.crashUserPhone = _this.data.userinfodata.crashUserPhone
      }
      app._ajax(
        "post",
        "/user/addUserAddition",
        usersdata,
        (data) => {
          if (data.code == 200) {
            app.tipToast(1, '修改信息成功');
            this.getuserdetail()
          }
        }, (msg) => {
          app.tipToast(2, msg);
        }
      )
    }
  },
  changeuserNike: function (e) {
    let userdata = this.data.userNike;
    userdata = e.detail.value;
    this.setData({
      userNike: userdata
    })
  },
  changesfcard:function(e){
    let usersdata=this.data.userinfodata;
    usersdata.identityNumber=e.detail.value;
    this.setData({
      userinfodata:usersdata
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
    this.getuserdetail()
    this.chekcuseridents()
  },
  onLaunch:function(){
    // this.getuserdetail()
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
    let _this =this;
    if (e.currentTarget.dataset.url == 'urgent' || e.currentTarget.dataset.url =='userheaderpic'){
      if(_this.data.usercheck){
        wx.navigateTo({
          //目的页面地址
          url: e.currentTarget.dataset.url,
          success: function (res) {

          },
        })
      }else{
        app.tipToast(2,'请先填写用户信息')
      }
    }else{
      wx.navigateTo({
        //目的页面地址
        url: e.currentTarget.dataset.url,
        success: function (res) {

        },
      })
    }
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