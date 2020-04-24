// pages/agent/team.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,//1-客户团队 2-二级团队
    dataList: [],
    filter:0,//0-全部 1-正式二级 2审核中2级
    allcustomer:0,
    khcommission:0,
    dlcommission: 0,
    dataList2: [],
    pageNum:1,
    userrole:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userrole: options.type
    })
    this.getCustomerdata()
  },
  gettemsdata: function () {
    let _this = this;
    app._ajax(
      "post",
      "/agentTeam/countClientTeam",
      {
        userId: wx.getStorageSync('uid'),
        role:_this.data.userrole
      },
      (data) => {
        if (data.data != null) {
          _this.setData({
            allcustomer: data.data.teamSize,
            khcommission: data.data.totalCommission,
            sales: data.data.sales
          })
        }
      }
    )
  },
  getcustomerdata: function () {
    let _this = this;
    app._ajax(
      "post",
      "/agentTeam/countAgentTeam",
      {
        userId: wx.getStorageSync('uid'),
      },
      (data) => {
        _this.setData({
          allcustomer: data.data.teamSize,
          khcommission: data.data.totalCommission,
          sales: data.data.sales
        })
      }
    )
  },
  getCustomerdata:function(num){
    let _this = this;
    _this.setData({
      allcustomer: 0,
      khcommission: 0,
      sales: 0
    })
    if (_this.data.type == 1) {
      app._ajax(
        "post",
        "/agentTeam/queryClientTeam",
        {
          pageNum: _this.data.pageNum,
          pageSize: 10,
          userId: wx.getStorageSync('uid')
        },
        (data) => {
          if (data.data != null) {
            let dataListdata = _this.data.dataList;
            if (_this.data.pageNum > 1) {
              for (let i = 0; i < data.data.length; i++) {
                dataListdata.push(data.data[i])
              }
            } else {
              dataListdata = data.data
            }
            _this.setData({
              dataList: dataListdata
            })
          }
          _this.gettemsdata()
        }
      )
    } else {
      let data = {
        pageNum: _this.data.pageNum,
        pageSize: 10,
        userId: wx.getStorageSync('uid'),
        // dataList2:[]
      }
      if (_this.data.filter != 0) {
        if (_this.data.filter == 2) {
          data.status = 1
        } else {
          data.status = 2
        }
      }
      app._ajax(
        "post",
        "/agentTeam/queryAgentTeam",
        data,
        (data) => {
          if (data.data != null) {
            let dataList2data = _this.data.dataList2;
            if (_this.data.pageNum > 1) {
              for (let i = 0; i < data.data.length; i++) {
                dataList2data.push(data.data[i])
              }
            } else {
              dataList2data = data.data
            }
            _this.setData({
              dataList2: dataList2data
            })
          }
          _this.getcustomerdata()
        }
      )
    }
  },
  chooseType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type,
      pageNum: 1
    })
    this.getCustomerdata()
  },
  filterType: function (e) {
    this.setData({
      filter: e.currentTarget.dataset.type,
      pageNum: 1
    })
    this.getCustomerdata()
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.getCustomerdata();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})