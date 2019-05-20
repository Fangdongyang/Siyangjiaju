// pages/userInfo/myShop/productDetail/productDetail.js
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
    productUnit:''

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
  },
  //删除商品信息
  deleteProduct: function (e) {
    wx.showModal({
      title: '提示',
      content: '您确认要删除此条商品信息？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //调用数据库API进行删除
          // 初始化db
          const db = wx.cloud.database({});
          let productId = app.globalData.product.id;
          db.collection('ProductsForAll').doc(productId).remove().then(res => {
            console.log('商品数据删除成功');
            wx.showToast({
              title: '商品信息删除成功！',
              icon: 'success'
            });
            wx.redirectTo({
              url: '/pages/userInfo/myShop/myShop',
            })
          })

        }
        else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'success',
            duration:1000
          })
        }

      }
    })

  },
  //修改门店信息
  updateProduct: function (e) {
    wx.redirectTo({
      url: '/pages/userInfo/myShop/updateProduct/updateProduct',
    })

  }

})