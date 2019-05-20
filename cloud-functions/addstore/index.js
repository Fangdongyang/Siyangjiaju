
// 云函数入口文件
const cloud = require('wx-server-sdk')


// 用于权限控制
let whiteList = [];

// 云函数入口函数
exports.main = async (event, context) => {
  let {
    keyType,
    cover,
    storeName,
    storeAddress,
    storeContactName,
    storeContactPhone,
    content,
    dbchoose,
    userInfo
  } = event;

  let openId = userInfo.openId; // 添加门店者的openId

  cloud.init();
  // 数据库引用
  const db = cloud.database('StoresForAll');
  // 集合引用
 
  if (whiteList.length && !whiteList.includes(openId)) {
    return {
      code: 2, // 没有权限
      msg: '您尚未登录，没有权限发布文章'
    }
  }

  let result = null;

  try {
    // 数据库引用
    const db = cloud.database();
    // 集合引用
    const collection = db.collection('StoresForAll');

    result = await collection.add({
      data: {
        keyType,
        cover,
        storeName,
        storeAddress,
        storeContactName,
        storeContactPhone,
        content,
        _openid: openId
      }
    });
  }
  catch (e) {
    return {
      code: 1, // 添加数据失败
      msg: e.message
    };
  }

  console.log(result);

  return {
    code: 0,
    data: {
      id: result._id
    }
  };
};

