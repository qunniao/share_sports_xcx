//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cardnum: 0,
    chackimg: false,
    patconleft: true,
    settlementType:1,
    patconright: false,
    prilist: false,
    nenglist: true,
    patconlist: [

    ], 
    nengconlist: [
      {
        id: 1,
        patconlist_chack_img: false,
        patconlistimg: 'http://img5.imgtn.bdimg.com/it/u=2130613494,65275415&fm=26&gp=0.jpg',
        name: '某某某产品名称某某某产',
        conpon: '可使用优惠券',
        pri: 159.00,
        num: 1,
        prishi: 159.00
      }
    ],
    count: 0,
    totalnum: 0,
    yunfei: false,
    renminbi: false,
    nengliang: true,
    select: [],
    total: false,
    delect: true,
    edits: '编辑',
  },
  onLoad:function(){
  },
  onShow(){
    let _this = this;
    _this.getshopcard(1)
  },
  // 点击现金支付
  patconleft: function(){
    var that = this;
    that.setData({
      settlementType:1,
      patconleft: true,
      prilist: false,
      chackimg:false,
      patconright: false,
      nenglist: true,
      count: 0,
      yunfei: false,
      renminbi: false,
      nengliang: true
    })
    that.getshopcard(1)
  },
  // 点击能量支付
  patconright: function(){
    var that = this;
    that.setData({
      settlementType: 2,
      chackimg: false,
      patconright: true,
      nenglist: false,
      patconleft: false,
      count:0,
      prilist: true,
      yunfei: true,
      renminbi: true,
      nengliang: false,
    })
    that.getshopcard(2)
  },
  updatenum:function(shopid,num){
    app._ajax(
      "post",
      "/cart/updateCart",
      {
        id: shopid,
        number : num
      },
      (data) => {
      }
    )
  },
  // 减少商品数量，最少减到1
  reduce: function (e) {
    var lenth = e.currentTarget.dataset.index;
    var num = this.data.patconlist[lenth].number;
    if (this.data.patconlist[lenth].number >= 2) {
      this.data.patconlist[lenth].number--;
      this.updatenum(this.data.patconlist[lenth].id, this.data.patconlist[lenth].number)
    }
    this.setData({
      patconlist: this.data.patconlist,
      num: this.data.patconlist[lenth].number
    })
    // 计算商品数量
    var sum = 0;
    var subtotals = 0;
    for (var i = 0; i < this.data.patconlist.length; i++) {
      var numlen = this.data.patconlist[i].number;
      var pricelen = this.data.patconlist[i].pri
      sum += parseFloat(numlen)
      subtotals += pricelen * numlen
    }
  },
  // 增加商品数量
  add: function (e) {
    var lenth = e.currentTarget.dataset.index;
    var num = this.data.patconlist[lenth].number;
    if (this.data.patconlist[lenth].number < e.currentTarget.dataset.inventory) {
      this.data.patconlist[lenth].number++;
      this.updatenum(this.data.patconlist[lenth].id, this.data.patconlist[lenth].number)
    }else{
      app.tipToast(2, '购买数量不能超过当前库存')
    }
    this.setData({
      patconlist: this.data.patconlist,
      num: this.data.patconlist[lenth].number
    })
    // 计算商品数量
    var sum = 0;
    var subtotals = 0;
    for (var i = 0; i < this.data.patconlist.length; i++) {
      var numlen = this.data.patconlist[i].number;
      var pricelen = this.data.patconlist[i].pri
      sum += parseFloat(numlen)
      subtotals += pricelen * numlen
    }
  },
  //能量支付减
  reduces: function (e) {
    var lenth = e.currentTarget.dataset.index;
    var num = this.data.nengconlist[lenth].num;
    if (this.data.nengconlist[lenth].num >= 2) {
      this.data.nengconlist[lenth].num--;
    }
    this.setData({
      nengconlist: this.data.nengconlist,
      num: this.data.nengconlist[lenth].num
    })
    // 计算商品数量
    var sum = 0;
    var subtotals = 0;
    for (var i = 0; i < this.data.nengconlist.length; i++) {
      var numlen = this.data.nengconlist[i].num;
      var pricelen = this.data.nengconlist[i].pri
      sum += parseFloat(numlen)
      subtotals += pricelen * numlen
    }
  },
  //能量支付加
  adds: function (e) {
    var lenth = e.currentTarget.dataset.index;
    var num = this.data.nengconlist[lenth].num;
    if (num < e.currentTarget.dataset.inventory) {
      this.data.nengconlist[lenth].num++;
      this.updatenum(this.data.nengconlist[lenth].id, this.data.nengconlist[lenth].num)
    } else {
      app.tipToast(2, '购买数量不能超过当前库存')
    }
    this.setData({
      nengconlist: this.data.nengconlist,
      num: this.data.nengconlist[lenth].num
    })
    // 计算商品数量
    var sum = 0;
    var subtotals = 0;
    for (var i = 0; i < this.data.nengconlist.length; i++) {
      var numlen = this.data.nengconlist[i].num;
      var pricelen = this.data.nengconlist[i].pri
      sum += parseFloat(numlen)
      subtotals += pricelen * numlen
    }
  },
  //全选单选操作
  patconlist: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let li2 = that.data.patconlist[index].patconlist_chack_img;
    let patconlist = that.data.patconlist;
    let selectValue = e.currentTarget.dataset.name;
    let newli = 'patconlist[' + index + '].patconlist_chack_img';
    this.setData({
      [newli]: !this.data.patconlist[index].patconlist_chack_img
    });
    let checkimgs= true;
    for (let i = 0; i < patconlist.length;i++){
      if (patconlist[i].patconlist_chack_img==false){
        checkimgs=false
      }
    }
    if (li2 == false) {
      for (let i in this.data.select) {
        if (this.data.select[i] == selectValue) {
          this.data.select.splice(i, 1);
        }
      }
    } else {
      this.data.select.push(selectValue);
    }
    that.setData({
      patconlist: patconlist,
      chackimg: checkimgs
    })
    this.calculateNum()
  },
  nengconlist: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let li2 = that.data.nengconlist[index].patconlist_chack_img;
    let nengconlist = that.data.nengconlist;
    let selectValue = e.currentTarget.dataset.name;
    let newli = 'nengconlist[' + index + '].patconlist_chack_img';
    this.setData({
      [newli]: !this.data.nengconlist[index].patconlist_chack_img
    });
    let checkimgs = true;
    for (let i = 0; i < nengconlist.length; i++) {
      if (nengconlist[i].patconlist_chack_img == false) {
        checkimgs = false
      }
    }
    if (li2 == false) {
      for (let i in this.data.select) {
        if (this.data.select[i] == selectValue) {
          this.data.select.splice(i, 1);
        }
      }
    } else {
      this.data.select.push(selectValue);
    }
    that.setData({
      chackimg: checkimgs,
      nengconlist: nengconlist
    })
    that.allnlNum()
  },
  //全选
  selectALL: function(e){
    let that=this;
    let list = this.data.patconlist;
    let listtwo =this.data.nengconlist
    if (this.data.prilist){
      let checks = false;
      for (let i = 0; i < listtwo.length; i++) {
        if (!listtwo[i].patconlist_chack_img) {
          checks = true
        }
      }
      if (checks) {
        for (let i = 0; i < listtwo.length; i++) {
          listtwo[i].patconlist_chack_img = true
        }
      } else {
        for (let i = 0; i < listtwo.length; i++) {
          listtwo[i].patconlist_chack_img = false
        }
      }
      this.setData({
        chackimg: !this.data.chackimg,
        nengconlist: listtwo
      })
      that.allnlNum()
    }else{
      let checks = false;
      for (let i = 0; i < list.length; i++) {
        if (!list[i].patconlist_chack_img) {
          checks = true
        }
      }
      if (checks) {
        for (let i = 0; i < list.length; i++) {
          list[i].patconlist_chack_img = true
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          list[i].patconlist_chack_img = false
        }
      }
      this.setData({
        chackimg: !this.data.chackimg,
        patconlist: list
      })
      this.calculateNum()
    }
    // for (let i = 0; i < list.length; i++) {
    //   let newli = 'patconlist[' + i + '].patconlist_chack_img';
    //   this.setData({
    //     chackimg: !this.data.chackimg,
    //     [newli]: !this.data.patconlist[i].patconlist_chack_img
    //   });
    // 
  },
  allnlNum: function () {
    let _this = this;
    let payshoids = []
    let buyshopnums = 0;
    let buyshopnum = 0;
    let buyshopprice = 0;
    for (let i = 0; i < _this.data.nengconlist.length; i++) {
      if (_this.data.nengconlist[i].patconlist_chack_img) {
        buyshopnums += _this.data.nengconlist[i].number
        payshoids.push(_this.data.nengconlist[i].id)
        buyshopnum += _this.data.nengconlist[i].number
        buyshopprice += Number(_this.data.nengconlist[i].number) * Number(_this.data.nengconlist[i].productPO.realPrice)
      }
    }
    _this.setData({
      cardnum: buyshopnums,
      count: buyshopprice,
      totalnum: buyshopnum
    })
  },
  calculateNum:function(){
    let _this =this;
    let payshoids = []
    let buyshopnums =0;
    let buyshopnum =0;
    let buyshopprice =0;
    for (let i = 0; i < _this.data.patconlist.length; i++) {
      if (_this.data.patconlist[i].patconlist_chack_img) {
        buyshopnums += _this.data.patconlist[i].number
        payshoids.push(_this.data.patconlist[i].id)
        buyshopnum += _this.data.patconlist[i].number
        buyshopprice += Number(_this.data.patconlist[i].number) * Number(_this.data.patconlist[i].productPO.realPrice)
      }
    }
    _this.setData({
      cardnum: buyshopnums,
      count: buyshopprice,
      totalnum: buyshopnum
    })
  },
  //点击编辑
  edit: function(){
    var that = this;
    if (that.data.edits == '完成'){
      that.setData({
        total: false,
        delect: true,
        edits: '编辑'
      })
    }else
    if (that.data.edits == '编辑'){
      that.setData({
        total: true,
        delect: false,
        edits: '完成'
      })
    }
  },
  // 删除购物车
  detail: function(){
    var that = this;
    let dellist =[]
    for (var i = 0; i < that.data.patconlist.length; i++){
      if (that.data.patconlist[i].patconlist_chack_img == true){
        dellist.push(that.data.patconlist[i].id)      
      }
    }
    if(dellist.length==0){
      app.tipToast(2,'没有要删除的购物车产品')
    }else{
      app._ajax(
        "post",
        "/cart/deleteCart",
        {
          cartId: dellist
        },
        (data) => {
          that.getshopcard(1)
          wx.showToast({
            title: '删除成功',
            icon: 'none'
          })
        },(msg)=>{
          app.tipToast(2,msg)
        }
      )
    }
  },
  //跳转至结算页面
  Goset: function(){
    let _this =this;
    let payshoids =[]
    if (_this.data.patconright){
      for (let i = 0; i < _this.data.nengconlist.length; i++) {
        if (_this.data.nengconlist[i].patconlist_chack_img) {
          payshoids.push(_this.data.nengconlist[i].id)
        }
      }
    }else{
      for (let i = 0; i < _this.data.patconlist.length; i++) {
        if (_this.data.patconlist[i].patconlist_chack_img) {
          payshoids.push(_this.data.patconlist[i].id)
        }
      }
    }
    if (payshoids.length>=1){
      wx.navigateTo({
        url: '../set/set?settlementType=' + _this.data.settlementType + '&shoptype=1&payshoids=' + payshoids
      })
    }
  },
  //购物车获取
  getshopcard: function(e){
    let _this =this;
    app._ajax(
      "post",
      "/cart/queryCart",
      {
        userId: Number(wx.getStorageSync('uid')),
        settlementType:e
      },
      (data) => {
        let moneyshoplist = data.data
        for (let i = 0; i < data.data.length; i++) {
          moneyshoplist[i].patconlist_chack_img = false;
        }
        if(e==1){
          _this.setData({
            patconlist: moneyshoplist
          })
        }else if(e==2){
          let engo
          _this.setData({
            nengconlist: moneyshoplist
          })
        }
      },
      (msg) => {
        app.tipToast(2, msg);
      }
    ) 
  }
})
