// 以下参照native实现
// Android:
// http://10.20.11.218/FFProject/appframework_android/raw/master_dev/src/main/java/com/pingan/fstandard/common/net/common/KitchenParamsProcessor.java
// iOS:
// appframework_ios/Pod/Classes/Network/PAFFStandardRequestProcessor.m
// 事例请求(iOS)：
/* {
    appKey = 10000bb;
    appVersion = "1.4.1";
    deviceId = "D9B845A3-0696-4CE3-A7BB-B08DCA278427";
    deviceIp = "10.180.186.203";
    deviceType = iOS;
    format = json;
    loginMode = 4;
    method = "product.list";
    osVersion = "10.0";
    reqToken = 2A431B5D680C4722831496803565C5B2;
    requestData = "{\"pageSize\":\"100\",\"name\":\"\U4e2d\U6587\",\"pageNum\":\"1\"}";
    requestId = "I_9qfOQI7nk1M850tAxCyn2Q==";
    secret = "db21f7b0-ed0e-4e6f-be21-1542f702d304";
    sellChannel = BZB01A;
    sign = c8629e9d4ae8d393c81095bffe86d48c8497fee36aa7e9e3efe5410fa55f965f;
    signMethod = sha256;
    timestamp = 1491977115;
    version = "1.0";
} */
/* {
    "appKey": "10000bb",
    "signMethod": "sha256",
    "format": "json",
    "deviceId": "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
    "deviceIp": "127.0.0.1",
    "deviceType": "h5",
    "osVersion": "0.0",
    "appVersion": "0.0",
    "secret": "db21f7b0-ed0e-4e6f-be21-1542f702d304",
    "version": "1.0.0",
    "ssoTicket": "",
    "sellChannel": "BZB01A",
    "loginMode": "4",
    "method": "product.finance.list",
    "requestId": 1492504733093,
    "reqToken": "782a91b0db80ee8612d30e694ac3daee",
    "timestamp": 1492504733,
    "requestData": "{\"pageSize\":\"100\",\"name\":\"U4e2dU6587\",\"pageNum\":\"1\"}",
    "ffContentType": "application/json",
    "sign": "dca2b8005d019ad30822ed7c8927244ca300cba836953e09d2136fc72ea58c63"
} */

import {
  KEYUTIL,
  hex2b64,
  Cipher,
  CryptoJS,
  stob64
} from './jsrsasignc';

//获取各渠道的STATIC_PARAMS和PUBLIC_KEY配置
// import { STATIC_PARAMS, PUBLIC_KEY } from '@site'

// import {
// 	refreshSession,
// } from './native_h5'

//用于临时登录F侧后台的
// import {
//   getItem
// } from 'business/Cache';

// 请求中带的，但不属于业务参数，需要过滤
const COMMMON_PARAMS = ["method", "version", "partnerId"];
// 每次请求都不会改动或者默认值


/* 标版
const STATIC_PARAMS = {
  appKey: "10000bb",
  signMethod: "sha256",
  format: "json",
  deviceId: "D9B845A3-0696-4CE3-A7BB-B08DCA278427",
  deviceIp: "10.180.185.143",
  deviceType: "iOS",
  osVersion: "10.0",
  appVersion: "1.0.0",
  secret: "db21f7b0-ed0e-4e6f-be21-1542f702d304",
  version: "1.0",
  // ssoTicket: "aRNB_KP9S7Spwuk397_ulQ",
  sellChannel: "BZB01A",
  // loginMode 对应F登入接口的返回值 kitchenInfo.ticketCreator; 默认值 4
  // loginMode: "4"
}; */

// 九江
/* const STATIC_PARAMS = {
  appKey: "10000jjyh",
  signMethod: "sha256",
  format: "json",
  deviceId: "D9B845A3-0696-4CE3-A7BB-B08DCA278427",
  deviceIp: "10.180.185.143",
  deviceType: "iOS",
  osVersion: "10.0",
  appVersion: "2.0",
  secret: "d33303d9-235b-4045-b1d3-f4816d4130be",
  version: "1.0",
  // ssoTicket: "aRNB_KP9S7Spwuk397_ulQ",
  sellChannel: "1178",
  // loginMode 对应F登入接口的返回值 kitchenInfo.ticketCreator; 默认值 4。目前APP那边是从后端取的，对应登录接口中的ticketCreator
  // loginMode: "4"
}; */

/*
const STATIC_PARAMS = {
	appKey: '10000myyh',
	signMethod: 'sha256',
	format: 'json',
	deviceId: '54f325b2-3567-11e7-960e-06d9560006f2',
	sellChannel: '1128',
	deviceType: 'H5',
	osVersion: '10.0',
	appVersion: '2.0',
	loginMode: '4',
	version: '1.0',
	secret: 'f48deb15-83a2-4445-9077-118f74fa1a9c'
} */

