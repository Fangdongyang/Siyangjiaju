// pages/userInfo/myShop/updateShop/updateShop.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['移门室内门', '纱窗阳光房', '瓷砖', '厨卫', '家具', '水电材料', '水泥黄沙', '墙面油漆', '窗帘布艺', '家政服务', '家电', '吊顶木工'],
    index: 0,
    keyType: 0,
    hasUserInfo: false,
    dataMsg: '',
    statusMsg: '',
    fileID: null,
    coverImage: '',
    tempFilePath: ''
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      keyType: e.detail.value
    })
  },

  //门店信息修改
  /**
   * 上传图片
   */
  uploadFile: function() {
    wx.chooseImage({
      success: dRes => {
        this.setData({
          statusMsg: '开始上传门头照'
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
  getTempFileURL: function() {
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: this.data.fileID,
      }],
    }).then(res => {
      console.log('获取图片成功', res)
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
   * 修改商家信息
   */
  updateStore: function(e) {
    const data = this.data
    const formData = e.detail.value;

    if (!formData.storeName || !formData.storeAddress || !formData.storeContactName || !formData.storeContactPhone || !formData.content || !data.coverImage) {
      return wx.showToast({
        title: '请将信息填写完整！',
        icon: 'none'
      });
    }

    wx.showLoading({
      title: '修改中',
    });

    //调用数据库API修改门店信息
    // 初始化db
    const db = wx.cloud.database({});
    let storeId = app.globalData.store.id;
    db.collection('StoresForAll').doc(storeId).update({
      data: {
        storeName: formData.storeName,
        storeAddress: formData.storeAddress,
        storeContactName: formData.storeContactName,
        storeContactPhone: formData.storeContactPhone,
        content: formData.content,
        keyType: formData.keyType,
        cover: data.coverImage

      },
      success(res) {
        console.log('门店数据更新成功');
        wx.showToast({
          title: '门店信息更新成功！',
          icon: 'success'
        });
        wx.redirectTo({
          url: '/pages/userInfo/myShop/myShop',
        })

      }
    })
  }
})