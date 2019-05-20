// pages/userInfo/myShop/addProduct/addProduct.js
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
    tempFilePath: '',

  },

  /**
   * 上传文件
   */
  uploadFile: function () {
    wx.chooseImage({
      success: dRes => {
        this.setData({
          statusMsg: '开始上传商品照片'
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
                title: '上传成功',
                icon: 'success',
                duration: 3000
              });
            }
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: '上传图片失败',
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
  getTempFileURL: function () {
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
      console.error('获取图片链接失败', err)
      wx.showToast({
        title: '获取图片链接失败',
        icon: 'none'
      });
      wx.hideLoading();
    })
  },

  /**
   * 发布商品信息
   */
  addProduct: function (e) {
    const data = this.data
    const formData = e.detail.value;

    if (!formData.productName || !formData.productPrice || !formData.productUnit || !formData.productSize || !formData.content|| !formData.productColor || !data.coverImage) {
      return wx.showToast({
        title: '商品名称、商品价格、商品单位、商品尺寸、商品颜色、商品说明等信息不能为空',
        icon: 'none'
      });
    }

    wx.showLoading({
      title: '发布中',
    });

    wx.cloud.callFunction({
      name: 'addproduct',
      data: {
        cover: data.coverImage,
        productName: formData.productName,
        productPrice: formData.productPrice,
        productUnit: formData.productUnit,
        productSize: formData.productSize,
        productColor: formData.productColor,
        content: formData.content
      }
    }).then(res => {
      console.log('云函数调用成功', res)
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 3000
      })
      const result = res.result;
      const data = result.data || {};

      if (result.code) {
        wx.showToast({
          title: '商品信息发布失败' + result.msg,
          icon: 'none'
        });
        return;
      }

      // 跳转到门店详情
      app.globalData.product.id = data.id;
      wx.navigateTo({
        url: '/pages/userInfo/myShop/productDetail/productDetail'
      });
      wx.hideLoading();

    }).catch(err => {
      console.error('调用失败', err)
      this.setData({
        statusMsg: `调用失败：${err.errMsg}`,
      });
      wx.hideLoading();
    });
  }
})