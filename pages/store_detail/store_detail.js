// pages/store_detail/store_detail.js
const app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["商家信息", "商品信息"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    openid: '',
    cover: '',
    storeName: '',
    content: '',
    storeAddress: '',
    storeContactName: '',
    storeContactPhone: '',
    rateValue:0,
  },

  
  //用于存储商品信息
  data2: {

  },
  //onLoad函数
  onLoad: function() {
    //获取门店详情
    this.getStoreDetail();
    //获取用户openID
    this.getOpenid();
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
    //获取用户评分状态
    this.getRateValue();
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 获取用户评分状态
   */

  getRateValue() {
    var this_ = this
    const db = wx.cloud.database({});
    let storeId = app.globalData.store.id;
    db.collection('storeRate').where({
      //获取当前用户创建的商品信息
      _openid: this.openid,
      storeId: storeId
    }).get().then(res => {
      console.log(res)
      if(res.data[0].rateValue > 0 ){
        var rateValue1 = res.data[0].rateValue;//注意！！！！！data是一个数组，将其中某一个值进行赋//值时，需要使用data[0]添加index!!!!!!!!!!!
        console.log(rateValue1);
        this_.setData({
          rateValue : rateValue1
        })
      }else{
        console.log('评分为0')
      }

    }).catch(e => {
      wx.showToast({
        title: '您还未评分！',
        icon: 'none'
      });
    });
  },

  
  //改变评分
  onChange(event) {
    var that = this
    this.setData({
      rateValue: event.detail
    });
    console.log(this.data.rateValue)
    //存储评分信息进入数据库
    const db = wx.cloud.database({});
    let storeId = app.globalData.store.id;
    console.log(storeId)
    db.collection('storeRate').add({
      data: {
        storeId: storeId,
        rateValue: this.data.rateValue
      }
    }).then(res => {
      wx.showToast({
        title: '评分成功！',
        icon: 'success',
        duration: 2000
      })
    }).catch(e => {
      wx.showToast({
        title: '评分数据库读取失败',
        icon: 'none'
      });
    });
   

  },



  /**
   * 获取用户openID
   */
  getOpenid() {
    let that = this;

    wx.cloud.callFunction({
      name: 'get_userinfo',
      complete: res => {
        console.log('云函数获取到的openid:', res.result.openId)
        var openid = res.result.openId;
        this.setData({
          openid: openid
        })
      }
    })
  },
  list2: {

  },
  /**
   * 获取商品列表数据
   */
  getData2() {
    const db = wx.cloud.database({});
    db.collection('ProductsForAll').where({
      //获取当前用户创建的商品信息
      _openid: this.openid
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getRateValue();
    this.getData2();
    this.getStoreDetail()
  },


  /**
   * 跳转至商品详情
   */
  getProductDetail(e) {
    let _id = e.currentTarget.dataset.productid;
    app.globalData.product.id = _id;

    wx.navigateTo({
      url: '/pages/product_detail/product_detail'
    });
  },
  /**
   * 获取门店信息详情
   */
  getStoreDetail() {
    // 初始化db
    const db = wx.cloud.database({});
    let storeId = app.globalData.store.id;
    db.collection('StoresForAll').doc(storeId).get().then(res => {
        console.log('数据库读取成功', res.data);
        let data = res.data;
        this.setData({
          cover: data.cover,
          storeName: data.storeName,
          content: data.content,
          storeAddress: data.storeAddress,
          storeContactName: data.storeContactName,
          storeContactPhone: data.storeContactPhone

        });
      })
      .catch(e => {
        wx.showToast({
          title: '数据库读取失败',
          icon: 'none'
        });
      });
  },

  /**   
   * 预览图片  
   */
  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [this.data.cover] // 需要预览的图片http链接列表  
    });
  },
});