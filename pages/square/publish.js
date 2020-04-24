const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [],
    name:"",
    content:"",
    lat:'',
    lon:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  choosePhoto:function(e){
    var _this=this;
    wx.showActionSheet({
      itemList: ['从手机相册选择', '拍照'],
      success: function (res) {
        let type = res.tapIndex == 0 ? ['album'] : ['camera']
        wx.chooseImage({
          count: 3, // 默认9
          sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: type, // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            var tempFilePaths = res.tempFilePaths;
            var imageList = [];
            var imageLists = _this.data.imageList;
            for(let i=0;i<tempFilePaths.length;i++){
              wx.uploadFile({
                url: app.api_url + '/system/oss/fileUpload',
                filePath: tempFilePaths[i],
                name: 'image',
                success(res) {
                  let newdatas = JSON.parse(res.data) 
                  imageList.push(newdatas.data.images[0])
                  if (i + 1 == tempFilePaths.length){
                    if (e.currentTarget.dataset.index==-1){
                      for (let i = 0; i < imageList.length;i++){
                        imageLists.push(imageList[i])
                      }
                    }else{
                      imageLists.splice(e.currentTarget.dataset.index,1)
                      for (let i = 0; i < imageList.length; i++) {
                        imageLists.splice(e.currentTarget.dataset.index, 0, imageList[i]);
                      }
                    }
                    _this.setData({
                      imageList: imageLists
                    })
                  }
                }
              })
            }
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            // console.log(imageList)
            // for (let i = 0; i < tempFilePaths.length;i++){
            //   imageList.push(tempFilePaths[i]);
            // }
            // _this.setData({
            //   imageList: imageList
            // })
          }
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  getAddress:function(){
    var _this=this;
    wx.chooseLocation({
      success: function (res) {
        var name = res.name
        _this.setData({ 
          name: name,
          lat:res.latitude,
          lon:res.longitude
        })
      }
    })
  },

  blur: function (e) {
    this.setData({
      content:e.detail.value
    })
  },

  publish:function(){
    let _this=this;
    let place = this.data.name;
    let content=this.data.content;
    let imageList = this.data.imageList;
    console.log(imageList)
    console.log(place)
    if(place==''||content==''){
      app.tipToast(2, '还有内容未填写');
    }else{
      app._ajax(
        "post",
        "/group/addFriendGroupPO",
        { userId: wx.getStorageSync('userId'), content: content, place: place, files: imageList, longitude: _this.data.lon, latitude :_this.data.lat},
        (res) => {
          if (res.code == 200) {
            app.tipToast(1, res.msg, function () {
              wx.navigateBack()
            })
          } else {
            app.tipToast(2, res.data.msg);
          }
      })
    }
    // wx.uploadFile({
    //   url: app.api_url + "/group/addFriendGroupPO",
    //   filePath: imageList[0],
    //   name: 'files',
    //   header: { "Content-Type": "multipart/form-data"},
    //   formData: {
    //     "userId": wx.getStorageSync('userId'),
    //     "content":content,
    //     "place":place
    //   },
    //   success: function (res) {
    //     if(res.data.code==200){
    //       app.tipToast(1, res.data.msg, function () {
    //         wx.navigateBack()
    //       })
    //     }else{
    //       app.tipToast(2, res.data.msg);
    //     }
    //   },
    // })
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