const STATIC_PARAMS = {
  appKey: '10000zjyh',
  signMethod: 'sha256',
  format: 'json',
  deviceId: '54f325b2-3567-11e7-960e-06d9560006f2',
  sellChannel: 'BZB04A',
  deviceType: 'H5',
  osVersion: '10.0',
  appVersion: '2.0',
  loginMode: '4',
  version: '1.0',
  secret: 'd3e8fc38-7263-4d3a-8645-334955fe6550'
}

// alert(__BUILD_CONFIG__.secret)
//加密
const RSA_PADDING_KEY = 'RSA';
const AES_IV = '1234567812345678';
let AES_KEY = getAESKey();
// 刷新会话时间
let refreshSessionStartTime = new Date().getTime();
let refreshSessionStartEnd = new Date().getTime();
// 标板
// let PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDprGj7wNmVy6l58xJkqNNpkv02OxFDcLi36+FRNXZV+6EPPvO89GylZqZYRI1hR7uIwN8FZzMtd0ympxjLCaKjjQVCthiYv0GG9afDpe8TWWpglqv9s94BpId5RKjh5Qo07JDw9tLNGftNip/lvsW23K3kQbBHZYRrD9X4eVnVmwIDAQAB';

// 九江银行
// let PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/Y0PI4dgAyKeA2lVTSmxkYvUlMvy5re0klgbXfRlDy79prnHDjIu6oVOvNpAt0eJbXC74ghl7pZcYXhK3oxrZlKwhFw5gXyNNK6jVutw5OHdZEPZZHQSHUO7GQQ1tnRpUZ6VV/FttlFEfdtgC7QKzKjSvkLgsXv6v7TqiXEFN/QIDAQAB-----END PUBLIC KEY-----';

// 民泰测试
// let PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5Y3YUxjYOvsGpgm9XAIh7AC8IWSt9ccHcXDpI9j92ziO7qyKcxd+Z1YWeE8efxWPSiqR8MF7gAs+26ec6ZVyQtwO8IYKc96R+Ip/GMVsrvH4XEJ+w2mndD1LnE49Xd3LZYzgFPnlcLSclOIo5vxGsBrktyI6yjdeLEXHZw/ZjnwIDAQAB';
//民泰生产
// let PUBLIC_KEY = __BUILD_CONFIG__.publicKey

// // 公匙
// var PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8KA5xEGcsbsLl4x3BdWdztBvAAT/aNa/JGhAlLUAix7XppZaZSN8kBaN' + 'Wa6MfN1CQP73TNoDFDc37cTPh8yPxkXGDkpUcnUNsHxt1BP+K1Tdrkrf9qN2Xk6XtHJJM0UFiFzJTnTlhnsK9yGLQojJmtIIMmfKKH27Y1oWKgGQIxQIDAQAB';

function checkParams(params) {
  for (var i in params) {
    if (params[i] == undefined) {
      params[i] = "";
    }
  }
}

function paramsToString(body) {
  return '{' + Object.keys(body).sort().filter(k => (body[k] != undefined)).map(k => `${k}=${body[k]}`).join(', ') + '}'
}

function sortKeyJson(body) {
  return Object.keys(body).sort().reduce((s, k) => {
    s[k] = body[k];
    return s
  }, {})
}

