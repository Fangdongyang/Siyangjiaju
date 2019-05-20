// pages/store_detail/store_detail.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cover: '',
    storeName: '',
    content: '',
    storeAddress: '',
    storeContactName: '',
    storeContactPhone: ''

  },

  onLoad: function () {
    this.getStoreDetail();
  },

  /**
   * 获取文章详情
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
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: [this.data.cover] // 需要预览的图片http链接列表  
    });
  },
 

})