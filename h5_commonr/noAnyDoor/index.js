/**
 * 使用方式
 * 1. 获取对应后台的网络请求对象或者自己仿照下方new一个
 *
 * import { CFNetwork, FNetwork } from "network";
 *
 * 2. 使用 get/post/jsonp 发起请求，或者使用 request 方法按照默认方式发起请求
 *
 * FNetwork.get('btoa/api', {params1: value1}).then()
 * FNetwork.post('btoa/api', {key1: value1}).then()
 *
 * 3. 只有后台返回成功才会走到成功的回调，网络请求失败或后台接口返回错误，均会走到错误处理逻辑
 * 若是后台返回错误，Error对象会带上 message/code 属性，对应服务器的返回
 * 若返回成功，则给到前端的data就是实际的数据，无需获取 responseData/data 属性
 *
 * FNetwork.get('xxx').then(
 *     data => console.log(data),
 *     err => console.log(err.code)
 * )
 */
import "whatwg-fetch";
import jsonpFetch from "fetch-jsonp";
// import {
//   getToken,
//   refreshSession,
//   getData,
//   setData,
//   openAppPageLogin
// } from './native_h5'

// import {
//   processBody as CFprocessBody,
//   processResponseParams
// } from './kitchen';

import {
  processBody as CFprocessBody
} from './kitchen';

const defaultTimeout = 30000;
const encode = encodeURIComponent;

function toQS(params) {
  let paramsList = [];
  for (let key in params) {
    paramsList.push(encode(key) + "=" + encode(params[key]));
  }
  return paramsList.join("&");
}

function addQS(host, url, params) {
  if (!/^(:?https?:\/)?\//.test(url)) {
    url = host + url;
  }
  const query = toQS(params);
  return query ? url + (url.indexOf("?") ? "?" : "&") + toQS(params) : url;
}

// option为以后预留接口，例如需要设置header
let gettingToken;
export default class Network {
  defaultMethod = "post";
  host;
  postBodyAgain;
  stringifyPostBodyAgain;
  _this = this;
  processRequest(response) {
    return response.text();
  }
  processBody(body) {
    return body;
  }
  constructor(config) {
    if (config && config.host && !/\/$/.test(config.host)) {
      config.host += "/";
    }
    Object.assign(this, config);
  }
  request(url, data, option) {
    return this[this.defaultMethod](url, data, option);
  }
  get(url, params, option) {
    url = addQS(this.host, url, params);
    return this._doRequest(url, {
      method: "get"
    });
  }
  jsonp(url, params, option = {
    timeout: defaultTimeout
  }) {
    return this._doRequest(
      addQS(this.host, url, params), {
        timeout: option.timeout
      },
      true
    );
  }
  post(url, body, option) {
    return this._postInner(url, body, option).catch(err => {
      if (err.loginFail) {
        // 重新获取ssoTicket
        if (!gettingToken) {
          gettingToken = new Promise((resolve, reject) => {
            getToken((res) => {
              if (res.status == "1") {
                // andriod 登录成功回调页面
                let options = { returnUrl: location.href };
                openAppPageLogin(options, (res) => {
                  if (res.status == '0') {
                    //IOS登录成功  刷新页面
                    location.reload(true);
                  } else if (res.status == '1') {
                    //登录失败
                    // this.refs.tip.open("登录失败,请稍后重试");
                  }
                });
                reject(err);
              } else {
                window.ssoTicket = res.data.ssoTicket;
                window.publicKey = res.data.publicKey;
                setData("H5ticket", res.data);
                resolve();
              }
            })
          })
          return gettingToken.then(() => {
            gettingToken = undefined;
            return this._postInner(url, body, option);
          })
        } else {
          return gettingToken.then(() => this._postInner(url, body, option));
        }
      } else {
        throw err;
      }
    })
  }
  _postInner(url, body, option) {
    url = addQS(this.host, url, option && option.params);
    url = url + "?" + (+new Date());
    return getNativeData().then(() => {
      body = JSON.stringify(this.processBody(body));
      return this._doRequest(url, {
        method: "post",
        body
      });
    })

  }
  // _doRequest(url, option, isJsonp) {
  //   return (isJsonp ? jsonpFetch : fetch)(url, option).then(
  //     this.processResponse
  //   )
  //   // .catch(e => {alert("网络异常"+e)})
  // }
  // 添加网络异常的处理
  //   _doRequest(url, option, isJsonp) {
  //   return (isJsonp ? jsonpFetch : fetch)(url, option).then((response)=>{
  //      return this.processResponse(response)},(response)=>{
  //       // 网络异常
  //       const err = new Error(response);
  //       // err.code = ""   //前端自定义，预留字段
  //       throw err;
  //      }
  //   )
  // }
  // 添加超时的处理，因为fetch没有超时的API
  _doRequest(url, option, isJsonp) {
    const timeoutPro = Promise.race([
      (isJsonp ? jsonpFetch : fetch)(url, option),
      new Promise(function (resolve, reject) {
        setTimeout(() => {
          var err = new Error('网络超时');
          err.code = "408";
          reject(err)
        }, 21000)
      })
    ]);
    return timeoutPro.then((response) => {
      return this.processResponse(response)
    }, (response) => {
      // 网络异常
      let err = new Error("网络异常");
      if (!response.code) {
        err.code = "404"
      } else {
        err = response;
      }
      throw err;
    }
    );
  }
}
// 获取token 和 publickey
function getNativeData() {
  return new Promise((resolve, reject) => {
    /* if (!window.ssoTicket) {
      if(false) {
        getData("H5ticket",function(res) {
          if (res.status == '0') {
            let datas ;
            if (typeof res.data.value == "string"&&res.data.value!=="") {
              datas = JSON.parse(res.data.value)
            }else{
              datas = res.data.value || {}
            }
            window.ssoTicket = datas.ssoTicket;
            window.publicKey = datas.publicKey;
          }
          resolve()
		});
		resolve();
      }else{
		resolve();
	  }
    }else{
      resolve()
	} */
    //不需要走ssoTicket 流程 提前获取了ssoTicket
    resolve();
  })
}
// // console.log(CFprocessBody)
// export const CFNetwork = new Network({
//   host: "/jkkit-gp/service",
//   processBody: CFprocessBody
// });

