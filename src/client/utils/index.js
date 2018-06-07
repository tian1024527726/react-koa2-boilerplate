import EnhanceAxios from './enhanceAxios.js';
import './requestHandler';

const _env = process.env.NODE_ENV;
let IS_LOADING = false;

/**
 * 将20180426的时间格式化为 ---2018-04-26---
 * @param {*} str
 */
export const fillDate = (str) => {
  let arr = str.split('');
  arr.splice(4, 0, '-');
  arr.splice(-2, 0, '-');
  return arr.join('');
};
/**
 * 小于10补充0,返回一个字符串
 * @param {*} n
 */
export const fillZero = (n) => {
  return n < 10 ? '0' + n : '' + n;
};
/**
 *获取当前时间 ---20180416235912---格式14位
 * @param {*} type
 */
export const getToday = (type) => {
  let d = new Date();
  let y = d.getFullYear(), M = d.getMonth() + 1, day = d.getDate(),
    hour = d.getHours(), minute = d.getMinutes(), second = d.getSeconds();
  if (type) {
    return y + type + fillZero(M) + type + fillZero(day);
  }
  return y + fillZero(M) + fillZero(day) + fillZero(hour) + fillZero(minute) + fillZero(second);
};
/**
 * 将不同格式的时间，转成时间戳
 * @param {*} time
 */
export const getTimeStamp = (time, type) => {
  let timeStamp = null, arr = null;
  switch (type) {
    case "yyyy-MM-DD HH:mm":
      arr = time.split(" ");
      timeStamp = + new Date(arr[0].replace(/-/g, '/') + " " + arr[1]);
      break;
    case "yyyyMMDD":
      arr = time.split("");
      arr.splice(4, 0, '/');
      arr.splice(-2, 0, '/');
      timeStamp = +new Date(arr.join(''));
      break;
  }
  return timeStamp;
}
/**
 * 将时间戳，转成不同格式的时间
 * @param {*} timeStamp
 * @param {*} type
 */
export const getTime = (timeStamp, type) => {
  let time = null, Y = null, M = null, D = null, H = null, m = null, s = null, date = new Date(timeStamp);
  Y = date.getFullYear();
  M = date.getMonth() + 1;
  D = date.getDate();
  H = date.getHours();
  m = date.getMinutes();
  s = date.getSeconds();
  switch (type) {
    case 'yyyyMMDDhhmmss':
      time = Y + fillZero(M) + fillZero(D) + fillZero(H) + fillZero(m) + fillZero(s);
      break;
    case 'MM-DD HH:mm':
      time = fillZero(M) + "-" + fillZero(D) + " " + fillZero(H) + ":" + fillZero(m);
      break;
  }

  return time;
}

/**
 * 从20180426格式的时间中获取星期  ---星期日---格式
 * @param {*} time
 */
export const getWeek = (time) => {
  let arr = time.split('');
  arr.splice(4, 0, '/');
  arr.splice(-2, 0, '/');
  return "星期" + "日一二三四五六".charAt(new Date(arr.join('')).getDay())
}
/**
 * 从20180426格式的时间中获取月份 ---04-26---格式
 * @param {*} time
 */
export const getMonth = (time) => {
  let month = time.slice(4);
  let arr = month.split('');
  arr.splice(-2, 0, '-');
  return arr.join('');
}

/**
 *获取url中的参数
 * @param {*} params
 */
export const toQS = (params) => {
  let paramsList = [];
  for (let key in params) {
    paramsList.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
  }
  return paramsList.join("&");
};
/**
 *向url中添加参数
 * @param {*} host
 * @param {*} url
 * @param {*} params
 */
export const addQS = (host, url, params) => {
  if (!/^(:?https?:\/)?\//.test(url)) {
    url = host + url;
  }
  const query = toQS(params);
  return query ? url + (url.indexOf("?") ? "?" : "&") + toQS(params) : url;
};
/**
 *格式化金钱数字
 * @param {*} money
 * @param {*} n
 */
