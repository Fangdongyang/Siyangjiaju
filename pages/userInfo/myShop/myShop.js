// pages/userInfo/myShop/myShop.js
const app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["商家信息", "商品信息"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    openid: '',
  },
  //存储门店信息
  data1: {

  },
  //存储商品信息
  data2: {

  },
  //onLoad函数
  onLoad: function() {
    //获取用户openID
    this.getOpenid();
    this.getData1();
    this.getData2();
    //页面设置
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 获取用户openID
   */
  getOpenid() {
    let this_ = this;
    let openid = app.globalData.openId.openid;
    this_.setData({
      openid : openid
    })
    console.log('openId:',this.data.openid)
  },



  /**
   * 获取门店列表数据
   */
  getData1() {
    const db = wx.cloud.database({});
    db.collection('StoresForAll').where({
      //获取当前用户创建的门店信息
      _openid: this.data.openid
    }).get().then(res => {
      console.log(res);
      let data1 = res.data;
      this.setData({
        list: data1
      });
    }).catch(e => {
      wx.showToast({
        title: '门店数据库读取失败',
        icon: 'none'
      });
    });
  },

  /**
   * 获取商品列表数据
   */
  getData2() {
    const db = wx.cloud.database({});
    db.collection('ProductsForAll').where({
      //获取当前用户创建的商品信息
      _openid: this.data.openid
    }).get().then(res => {
      console.log(res);
      let data2 = res.data;

      this.setData({
        list2: data2
      });
    }).catch(e => {
      wx.showToast({
        title: '商品数据库读取失败',
        icon: 'none'
      });
    });
  },

  /**
   * 跳转至门店详情
   */
  getStoreDetail(e) {
    let _id = e.currentTarget.dataset.storeid;
    app.globalData.store.id = _id;

    wx.navigateTo({
      url: '../myShop/storeDetail/storeDetail'
    });
  },

  /**
   * 跳转至商品详情
   */
  getProductDetail(e) {
    let _id = e.currentTarget.dataset.productid;
    app.globalData.product.id = _id;

    wx.navigateTo({
      url: '../myShop/productDetail/productDetail'
    });
  }
});