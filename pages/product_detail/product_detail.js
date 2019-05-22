// pages/product_detail/product_detail.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cover: '',
    productName: '',
    content: '',
    productPrice: '',
    productSize: '',
    productColor: '',
    productUnit: '',
    openid: '',
    rateValue_p: 0,
    favStatus_p: ''

  },

  onLoad: function() {
    //获取商品详情信息
    this.getProductDetail();
    //获取用户openID
    this.getOpenid();
    //获取用户评分状态
    this.getRateValue_p();
    //获取用户门店收藏状态
    this.getProductFavs();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 获取商品详情
   */
  getProductDetail() {
    // 初始化db
    const db = wx.cloud.database({});
    let productId = app.globalData.product.id;
    db.collection('ProductsForAll').doc(productId).get().then(res => {
        console.log('数据库读取成功', res.data);
        let data = res.data;
        this.setData({
          cover: data.cover,
          productName: data.productName,
          content: data.content,
          productPrice: data.productPrice,
          productSize: data.productSize,
          productColor: data.productColor,
          productUnit: data.productUnit

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

  /**
   * 获取用户评分状态
   */

  getRateValue_p() {
    var this_ = this
    const db = wx.cloud.database({});
    let productId = app.globalData.product.id;
    db.collection('productRate').where({
      //获取当前用户评分的商品信息
      _openid: this.openid,
      productId: productId
    }).get().then(res => {
      console.log('用户评分集合读取成功：',res)
      if (res.data[0].rateValue_p > 0) {
        var rateValue1_p = res.data[0].rateValue_p; //注意！！！！！data是一个数组，将其中某一个值进行赋//值时，需要使用data[0]添加index!!!!!!!!!!!
        console.log('当前用户商品评分为：',rateValue1_p);
        this_.setData({
          rateValue_p : rateValue1_p,
        })
      } else {
        console.log('当前用户商品评分为0')
      }

    }).catch(e => {
      wx.showToast({
        title: '您还未对商品评分！',
        icon: 'none'
      });
    });
  },


  //改变评分
  onChange_p(event) {
    var that = this
    this.setData({
      rateValue_p: event.detail
    });
    console.log('用户评分了商品',this.data.rateValue_p)
    //存储评分信息进入数据库
    const db = wx.cloud.database({});
    let productId = app.globalData.product.id;
    db.collection('productRate').add({
      data: {
        productId: productId,
        rateValue_p: this.data.rateValue_p
      }
    }).then(res => {
      wx.showToast({
        title: '评分成功！',
        icon: 'success',
        duration: 2000
      })
    }).catch(e => {
      wx.showToast({
        title: '商品评分集合读取失败',
        icon: 'none'
      });
    });


  },

  /**
   * 获取商品收藏状态
   */
  getProductFavs() {
    var this_ = this
    const db = wx.cloud.database({});
    let productId = app.globalData.product.id;
    db.collection('productFavs').where({
      //获取当前用户收藏的商品信息
      _openid: this.openid,
      productId: productId
    }).get().then(res => {
      console.log('商品收藏集合读取成功：',res)
      if (res.data[0].favStatus_p > 0) {
        var favStatus2_p = res.data[0].favStatus_p; //注意！！！！！data是一个数组，将其中某一个值进行赋//值时，需要使用data[0]添加index!!!!!!!!!!!
        console.log('商品收藏状态为',favStatus2_p);
        this_.setData({
          favStatus_p : favStatus2_p
        })
      } else {
        console.log('favstatus为0，未收藏')
      }

    }).catch(e => {
      wx.showToast({
        title: '您还未收藏！',
        icon: 'none'
      });
    });

  },





  /**
   * 收藏门店
   */
  onFavTap_p(event) {
    var that = this
    this.setData({
      favStatus_p: 1
    });
    console.log(this.data.favStatus_p)
    //存储评分信息进入数据库
    const db = wx.cloud.database({});
    let storeId = app.globalData.store.id;
    console.log(storeId)
    db.collection('productFavs').add({
      data: {
        storeId: storeId,
        favStatus: this.data.favStatus
      }
    }).then(res => {
      wx.showToast({
        title: '收藏成功！',
        icon: 'success',
        duration: 2000
      })
    }).catch(e => {
      wx.showToast({
        title: '收藏失败！',
        icon: 'none'
      });
    });

  },



})