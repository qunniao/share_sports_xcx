
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
    imagesList: [{ name: 'icon_qrcode_bg_2', url: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/ad352b26737b4ea1ae39268ce654a4bb.png' },
      { name: 'icon_qrcode_bg_1', url: 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/4bb2973801ae4c55b5d64cf361e25601.png' }],
    userrole: 3,
    showpic: true,
    showpic2: true,
    twoshow: true,
    twoshow2: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // this.setData({
      //   imagesList: wx.getStorageSync('imagesList'),
      // })
    if (options.userrole == 3) {
      this.setData({
        filter: 1
      })
    }
    this.setData({
      userrole: options.userrole
    })
      qrcode = new QRCode('canvas', {
        text: "http://back.zhanchengwlkj.com/gymnasium/web/register.html?userid=" + wx.getStorageSync('userId') + '&role=1',
        width: 110,
        height: 110,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

    qrcode2 = new QRCode('canvas2', {
      text: "http://back.zhanchengwlkj.com/gymnasium/web/register.html?userid=" + wx.getStorageSync('userId') + '&role=3',
      width: 110,
      height: 110,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  },
  getuserpic: function () {
    let _this = this;
    let canvaIds = 'canvas'
    let srcimg = 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/4bb2973801ae4c55b5d64cf361e25601.png'
    if (_this.data.type == 2) {
      canvaIds = 'canvas2'
      srcimg = 'http://gymfiles.oss-cn-hangzhou.aliyuncs.com/ad352b26737b4ea1ae39268ce654a4bb.png'
    }
    let rpx = 1;
    wx.getSystemInfo({
      success(res) {
        rpx = res.windowWidth / 375;
      },
    })
    wx.canvasToTempFilePath({
      width: 110,
      height: 110,
      destWidth: 110,
      destHeight: 110,
      canvasId: canvaIds,
      success(res) {
        let codepic = res.tempFilePath;
        let userimg = '';
        let username = ''
        wx.getUserInfo({
          success: res => {
            userimg = res.userInfo.avatarUrl
            username = res.userInfo.nickName
            let wxGetImageInfo = promisify.promisify(wx.getImageInfo)
            // const ctx = wx.createCanvasContext('shareCanvas')
            Promise.all([
              wxGetImageInfo({
                src: srcimg
              }),
              wxGetImageInfo({
                src: codepic
              }),
              wxGetImageInfo({
                src: userimg
              })
            ]).then(res => {
              let ctx = wx.createCanvasContext('shareCanvas')
              if (_this.data.type == 2) {
                ctx = wx.createCanvasContext('shareCanvas2')
                _this.setData({
                  showpic2: true
                })
              } else {
                _this.setData({
                  showpic: false
                })
              }
              ctx.drawImage(res[0].path, 0, 0, 380 * rpx, 500 * rpx)
              ctx.setTextAlign('center')    // 文字居中
              ctx.setFillStyle('#000000')  // 文字颜色：黑色
              ctx.setFontSize(18 * rpx)         // 文字字号：22px
              ctx.fillText(username, 116 * rpx, 430 * rpx)
              let qrImgSize = 180 * rpx
              ctx.drawImage(res[1].path, 220 * rpx, 370 * rpx, 100 * rpx, 100 * rpx)
              ctx.drawImage(res[2].path, 20 * rpx, 400 * rpx, 50 * rpx, 50 * rpx)
              ctx.stroke()
              ctx.draw()
            })
          }
        })
      }
    })
  },
  ewshow: function () {
    let _this = this;
    if (_this.data.type == 1) {
      if (_this.data.showpic) {
        this.getuserpic()
      }
      this.setData({
        twoshow: false
      })
    } else {
      if (_this.data.showpic2) {
        this.getuserpic()
      }
      this.setData({
        twoshow2: false
      })
    }
  },
  ewhiden: function () {
    let _this = this;
    if (_this.data.type == 1) {
      this.setData({
        twoshow: true
      })
    } else {
      this.setData({
        twoshow2: true
      })
    }
  },
  save: function () {
    let _this = this;
    let canvasid = 'shareCanvas'
    if (_this.data.type == 2) {
      canvasid = 'shareCanvas2'
    }
    const wxCanvasToTempFilePath = promisify.promisify(wx.canvasToTempFilePath)
    const wxSaveImageToPhotosAlbum = promisify.promisify(wx.saveImageToPhotosAlbum)
    wxCanvasToTempFilePath({
      canvasId: canvasid
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
  chooseType: function (e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
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