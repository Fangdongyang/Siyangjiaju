//index.js
var util = require('../../db/util.js')
//获取应用实例
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    cover: '',
    title: '',
    content: '',
    openid: '',
    upNum: 0,
    commentNum: 0,
    favNum: 0,
    upStatus: 0,
    favStatus: 0,
    commentText: '',
    date: '',
    defaultImg: '/images/icons/user.png',
    userInfo: {},
  },
  //生命周期
  onLoad: function(options) {
    //获取当前时间
    this.setData({
      date: util.formatTime(new Date())
    });
    //获取动态详情
    this.getBlogDetail();
    //获取用户openID
    //this.getOpenid();
    //获取用户动态点赞状态
    this.getBlogUpStatus();
    //获取用户评论状态
    this.getBlogComment();
    //获取用户动态收藏状态
    this.getBlogFavStatus();
    //获取评论数commentNum
    this.getCommentNum();
    //获取点赞数upNum
    this.getUpNum();
    //获取收藏数favNum
    this.getFavNum();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
  },

  //生命周期函数
  onLaunch: function() {
    var storageData = wx.getStorageSync('postList');
    if (!storageData) {
      //如果缓存数据不存在
      //引用data.js模块
      var dataObj = require("../../data/data.js")
      wx.clearStorageSync();
      wx.setStorageSync('postList', dataObj.postList)
    }
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

  //获取评论数commentNum
  getCommentNum() {
    var this_ = this
    let blogId = app.globalData.blog.id;
    const db = wx.cloud.database({});
    db.collection('blogComment').where({
      blogId: blogId
    }).count().then(res => {
      console.log('动态评论总数：', res.total)
      this_.setData({
        commentNum: res.total
      })
    })
  },
  //获取点赞数upNum
  getUpNum() {
    var this_ = this
    let blogId = app.globalData.blog.id;
    const db = wx.cloud.database({});
    db.collection('blogUp').where({
      blogId: blogId
    }).count().then(res => {
      console.log('动态点赞总数：', res.total)
      this_.setData({
        upNum: res.total
      })
    })
  },
  //获取收藏数favNum
  getFavNum() {
    var this_ = this
    const db = wx.cloud.database({});
    let blogId = app.globalData.blog.id;
    db.collection('blogFavs').where({
      blogId: blogId
    }).count().then(res => {
      console.log('动态收藏总数：', res.total)
      this_.setData({
        favNum: res.total
      })
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
    }).catch(e => {})
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
      //调用onLoad刷新页面
      this.onLoad();
    }).catch(e => {
      wx.showToast({
        title: '点赞失败',
        icon: 'none'
      });
    });
  },

  //用于存放评论数据
  commentData: {},

  //获取评论数据库中的信息
  getBlogComment() {
    var this_ = this
    const db = wx.cloud.database({});
    let blogId = app.globalData.blog.id;

    db.collection('blogComment').where({
      //获取当前用户评论信息
      _openid: this.openid,
      blogId: blogId
    }).get().then(res => {
      console.log('动态评论集合读取成功：', res)
      let commentdata = res.data
      this_.setData({
        commentData: commentdata
      })
    }).catch(e => {
      wx.showToast({
        title: '获取评论信息失败！',
        icon: 'none',
        duration: 2000
      });
    });

  },

  //用户评论处理函数
  inputHandler: function(e) {
    var this_ = this;
    console.log('评论内容为', e.detail.value)
    this_.setData({
      commentText: e.detail.value
    })
  },
  confirm: function() {
    const db = wx.cloud.database()
    const _ = db.command
    let blogId = app.globalData.blog.id;
    let userName = this.data.userInfo.nickName;
    let avatarUrl = this.data.userInfo.avatarUrl;
    let date = this.data.date
    //发送评论
    if (this.data.commentText) {
      //填写了评论内容才能添加进入数据库
      //存储收藏动态信息进入数据库
      const db = wx.cloud.database({});
      let blogId = app.globalData.blog.id;
      let commentText = this.data.commentText
      db.collection('blogComment').add({
        data: {
          blogId: blogId,
          commentText: commentText,
          userName: userName,
          avatarUrl: avatarUrl,
          date: date
        }
      }).then(res => {
        wx.showToast({
          title: '评论成功！',
          icon: 'success',
          duration: 2000
        })
        //用onLoad周期方法重新加载，实现当前页面的刷新
        this.onLoad()
      }).catch(e => {
        wx.showToast({
          title: '收藏失败！',
          icon: 'none'
        });
      });
    } else {
      wx.showToast({
        title: '请填写评论内容！',
        icon: 'warn',
        duration: 2000
      })
    }

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
      console.log('用户收藏动态信息', res)
      if (res.data[0].favStatus > 0) {
        var favStatus2 = res.data[0].favStatus; //注意！！！！！data是一个数组，将其中某一个值进行赋//值时，需要使用data[0]添加index!!!!!!!!!!!
        this_.setData({
          favStatus: favStatus2
        })
      } else {
        console.log('favstatus为0，未收藏')
      }
    }).catch(e => {})
  },
  //收藏处理函数
  onBlogCollectTap() {
    var that = this
    this.setData({
      favStatus: 1
    });
    console.log('收藏动态状态为：', this.data.favStatus)
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
      //调用onLoad刷新页面
      this.onLoad();
    }).catch(e => {
      wx.showToast({
        title: '收藏失败！',
        icon: 'none'
      });
    });

  },

});