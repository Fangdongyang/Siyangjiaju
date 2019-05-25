// pages/userInfo/myFavs/storeDetailFavs/storeDetailFavs.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cover: '',
    storeName: '',
    content: '',
    storeAddress: '',
    storeContactName: '',
    storeContactPhone: '',
    openid: '',
  },

  onLoad: function() {
    this.getStoreDetail();
    //获取用户openID
    this.getOpenid();
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
   * 获取收藏门店详情
   */
  getStoreDetail() {
    // 初始化db
    const db = wx.cloud.database({});
    let storeId = app.globalData.store.id;
    db.collection('StoresForAll').doc(storeId).get().then(res => {
        console.log('门店详情读取成功', res.data);
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
          title: '获取收藏门店详情失败',
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

  //删除收藏门店信息
  deleteStoreFavs: function(e) {
    wx.showModal({
      title: '提示',
      content: '您确认要删除此条收藏门店？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          //调用数据库API进行删除
          // 初始化db
          const db = wx.cloud.database({});
          let storeId = app.globalData.store.id;
          //获取当前用户创建的商品信息
          //数据库权限为仅创建者可独写.doc方法只能删除_id条件的数据
          //删除多条件数据，需要使用云函数
        
          wx.cloud.callFunction({
            name: 'deleteFavStore',
            data: {
              storeId: storeId
            }
          }).then(res => {
            console.log('调用云函数成功', res)
            wx.showToast('删除门店成功！')
            const result = res.result;
            const data = result.data || {};

            if (result.code) {
              wx.showToast({
                title: result.msg,
                icon: 'success',
                duration:2000
              });
              return;
            }

            // 跳转到详情
            wx.redirectTo({
              url: '/pages/userInfo/myFavs/myFavs'
            });

          }).catch(err => {
            console.error('调用云函数失败', err)
          });
         
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'success',
            duration: 1000
          })
        }

      }
    })

  },


})