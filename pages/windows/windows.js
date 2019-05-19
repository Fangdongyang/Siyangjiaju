//windows.js

const App = getApp()

/*
const db = wx.cloud.database({ env: 'siyangjiaju-7e0773' })
var result = db.collection('windowsForStore').get().then(res => {
  console.log(res.data)
});
*/

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置


Page({
  data: {
    tabs: ["品牌门店", "厂家直销"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
  },
  data1: {

  },

  /**
  * 获取文章列表数据
  */
  getData1() {
    const db = wx.cloud.database({});
    db.collection('windowsForFactory').get().then(res => {
      console.log(res);
      let data1 = res.data;
      this.setData({
        list: data1
      });
    }).catch(e => {
      wx.showToast({
        title: 'db读取失败',
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


  onLoad: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
 
});
