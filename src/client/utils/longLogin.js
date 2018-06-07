/*用于维持长登录,当15分钟不调用接口,gp维护的sessionId会过期,
所以当用户10分钟不调用接口,再次调用接口时会先调用下mamcLogin接口,刷新sessionId同步会话*/
import { refreshSessionId, RefreshOAuthSSoTicket } from './index.js';
const refreshSessionTime = 10 * 60 * 1000;
window.shouldRefreshSession = false;
window.shouldRefreshSsoticket = true;
let sessionTimer = null;
let ssoticketTimer = null;

const timeOutFun = () => {
  sessionTimer = setTimeout(() => {
    window.shouldRefreshSession = true;
  }, refreshSessionTime)
}
timeOutFun();

const ssoticketOutFun = () => {
  sessionTimer = setTimeout(() => {
    window.shouldRefreshSsoticket = true;
  }, refreshSessionTime)
}
ssoticketOutFun();
/*维持gp长登录*/
export const longLogin = (sending) => {
  if(sending){
    clearTimeout(sessionTimer);
    timeOutFun();
  }
  if(window.shouldRefreshSession){
    window.shouldRefreshSession = false;
    return refreshSessionId();
  }else{
    return Promise.resolve()
  }
}
/*维持网关长登录*/
export const noAnyDoorLongLogin = (sending) => {
  if(sending){
    clearTimeout(ssoticketTimer);
    ssoticketOutFun();
  }
  if(window.shouldRefreshSsoticket){
    window.shouldRefreshSsoticket = false;
    return RefreshOAuthSSoTicket();
  }else{
    return Promise.resolve()
  }
}
