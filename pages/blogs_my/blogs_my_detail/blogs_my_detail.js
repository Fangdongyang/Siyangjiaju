// pages/blogs_my/blogs_my_detail/blogs_my_detail.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cover: '',
    title: '',
    content: ''
  },

  onLoad: function (options) {
    this.getBlogDetail();
  },

  /**
   * 获取文章详情
   */
  getBlogDetail() {
    // 初始化db
    const db = wx.cloud.database({});
    let blogId = app.globalData.blog.id;
    db.collection('blog').doc(blogId).get().then(res => {
      console.log('动态读取成功', res.data);
      let data = res.data;
      this.setData({
        cover: data.cover,
        title: data.title,
        content: data.content
      });
    }).catch(e => {
      wx.showToast({
        title: '动态读取失败',
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

  //删除动态
  deleteBlog: function (e) {
    wx.showModal({
      title: '提示',
      content: '您确认要删除此条动态？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //调用数据库API进行删除
          // 初始化db
          const db = wx.cloud.database({});
          let blogId = app.globalData.blog.id;
          db.collection('blog').doc(blogId).remove().then(res => {
            console.log('动态数据删除成功');
            wx.showToast({
              title: '动态信息删除成功！',
              icon: 'success'
            });
            wx.redirectTo({
              url: '/pages/blogs_my/blogs_my',
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

  }



})