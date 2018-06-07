import axios from 'axios';
const defaultTimeout = 60000;

const EnhanceAxios = (options) => {
  const { beforeSend, baseURL } = options

  const instance = axios.create({
    baseURL: baseURL || '/',
    timeout: defaultTimeout,
    responseType: 'json',
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })

  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
    beforeSend && beforeSend();
    return config
  }, function (error) {
    return Promise.reject(error);
  });

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
    //超时error.code  ECONNABORTED
    return Promise.reject(error);
  });

  return instance
}


export default EnhanceAxios