function processRequestParams(body) {
  const common_params = {};
  // 一分钟的时间刷新会话
  refreshSessionStartTime = new Date().getTime();
  if (refreshSessionStartTime - refreshSessionStartEnd > 60000) {
    console.log("-----------------超过1分钟刷新会话---------------------------")
    refreshSessionStartEnd = new Date().getTime();
    try {
      //refreshSession(function (res) {})
    } catch (e) {
      console.error(e)
    }
  };
  let requestBody = {
    ...body
  };
  for (let i = 0; i < COMMMON_PARAMS.length; ++i) {
    const key = COMMMON_PARAMS[i];
    if (requestBody.hasOwnProperty(key)) {
      common_params[key] = requestBody[key];
      delete requestBody[key];
    }
  }
  //入参和出参是否需要加密
  const requestEncode = 'requestEncode';
  const responseEncode = 'responseEncode';
  let requestEncodeFlag = false,
    responseEncodeFlag = false;
  if (requestBody.hasOwnProperty(requestEncode) && requestBody[requestEncode] === true) {
    requestEncodeFlag = true;
    delete requestBody[requestEncode];
  }
  if (requestBody.hasOwnProperty(responseEncode)) {
    responseEncodeFlag = true;
    delete requestBody[responseEncode];
  }

  // 是否登录区内
  let bankSsotoken = requestBody.hasOwnProperty('loginArea') ? {} : {
    ssoTicket: window.ssoTicket,
    // exParam: window.ssoTicket ? stob64('{"randomPublicKey": "' + window.publicKey + '"}') : ''
    // exParam: base64.encode('{"randomPublicKey": "'+window.publicKey+'"}'),
  }
  // if (!requestBody.hasOwnProperty('loginArea')) {
  //     console.log("***********登录区内的接口********************")
  //     console.log(bankSsotoken.ssoTicket)
  // };

  // ssoTicket: getItem('allUserInfo') ? getItem('allUserInfo').kitchenInfo.authenticateTicket : '',
  // loginMode: getItem('allUserInfo') ? getItem('allUserInfo').kitchenInfo.ticketCreator : '',
  // exParam: JSON.stringify({publicKey: window.publicKey})|| "MTQ5NDg5NDYzMjU3Nw==",
  // exParam: "{\"randomPublicKey\":\"MTQ5NDkwNDYwMzkzOQ==\"}",

  let staticParams = { //避免将encodeKey加到不需要加密的接口的公共参数
    ...STATIC_PARAMS
  };
  let appInfo = localStorage.getItem("appInfo");
  if (!!appInfo) {
    appInfo = JSON.parse(appInfo);
    staticParams.deviceId = appInfo.deviceID;
    staticParams.appVersion = appInfo.version;
  }
  // if (requestEncodeFlag || responseEncodeFlag) {
  let encodeKey = getEncodeKey();
  staticParams.encodeKey = encodeKey;
  // }
  requestBody = {
    ...requestBody,
  }

  let requestData = JSON.stringify(requestBody);
  //对入参进行加密
  if (requestEncodeFlag) {
    let encodeData = encryptAES(requestData);
    requestData = JSON.stringify({
      "encodeData": encodeData,
    });
  }
  // console.log(requestData)
  const reqToken = CryptoJS.enc.Hex.stringify(CryptoJS.MD5(requestData)).toUpperCase();
  // console.log(reqToken)

  return {
    ...staticParams,
    ...common_params,
    ...bankSsotoken,
    reqToken,
    loginMode: '4',
    requestData,
    // requestId: 'I_MA5oiO9Si7WyQrY796jAqw==',
    // timestamp: '1492510056',
    requestId: 'I_' + CryptoJS.enc.Base64.stringify(CryptoJS.MD5('' + new Date().valueOf())),
    timestamp: '' + parseInt(new Date().valueOf() / 1000),
  }
}
// 获取token 和 publickey
function getNativeData() {

}

// 获取统一加密 aesKey 值
function getAESKey() {
  let key = [];
  for (let i = 0; i < 16; i++) {
    var num = Math.floor(Math.random() * 26);
    var charStr = String.fromCharCode(97 + num);
    key.push(charStr.toUpperCase());
  }
  var result = key.join('');
  return result;
};

/**
 * AES 加密
 * @param value 要加密的数据
 */
export function encryptAES(value) {
  let i = new Buffer(value).length,
    len = i;
  while (len % 16 !== 0) {
    len++;
  };
  for (; i < len; i++) {
    value += ' ';
  }
  return CryptoJS.enc.Base64.stringify(CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(AES_KEY), {
    iv: CryptoJS.enc.Utf8.parse(AES_IV),
    padding: CryptoJS.pad.NoPadding
  }).ciphertext);
};

/**
 * AES 解密
 * @param value 要解密的数据
 */
function decryptAES(value = '') {
  return CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(value, CryptoJS.enc.Utf8.parse(AES_KEY), {
    iv: CryptoJS.enc.Utf8.parse(AES_IV),
    padding: CryptoJS.pad.NoPadding
  })).trim();
};
/**
 * 对AES密钥加密
 */
function getEncodeKey() {
  let start = '-----BEGIN PUBLIC KEY-----',
    end = '-----END PUBLIC KEY-----';
  if (!PUBLIC_KEY.startsWith(start)) {
    PUBLIC_KEY = start + PUBLIC_KEY;
  }
  if (!PUBLIC_KEY.endsWith(end)) {
    PUBLIC_KEY += end;
  }
  let keyObj = KEYUTIL.getKey(PUBLIC_KEY),
    encryptCode = hex2b64(Cipher.encrypt(AES_KEY, keyObj, RSA_PADDING_KEY));
  encryptCode = encryptCode.replace(/^(\r)|(\n)|(\r\n)$/g, '');
  return encryptCode;
}

function processSignature(body) {
  // console.log(SHA256(paramsToString(body)).toString(Hex));
  paramsToString(body);
  //console.log(paramsToString(body));
  return {
    ...body,
    // ffContentType: 'application/json',
    sign: CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(paramsToString(body)))
  }
}

export function processBody(body) {
  console.log(body)
  checkParams(body);
  //console.log(body);
  body = processRequestParams(body);
  body = sortKeyJson(body);
  // console.log("before", body);
  console.log("before", JSON.stringify(body));
  body = processSignature(body);
  console.log("after", JSON.stringify(body));
  return body;
}

export function processResponseParams(res) {
  let responseData = res.responseData;
  if (res.isEncrypted == '1') { //出参加密
    let encodeData = decryptAES(responseData.encodeData);
    responseData = JSON.parse(encodeData);
  }
  return responseData;
}
