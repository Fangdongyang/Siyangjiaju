// pages/userInfo/myFavs/myFavs.js
const app = getApp()
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["商家收藏", "商品收藏", "动态收藏"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    openid: '',
    storeid: [],
    productid: [],
    blogid: []
  },

  //生命周期函数-加载
  onLoad: function() {
    //获取用户openID
    this.getOpenid();
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
    this.getStoreData();
    this.getProductData();
    this.getBlogData();
  },

  //存储门店信息
  storeData: {

  },
  //存储商品信息
  productData: {

  },
  //存储动态信息
  blogData: {

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
        that.setData({
          openid: openid
        })
      }
    })
  },


  /**
   * 获取用户收藏的门店列表数据
   */
  getStoreData() {
    var _this = this;
    var storeid = this.data.storeid;
    const db = wx.cloud.database({});
    const com_ = db.command
    //step1.查询收藏集合中的数据
    db.collection('storeFavs').get().then(res => {
      console.log('用户门店收藏数据：', res.data);
      console.log('门店数组长度：', res.data.length);
      //遍历数组数据
      for (var i = 0; i < res.data.length; i++) {
        console.log('门店ID循环输出:', res.data[i].storeId)
        storeid.push(res.data[i].storeId);
      }
      console.log('获取到的storeid为', storeid);

      //step2.根据storeId条件查询收藏的门店信息,使用IN功能
      //调用数据库API进行条件判断
      db.collection('StoresForAll').where({
        //获取当前用户收藏的门店id
        _id: com_.in(storeid) //注：小程序此处有bug!!!数据库中的数据为平台导入的时候，in查询不到数据 ！
      }).get().then(res => {
        console.log('获取到的门店信息为', res);
        let data1 = res.data;
        _this.setData({
          storeData: data1
        });
      })
    }).catch(e => {
      wx.showToast({
        title: '获取收藏商家失败!',
        icon: 'warn',
        duration: 2000
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
      url: '../myFavs/storeDetailFavs/storeDetailFavs'
    });
  },

  /**
   * 获取用户收藏的商品列表数据
   */
  getProductData() {
    var _this2 = this;
    var productid = this.data.productid;
    const db = wx.cloud.database({});
    const com_ = db.command
    //step1.查询收藏集合中的数据
    db.collection('productFavs').get().then(res => {
      console.log('用户商品收藏数据：', res.data);
      console.log('商品数组长度：', res.data.length);
      //遍历数组数据
      for (var j = 0; j < res.data.length; j++) {
        console.log('商品id循环输出:', res.data[j].productId)
        productid.push(res.data[j].productId);
      }
      console.log('获取到的productid为', productid);

      //step2.根据storeId条件查询收藏的商品信息,使用IN功能
      //调用数据库API进行条件判断
      db.collection('ProductsForAll').where({
        //获取当前用户收藏的商品id
        _id: com_.in(productid) //注：小程序此处有bug!!!数据库中的数据为平台导入的时候，in查询不到数据 ！
      }).get().then(res => {
        console.log('获取到的商品信息为', res);
        let data2 = res.data;
        _this2.setData({
          productData: data2
        });
      })
    }).catch(e => {
      wx.showToast({
        title: '获取收藏商品失败!',
        icon: 'warn',
        duration: 2000
      });
    });

  },

  /**
 * 跳转至商品详情
 */
  getProductDetail(e) {
    let _id = e.currentTarget.dataset.productid;
    app.globalData.product.id = _id;

    wx.navigateTo({
      url: '/pages/userInfo/myFavs/productDetailFavs/productDetailFavs'
    });
  },



  /**
   * 获取用户收藏的文章列表数据
   */
  getBlogData() {
    var _this3 = this;
    var blogid = this.data.blogid;
    const db = wx.cloud.database({});
    const com_ = db.command
    //step1.查询收藏集合中的数据
    db.collection('blogFavs').get().then(res => {
      console.log('用户收藏动态数据：', res.data);
      console.log('动态数组长度：', res.data.length);
      //遍历数组数据
      for (var k = 0; k < res.data.length; k++) {
        console.log('blogid循环输出:', res.data[k].blogId)
        blogid.push(res.data[k].blogId);
      }
      console.log('获取到的blogid为', blogid);

      //step2.根据storeId条件查询收藏的动态信息,使用IN功能
      //调用数据库API进行条件判断
      db.collection('blog').where({
        //获取当前用户收藏的动态id
        _id: com_.in(blogid) //注：小程序此处有bug!!!数据库中的数据为平台导入的时候，in查询不到数据 ！
      }).get().then(res => {
        console.log('获取到的动态信息为', res);
        let data3 = res.data;
        _this3.setData({
          blogData: data3
        });
      })
    }).catch(e => {
      wx.showToast({
        title: '获取收藏动态失败!',
        icon: 'warn',
        duration: 2000
      });
    });
  },

  /**
 * 跳转至动态详情
 */
  getBlogDetail(e) {
    let _id = e.currentTarget.dataset.blogid;
    app.globalData.blog.id = _id;

    wx.navigateTo({
      url: '../myFavs/blogDetailFavs/blogDetailFavs'
    });
  },



})