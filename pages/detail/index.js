//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cover: '',
    title: '',
    content: '',
    openid: '',
    upNum: '',
    commentNum: '',
    favNum: '',
    upStatus: 0,
    favStatus: 0
  },

  onLoad: function(options) {
    //获取动态详情
    this.getBlogDetail();
    //获取用户openID
    this.getOpenid();
    //获取用户动态点赞状态
    this.getBlogUpStatus();
    //获取用户评论状态
    this.getBlogComment();
    //获取用户动态收藏状态
    this.getBlogFavStatus();
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
        this.setData({
          openid: openid
        })
      }
    })
  },

  //获取用户动态点赞状态
  getBlogUpStatus() {
    var this_ = this
    const db = wx.cloud.database({});
    let blogId = app.globalData.blog.id;
    db.collection('blogUp').where({
      //获取当前用户点赞信息
      _openid: this.openid,
      blogId: blogId
    }).get().then(res => {
      console.log('动态点赞集合读取成功：', res)
      if (res.data[0].upStatus > 0) {
        var upStatus1 = res.data[0].upStatus; //注意！！！！！data是一个数组，将其中某一个值进行赋//值时，需要使用data[0]添加index!!!!!!!!!!!
        console.log('动态点赞状态为', upStatus1);
        this_.setData({
          upStatus: upStatus1
        })
      } else {
        console.log('upstatus为0，未点赞')
      }
    }).catch(e => {
    })
  },

  //用户点赞处理
  onBlogUpTap() {
    var that = this
    this.setData({
      upStatus: 1
    });
    console.log('用户点赞了动态', this.data.upStatus)
    //存储点赞信息进入数据库
    const db = wx.cloud.database({});
    let blogId = app.globalData.blog.id;
    db.collection('blogUp').add({
      data: {
        blogId: blogId,
        upStatus: this.data.upStatus
      }
    }).then(res => {
      wx.showToast({
        title: '点赞成功！',
        icon: 'success',
        duration: 2000
      })
    }).catch(e => {
      wx.showToast({
        title: '点赞失败',
        icon: 'none'
      });
    });


  },
  //获取用户评论状态
  getBlogComment() {

  },
  //用户评论处理函数
  onBlogCommentTap() {

  },
  //获取用户动态收藏状态
  getBlogFavStatus() {
    var this_ = this
    const db = wx.cloud.database({});
    let blogId = app.globalData.blog.id;
    db.collection('blogFavs').where({
      //获取当前用户收藏的动态信息
      _openid: this.openid,
      blogId: blogId
    }).get().then(res => {
      console.log('用户收藏动态信息',res)
      if (res.data[0].favStatus > 0) {
        var favStatus2 = res.data[0].favStatus; //注意！！！！！data是一个数组，将其中某一个值进行赋//值时，需要使用data[0]添加index!!!!!!!!!!!
        this_.setData({
          favStatus: favStatus2
        })
      } else {
        console.log('favstatus为0，未收藏')
      }
    }).catch(e => {
    })
  },
  //收藏处理函数
  onBlogCollectTap() {
    var that = this
    this.setData({
      favStatus: 1
    });
    console.log('收藏动态状态为：',this.data.favStatus)
    //存储收藏动态信息进入数据库
    const db = wx.cloud.database({});
    let blogId = app.globalData.blog.id;
    db.collection('blogFavs').add({
      data: {
        blogId: blogId,
        favStatus: this.data.favStatus
      }
    }).then(res => {
      wx.showToast({
        title: '收藏成功！',
        icon: 'success',
        duration: 2000
      })
    }).catch(e => {
      wx.showToast({
        title: '收藏失败！',
        icon: 'none'
      });
    });

  }




});