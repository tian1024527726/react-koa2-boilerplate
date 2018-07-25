import { refreshSessionId } from './index.js';
const refreshSessionTime = 10 * 60 * 1000;
let shouldRefreshSession = false;
let sessionTimer = null;

const timeOutFun = () => {
  sessionTimer = setTimeout(() => {
    let shouldRefreshSession = true;
  }, refreshSessionTime)
}
timeOutFun();

/*维持长登录*/
export const longLogin = (sending) => {
  if(sending){
    clearTimeout(sessionTimer);
    timeOutFun();
  }
  if(shouldRefreshSession){
    let shouldRefreshSession = false;
    return refreshSessionId();
  }else{
    return Promise.resolve()
  }
}
