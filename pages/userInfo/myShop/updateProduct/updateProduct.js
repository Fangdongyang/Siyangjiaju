// pages/userInfo/myShop/updateProduct/updateProduct.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    dataMsg: '',
    statusMsg: '',
    fileID: null,
    coverImage: '',
    tempFilePath: ''
  },

  /**
   * 商品信息修改
   */
  uploadFile: function() {
    wx.chooseImage({
      success: dRes => {
        this.setData({
          statusMsg: '开始上传新的商品图片'
        })

        wx.showLoading({
          title: '加载中',
        });

        const uploadTask = wx.cloud.uploadFile({
          cloudPath: `${Date.now()}-${Math.floor(Math.random(0, 1) * 10000000)}.png`,
          filePath: dRes.tempFilePaths[0],
          success: res => {
            if (res.statusCode < 300) {
              this.setData({
                fileID: res.fileID,
              }, () => {
                this.getTempFileURL();
              });
              wx.showToast({
                title: '商品图片上传成功',
                icon: 'success',
                duration: 3000
              });
            }
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: '上传商品图片失败',
              icon: 'none'
            });
          },
        })
      },
      fail: console.error,
    })
  },

  /**
   * 获取图片链接
   */
  getTempFileURL: function() {
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: this.data.fileID,
      }],
    }).then(res => {
      console.log('获取商品图片成功', res)
      let files = res.fileList;

      if (files.length) {
        this.setData({
          coverImage: files[0].tempFileURL
        });
      }

      wx.hideLoading();
    }).catch(err => {
      console.error('获取商品图片失败', err)
      wx.showToast({
        title: '获取商品图片失败',
        icon: 'none'
      });
      wx.hideLoading();
    })
  },

  /**
   * 修改商品信息
   */
  updateProduct: function(e) {
    const data = this.data
    const formData = e.detail.value;

    if (!formData.productName || !formData.productPrice || !formData.productUnit || !formData.productSize || !formData.content || !formData.productColor || !data.coverImage) {
      return wx.showToast({
        title: '商品名称、商品价格、商品单位、商品尺寸、商品颜色、商品说明等信息不能为空',
        icon: 'none'
      });
    }

    wx.showLoading({
      title: '修改中',
    });

    //调用数据库API修改商品信息
    // 初始化db
    const db = wx.cloud.database({});
    let productId = app.globalData.product.id;
    db.collection('ProductsForAll').doc(productId).update({
      data: {
        cover: data.coverImage,
        productName: formData.productName,
        productPrice: formData.productPrice,
        productUnit: formData.productUnit,
        productSize: formData.productSize,
        productColor: formData.productColor,
        content: formData.content

      },
      success(res) {
        console.log('商品数据更新成功');
        wx.showToast({
          title: '商品信息更新成功！',
          icon: 'success'
        });
        wx.redirectTo({
          url: '/pages/userInfo/myShop/myShop',
        })
      }
    })
  }
})