//tiles.js

const app = getApp()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置


Page({
  data: {
    tabs: ["品牌门店"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
* 获取门店列表数据
*/

  data1: {

  },

  getData1() {
    const db = wx.cloud.database({});
    db.collection('StoresForAll').where({
      keyType: '2'
    }).get().then(res => {
      console.log('门店数据库读取成功', res);
      let data1 = res.data;
      this.setData({
        list: data1
      });
    }).catch(e => {
      wx.showToast({
        title: '门店数据库读取失败',
        icon: 'none'
      });
    });
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData1();
  },

  /**
   * 跳转至门店详情
   */
  getStoreDetail(e) {
    let _id = e.currentTarget.dataset.storeid;
    app.globalData.store.id = _id;

    wx.navigateTo({
      url: '/pages/store_detail/store_detail'
    });
  }
});
