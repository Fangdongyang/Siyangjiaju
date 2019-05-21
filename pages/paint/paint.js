//paint.js

const app = getApp()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置


Page({
  data: {
    tabs: ["品牌门店"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    //搜索框状态
    inputShowed: false,
    //显示结果VIEW的状态
    viewShowed: false,
    //搜索框值
    inputVal: '',
    searchResult: ''
  },

  //搜索相关功能
  storeList: {

  },
  //显示搜索框样式
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  //隐藏搜索框样式
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  //清除搜索框值
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  //键盘抬起事件
  inputTyping: function (e) {
    console.log('搜索框的值为', e.detail.value)
    var that = this;
    //处理搜索值为空的情况
    if (e.detail.value == '') {
      return;
    }
    that.setData({
      viewShowed: false,
      inputVal: e.detail.value
    });


    //获取数据库数据进行比较
    var inputValue = this.data.inputVal
    console.log(inputValue)
    const db = wx.cloud.database();
    db.collection('StoresForAll').where({
      keyType: '7',
      storeName: {
        $regex: '.*' + inputValue,
        $options: 'i'
      }
    }).get().then(res => {
      console.log('门店数据库读取成功', res);
      let storedata = res.data;
      console.log(storedata);
      if (storedata.length > 0) {
        this.setData({
          storeList: storedata
        });
      } else {
        console.log('无搜索结果')
        this.setData({
          searchResult: '无相关门店信息！'
        });
      }
    }).catch(e => {
      wx.showToast({
        title: '门店数据库读取失败',
        icon: 'none'
      });
    });

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
      keyType: '7'
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