// 厨房后台
// export const CFNetwork = new Network({
//   host: "/jkkit-gp/service",
//   processBody: CFprocessBody,
//   processResponse(response) {
//     if(response.ok) {
//       return response.json().then(json => {
//         if (json.responseCode !== "000000") {
//           const err = new Error(json.responseMessage);
//           err.code = json.responseCode;
//           // 1000100101 增加这个网关报研签失败的错误状态，避免业务逻辑登录后没有拿到token，需要重新获取
//           // 1100720002 是和行方校验token失败后的返回
//           if (json.responseCode === "1100720002"||json.responseCode === "1000100111"||json.responseCode === "1000100112"||json.responseCode === "1000100113"|| json.responseCode === "1000100101") {
//             err.loginFail = true;
//           }
//           throw err;
//         } else {
//           let responseData = processResponseParams(json);
//           return responseData;
//         }
//       });
//     } else {
//       return new Promise(function(resolve, reject) {
//         reject(response);
//       });
//     }
//   }
// });
// window.CFNetwork = CFNetwork;
// F 后台
// export const FNetwork = new Network({
//   host: "http://f.com/",
//   processResponse(response) {
//     return response.json().then(json => {
//       if (json.code !== "000000") {
//         throw new Error(json.msg);
//         const err = new Error(json.msg);
//         err.code = json.code;
//         throw err;
//       } else {
//         return json.data;
//       }
//     });
//   }
// });

// carlife
export const CARNetwork = new Network({
  host: "/jkkit-gp/service",
  processBody: CFprocessBody,
  processResponse(response) {
    if (response.ok) {
      //   return response.json().then(json => {
      //     if (json.responseCode !== "000000") {
      //       const err = new Error(json.responseMessage);
      //       err.code = json.responseCode;
      //       // 1000100101 增加这个网关报研签失败的错误状态，避免业务逻辑登录后没有拿到token，需要重新获取
      //       // 1100720002 是和行方校验token失败后的返回
      //       if (json.responseCode === "1100720002"||json.responseCode === "1000100111"||json.responseCode === "1000100112"||json.responseCode === "1000100113"|| json.responseCode === "1000100101") {
      //         err.loginFail = true;
      //       }
      //       throw err;
      //     } else {
      //       let responseData = processResponseParams(json);
      //       return responseData;
      //     }
      //   });
      return response.json();
    } else {
      return new Promise(function (resolve, reject) {
        reject(response);
      });
    }
  }
});

// 一账通后台
// export const YZFNetwork = new Network();


// shop
export const SHOPNetwork = new Network({
  host: "/jkkit-gp/service",
  processBody: CFprocessBody,
  processResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      return new Promise(function (resolve, reject) {
        reject(response);
      });
    }
  }
});

