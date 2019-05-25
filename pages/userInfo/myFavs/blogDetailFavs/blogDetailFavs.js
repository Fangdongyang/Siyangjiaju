// pages/userInfo/myFavs/blogDetailFavs/blogDetailFavs.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cover: '',
    title: '',
    content: ''
  },

  onLoad: function(options) {
    //获取动态详情
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
        console.log('db读取成功', res.data);
        let data = res.data;
        this.setData({
          cover: data.cover,
          title: data.title,
          content: data.content,
        });
      })
      .catch(e => {
        wx.showToast({
          title: 'db读取失败',
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

  //删除收藏商品信息
  deleteBlogFavs: function(e) {
    wx.showModal({
      title: '提示',
      content: '您确认要删除此条收藏动态？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          //调用数据库API进行删除
          // 初始化db
          const db = wx.cloud.database({});
          let blogId = app.globalData.blog.id;

          console.log('当前 blogid为',blogId);
          //获取当前用户创建的商品信息
          //数据库权限为仅创建者可独写.doc方法只能删除_id条件的数据
          //删除多条件数据，需要使用云函数

          wx.cloud.callFunction({
            name: 'deleteFavBlog',
            data: {
              blogId: blogId
            }
          }).then(res => {
            console.log('调用云函数成功', res)
            wx.showToast('删除动态成功！')
            const result = res.result;
            const data = result.data || {};

            if (result.code) {
              wx.showToast({
                title: result.msg,
                icon: 'success',
                duration: 2000
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



});