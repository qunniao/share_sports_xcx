const app = getApp()
Page({
  data: {
    latitude: "",
    longitude: "",
    markers: [],
  }, 
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap');
  },
  onLoad:function(options){
    if (options.latitude){
      this.setData({
        latitude: options.latitude,
        longitude: options.longitude
      })
      this.getGymList();
    }else{
      this.getLocation();
    }
  },
  gogymshop:function(e){
    wx.navigateTo({
      url: '/pages/gym/index?id=' + e.markerId,
    })
  },
  getGymList:function(e){
    var _this=this;
    app._ajaxjson(
      "post",
      "/gymshop/pageGymShop?pageNum=1&pageSize=100",
      {
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        pageNum: 1,
        pageSize: 10,
      },
      (data) => {
        let markers=[];
        for(let i=0;i<data.data.content.length;i++){
          let marker = {};
          marker.id = data.data.content[i].gymShopId;
          marker.latitude = data.data.content[i].latitude;
          marker.longitude = data.data.content[i].longitude;
          marker.name = data.data.content[i].gymName;
          marker.width = 120;
          marker.height = 120;
          // marker.width='60rpx';
          // marker.height='60rpx'
          marker.callout = { 
            content: data.data.content[i].gymName + "\n" + data.data.content[i].gymEnergy + "能量",
            color: "#FFF",
            fontSize: "19rpx",
            bgColor: "#0090FF",
            textAlign: "center",
            borderRadius: "15rpx",
            padding: "20rpx",
            display: 'ALWAYS'
            } ;
            markers.push(marker);
        }
        _this.setData({
          markers: markers,
        })
      }
    ) 
  },


  getLocation:function(){
    var _this=this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        _this.setData({
          latitude: latitude,
          longitude: longitude
        })
      },
      complete() {
        _this.getGymList();
      }
    })
  }
  
})
