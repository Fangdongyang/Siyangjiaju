//blogs_my.js
//获取应用实例
const app = getApp()
wx.cloud.init();
Page({
  /**
   * 页面的初始数据
   */
  data: {

    openid: '',

  },

  //生命周期函数-加载
  onLoad: function() {
    //获取用户openID
    this.getOpenid();
    this.getData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
  * 获取用户openID
  */
  getOpenid() {
    let this_ = this;
    let openid = app.globalData.openId.openid;
    this_.setData({
      openid: openid
    })
    console.log('openId:', this.data.openid)
  },

  /**
   * 获取文章列表数据
   */
  getData() {
    const db = wx.cloud.database();
    db.collection('blog').where({
      _openid: this.data.openid
    }).get().then(res => {
      console.log(res);
      let data = res.data;
      data = data.map((item) => {
        let appendix = (item.content.length > 20) ? '...' : '';
        item.content = item.content.slice(0, 20) + appendix;
        return item;
      });

      this.setData({
        list: data,
        flag: 1
      });
    }).catch(e => {
      wx.showToast({
        title: '动态读取失败',
        icon: 'warn',
        duration:2000
      });
    });
  },

  /**
   * 跳转至文章详情
   */
  getDetail(e) {
    let _id = e.currentTarget.dataset.blogid;
    app.globalData.blog.id = _id;

    wx.navigateTo({
      url: '/pages/blogs_my/blogs_my_detail/blogs_my_detail'
    });
  }
})