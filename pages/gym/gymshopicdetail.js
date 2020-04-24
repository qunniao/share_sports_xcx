// pages/recharge.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pictuerlist: [{ name: '全部', id: 0, show: 1 }, { name: '环境设施', id: 1, show: 0 }, { name: '教练证书', id: 2, show: 0 }, { name: '会员案例', id: 3, show: 0 }, { name: '其它', id: 4, show: 0}],
    piclists: [],
    shopids:'',
    type:0,
    pageNums:1,
  },
  changepictype:function(e){
    let _this =this ;
    let piclist = _this.data.pictuerlist;
    for (let i = 0; i < piclist.length;i++){
      piclist[i].show=0;
    }
    piclist[e.currentTarget.dataset.index].show=1
    _this.setData({
      pictuerlist:piclist,
      pageNums:1,
      type: e.currentTarget.dataset.index
    })
    _this.getshoppic()
  },
  getmorepic:function(){
    this.setData({
      pageNums: this.data.pageNums + 1
    })
    this.getshoppic()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this =this;
    _this.setData({
        shopids:options.shopId
    })
    _this.getshoppic()
  },
  getshoppic:function(){
    let _this =this;
    app._ajax(
      "post",
      "/gymshop/findGymImages",
      { gymShopId: _this.data.shopids,type:_this.data.type,pageNum:_this.data.pageNums,pageSize:8 },
      (data) => {
        console.log(data.data.content)
        let picdata =_this.data.piclists;
        if(_this.data.pageNums>1){
          for (let i = 0; i < data.data.content.length;i++){
            picdata.push(data.data.content[i])
          }
        }else{
          picdata = data.data.content
        }
        _this.setData({
          piclists: picdata
        })
      }
    )
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})