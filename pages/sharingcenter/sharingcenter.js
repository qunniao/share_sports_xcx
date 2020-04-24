
var QRCode = require('../../utils/weapp-qrcode.js');
const promisify = require('../../utils/util')
var qrcode;
var qrcode2;
// pages/agent/qrcode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,//1-发展客户 2-发展代理
    imagesList: [],
    twoshow:true,
    username: '',
    userimg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this=this;
    this.setData({
      imagesList: wx.getStorageSync('imagesList'),
    })
    wx.getUserInfo({
      success: res => {
        _this.setData({
          username: res.userInfo.nickName,
          userimg: res.userInfo.avatarUrl
        })
      }
    })
    qrcode = new QRCode('canvasids', {
      text: "http://back.zhanchengwlkj.com/gymnasium/web/register.html?userid=" + wx.getStorageSync('uid') + '&role=1',
      // text:"https://www.baidu.com?id=123456",     
      width: 90,
      height: 90,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });

  },
  getuserpic: function () {
    wx.canvasToTempFilePath({
      width: 90,
      height: 90,
      destWidth: 90,
      destHeight: 90,
      canvasId: 'canvasids',
      success(res) {
        let codepic = res.tempFilePath;
        let userimg = '';
        let username = ''
        wx.getUserInfo({
          success: res => {
            userimg = res.userInfo.avatarUrl
            username = res.userInfo.nickName
            const wxGetImageInfo = promisify.promisify(wx.getImageInfo)
            const ctx = wx.createCanvasContext('shareCanvas')
            Promise.all([
              wxGetImageInfo({
                src: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/4bb2973801ae4c55b5d64cf361e25601.png'
              }),
              wxGetImageInfo({
                src: codepic
              }),
              wxGetImageInfo({
                src: userimg
              })
            ]).then(res => {
                let rpx = 1;
                wx.getSystemInfo({
                  success(res) {
                   rpx = res.windowWidth / 375;
                  },
                })
              const ctx = wx.createCanvasContext('shareCanvas')
              ctx.drawImage(res[0].path, 0, 0, 340 * rpx, 500 * rpx)
              ctx.setTextAlign('center')    // 文字居中
              ctx.setFillStyle('#000000')  // 文字颜色：黑色
              ctx.setFontSize(8 * rpx)         // 文字字号：22px
              ctx.fillText(username, 56 * rpx, 484 * rpx)
              ctx.fillText('了解详情,请长按二位码关注', 270 * rpx, 484 * rpx)
              const qrImgSize = 200 * rpx
              ctx.drawImage(res[1].path, 240 * rpx, 400 * rpx, 70 * rpx, 70 * rpx)
              ctx.drawImage(res[2].path, 30 * rpx, 420 * rpx, 50 * rpx, 50 * rpx)
              ctx.stroke()
              ctx.draw()
            })
          }
        })
      }
    })
  },
  ewshow:function(){
    this.getuserpic()
    this.setData({
      twoshow:false
    })
  },
  ewhiden: function () {
    this.setData({
      twoshow: true
    })
  },
  save: function () {
    let _this=this;
    const wxCanvasToTempFilePath = promisify.promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = promisify.promisify(wx.saveImageToPhotosAlbum)
    wxCanvasToTempFilePath({
      canvasId: 'shareCanvas'
    }, this).then(res => {
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: function (data) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '您的推广二维码已存入手机相册，赶快分享给好友吧',
            showCancel: false,
          })
          _this.setData({
            twoshow: false
          })
        },
        fail: function (err) {
          if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
            // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
            wx.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success: modalSuccess => {
                wx.openSetting({
                  success(settingdata) {
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限成功,再次点击图片即可保存',
                        showCancel: false,
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限失败，将无法保存到相册哦~',
                        showCancel: false,
                      })
                    }
                  },
                  fail(failData) {
                    console.log("failData", failData)
                  },
                  complete(finishData) {
                    console.log("finishData", finishData)
                  }
                })
              }
            })
          }
        },
        complete(res) {
          wx.hideLoading()
        }
      })
    }).then(res => {
      // wx.showToast({
      //   title: '已保存到相册'
      // })
      // this.setData({
      //   twoshow: false
      // })
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