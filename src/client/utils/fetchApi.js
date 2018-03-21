import promise from 'es6-promise'
import { CFNetwork,MyNetwork } from "noAnyDoor/index";

promise.polyfill();

//深拷贝
const deepCopy = (obj,target) => {
    for (var key in target) {
        if(target.hasOwnProperty(key)){
            if (typeof target[key]==='object') {
                obj[key] = deepCopy(target[key]);
            }else{
                obj[key] = target[key];
            }
        }
    }
    return obj;
};

const fetchApi = (options,dispatch) => {
    window.H5App.showLoading();

    let {url, data, success, error} = options;
    let _extends = Object.assign || deepCopy;
    let optionsData = _extends({}, publicParams, data);
    let deleteArr = ['deviceId', 'deviceID', 'deviceType', 'osVersion', 'sdkVersion',
        'appId', 'appVersion', 'pluginId'
    ];

    for (let i = 0; i < deleteArr.length; i++) {
        delete optionsData[deleteArr[i]];
    }

    let params = _extends({}, optionsData, {
        method: url
    });
    console.log('params', params);
    // console.log('现在请求的接口是：', params.method);
    // console.log('请求参数是：', params);
    return new Promise((resolve, reject) => {

        return MyNetwork.post(serverUrl, params).then(
            data => {
                window.H5App.hideLoading();
                if (data.responseCode !== "000000") {
                    //1000100101 增加这个网关报研签失败的错误状态，避免业务逻辑登录后没有拿到token，需要重新获取
                    //1100720002 是和行方校验token失败后的返回
                    if (data.responseCode === "1100720002") {
                        window.H5App.callLogin();
                    } else {
                        reject(data);
                    }
                } else {
                    console.log(url, data);
                    success && success(data);
                    resolve(data);
                }
            }
        ).catch(reject);
    }).catch(err => {
        window.H5App.hideLoading();
        dispatch && window.H5App.showToast(err.responseMessage||'系统异常,请稍后再试');
        error && error(err);
        return Promise.reject(err);
    })
};

export default fetchApi;
