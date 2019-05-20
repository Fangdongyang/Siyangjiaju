//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cover: '',
    storeName: '',
    content: '',
    storeAddress:'',
    storeContactName:'',
    storeContactPhone:''

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
//删除门店信息
  deleteStore: function(e){
    wx.showModal({
      title: '提示',
      content: '您确认要删除此条门店信息？',
      success: function(res){
        if(res.confirm){
          console.log('用户点击确定')
         //调用数据库API进行删除
          // 初始化db
          const db = wx.cloud.database({});
          let storeId = app.globalData.store.id;
          db.collection('StoresForAll').doc(storeId).remove().then(res => {
            console.log('门店数据删除成功');
            wx.showToast({
              title: '门店信息删除成功！',
              icon: 'success'
            });
            wx.redirectTo({
              url: '/pages/userInfo/myShop/myShop',
            })
          })
           
        }
        else if(res.cancel){
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
updateStore: function(e){
  wx.redirectTo({
    url: '/pages/userInfo/myShop/updateShop/updateShop',
  })

}
 
})