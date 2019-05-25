//使用小程序数据缓存，部分ES6功能
//所有动态本地缓存的存储键值

//使用es6改写缓存操作类
class DBPost {
  constructor(url) {
    this.storageKeyName = 'postList';
    this.postId = postId;
  }
  //得到全部动态信息
  getAllPostData() {
    var res = wx.getStorageSync(this.storageKeyName);
    if (!res) {
      res = require('../data/data.js').postList;
      this.initPostList(res);
    }
    return res;
  }

  //获取指定ID的文章数据
  getPostItemById() {
    var postsData = this.getAllPostData();
    var len = postsData.length;
    for (var i = 0; i < len; i++) {
      if (postsData[i].postId == this.postId) {
        return {
          index: i,
          data: postsData[i]
        }
      }
    }
  }
  //收藏动态 
  collect() {
    return this.updatePostData('collect');
  }
  //处理点赞、评论、收藏核心方法
  updatePostData(category){
    var itemData = this.getPostItemById(),
    postData = itemData.data,
    allPostData = this.getAllPostData();
    switch(category){
      case 'collect':
      //处理收藏
      if(!postData.collectionStatus){
        //若当前未收藏
        postData.collectionNum++;
        postData.collectionStatus = true;
      }else{
        //若当前已收藏
        postData.collectionNum--;
        postData.collectionStatus = false;
      }
      break;
      default: break;
    }
    //更新缓存数据库
    allPostData[itemData.index] = postData;
    this.execSetStorageSync(getAllPostData);
    return postData;
  }



  //本地缓存 保存/更新
  execSetStorageSync(data) {
    wx.setStorageSync(this.setStorageSync, data);
  }
};













export {
  DBPost
}