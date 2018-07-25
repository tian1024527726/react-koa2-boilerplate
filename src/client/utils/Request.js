import EnhanceAxios from './enhanceAxios';
import { showNativeLoading, requestSuccess, requestError } from './index.js';
import { longLogin } from './longLogin';
const Axios = EnhanceAxios({ baseURL: '', beforeSend: showNativeLoading });
const MockAxios = EnhanceAxios({ beforeSend: () => { console.log('将要发送请求') } })

export const Request = (options, dispatch) => {
  let { api, data, success, error, context, hideLoading } = options;
  /**
   * 请求mock数据的方式
   */
  if (__MOCK__) {
    return MockAxios
      .get(`/mock/${operationType}.json`)
      .then(res => { success && success(res.result); })
      .catch(err => Promise.reject(err));
  }

  let requestFun = () => false;
  if (!hideLoading) {
    requestFun = requestHandler.subscribe(operationType, +new Date())
  }
  let requestData = JSON.stringify([{}, data])

  return longLogin(true)
    .then(() => {
      return Axios
        .post('toa-mgw/rest/webgateway', `operationType=${operationType}&requestData=${requestData}`)
        .then(res => {
          requestFun();
          if (res.resultStatus == '1000') {
            requestSuccess(res);
            success && success(res.result);
          } else {
            return Promise.reject(res)
          }
        })
        .catch(err => {
          requestFun();
          requestError(operationType, err, context);
          error && error(err);
          return Promise.reject(err);
        })
    })
    .catch(()=>{})
}



