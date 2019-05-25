//index.js
const app = getApp()
Page({
  data: {
    imgUrls: [
      'cloud://siyangjiaju-7e0773.7369-siyangjiaju-7e0773/swiperPics/1.jpg',
      'cloud://siyangjiaju-7e0773.7369-siyangjiaju-7e0773/swiperPics/2.jpg',
      'cloud://siyangjiaju-7e0773.7369-siyangjiaju-7e0773/swiperPics/3.jpg',
      'cloud://siyangjiaju-7e0773.7369-siyangjiaju-7e0773/swiperPics/4.jpg',
      'cloud://siyangjiaju-7e0773.7369-siyangjiaju-7e0773/swiperPics/5.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 2000,
    routers: [{
        name: '移门室内门',
        url: '/pages/doors/doors',
        icon: '/images/icons/doors.png'
      },
      {
        name: '纱窗阳光房',
        url: '/pages/windows/windows',
        icon: '/images/icons/windows.png'
      },
      {
        name: '瓷砖',
        url: '/pages/tiles/tiles',
        icon: '/images/icons/tiles.png'
      },
      {
        name: '厨卫',
        url: '/pages/kitchen/kitchen',
        icon: '/images/icons/toilets.png'
      },
      {
        name: '家具',
        url: '/pages/closets/closets',
        icon: '/images/icons/closet.png'
      },
      {
        name: '水电材料',
        url: '/pages/electrocity/electrocity',
        icon: '/images/icons/electrocity.png'
      },
      {
        name: '水泥黄沙',
        url: '/pages/concrete/concrete',
        icon: '/images/icons/concrete.png'
      },
      {
        name: '墙面油漆',
        url: '/pages/paint/paint',
        icon: '/images/icons/paint.png'
      },
      {
        name: '窗帘布艺',
        url: '/pages/curtains/curtains',
        icon: '/images/icons/curtains.png'
      },
      {
        name: '家政服务',
        url: '/pages/homemaids/homemaids',
        icon: '/images/icons/homemaids.png'
      },
      {
        name: '家电',
        url: '/pages/fridge/fridge',
        icon: '/images/icons/fridge.png'
      },
      {
        name: '吊顶木工',
        url: '/pages/woods/woods',
        icon: '/images/icons/woods.png'
      }
    ]
  },
  onLoad: function() {}

})