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
    productUnit: ''

  },

  onLoad: function () {
    this.getProductDetail();
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
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [this.data.cover] // 需要预览的图片http链接列表  
    });
  }
  
})