export const formatMoney = (money, n) => {
  if (!money || !(money = parseFloat(money))) {
    money = 0;
  }
  n = n > 0 && n <= 3 ? n : 2;
  money = money.toFixed(n);
  let l = money.split(".")[0].split("").reverse();
  let r = money.split(".")[1];
  let t = "";
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return t.split("").reverse().join("") + "." + r;
};
/**
 * 获取数据类型
 * @param {*} obj
 */
export const getType = (obj) => {
  return Object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}
/**
 * 设置小数位数，默认number类型，允许传string类型
 * @param {*} params
 * @param {*} num
 */
export const formatNumber = (params, num = 2) => {
  let data;
  if (getType(params) === 'number') {
    data = params;
  } else if (getType(params) === 'string') {
    if (params == "null") params = 0;
    data = parseFloat(params);
  } else if (getType(params) === 'null' || getType(params) === 'undefined'){
    params = 0;
    data = parseFloat(params);
  } else {
    throw new Error(`请传入number和string数据类型`);
  }

  return data.toFixed(num);
}
/**
 * 保存localStorage的数据
 * @param {*} key
 * @param {*} value
 */
export const saveLocalData = (key, value) => {
  window.localStorage[key] = value;
}
/**
 * 获取localStorage的数据
 * @param {*} key
 */
export const getLocalData = (key) => {
  return window.localStorage[key];
}
/**
 * 保存sessionStorage的数据
 * @param {*} key
 * @param {*} value
 */
export const saveSessionData = (key, value) => {
  window.sessionStorage[key] = value;
}
/**
 * 获取sessionStorage的数据
 * @param {*} key
 */
export const getSessionData = (key) => {
  return window.sessionStorage[key];
}
/**
 *
 * @param {*} shareData
 * @param {*} successFun
 * @param {*} errorFun
 */
export const weixinShare = (shareData, successFun, errorFun) => {
  let wxAttributes;
  $.ajax({
    type: 'get',
    url: 'http://test-yzthd.pingan.com.cn:6080/api/wechat/jsapi/signature',
    data: {
      url: window.location.href
    },
    dataType: 'jsonp',
    success: function (data) {
      switch (data.status) {
        case 'SUCCESS':
          wxAttributes.configAppId = data.attributes.config.appid;
          wxAttributes.configTimestamp = data.attributes.config.timestamp;
          wxAttributes.configNoncestr = data.attributes.config.noncestr;
          wxAttributes.configSignature = data.attributes.config.signature;
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端util.showToast出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: wxAttributes.configAppId, // 必填，公众号的唯一标识
            timestamp: wxAttributes.configTimestamp, // 必填，生成签名的时间戳
            nonceStr: wxAttributes.configNoncestr, // 必填，生成签名的随机串
            signature: wxAttributes.configSignature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function () {
            //分享至朋友圈
            wx.onMenuShareTimeline({
              title: shareData.title, // 分享标题
              desc: shareData.content, // 分享描述
              link: shareData.href, // 分享链接
              imgUrl: shareData.imgUrl, // 分享图标
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });
            wx.onMenuShareAppMessage({
              //分享至微信好友
              title: shareData.title, // 分享标题
              desc: shareData.content, // 分享描述
              link: shareData.href, // 分享链接
              imgUrl: shareData.imgUrl, // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });
          });
          break;
        default:
      }
    }
  })
}
/**
 *
 * @param {*} err
 */
export const requestError = (operationType, err, context) => {
  showNativeToast(err.tips || err.responseMessage || '系统繁忙，请稍后再试');
  /*非网络异常情况下,判断页面中是否还有请求正在执行,没有就隐藏loading*/
  if (JSON.stringify(requestHandler.requestRecord) === "{}") {
    hideNativeLoading();
  }
}
/**
 *
 * @param {*} data
 */
export const requestSuccess = (data) => {
    /*判断页面中接口请求是否全部结束,隐藏loading*/
    if (JSON.stringify(requestHandler.requestRecord) === "{}") {
      hideNativeLoading();
    }
}

