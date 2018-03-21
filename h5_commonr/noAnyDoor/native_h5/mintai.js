//notation: js file can only use this kind of comments
//since comments will cause error when use in webview.loadurl,
//comments will be remove by java use regexp

let isDev = env.PA_ENV === "dev" || env.PA_ENV === "stg";

(function () {
  if (window.WebViewJavascriptBridge) {
    return;
  }
  var ua = navigator.userAgent.toLowerCase(),
    isiOS = ua.match(/(iphone|ipod|ipad);?/i),
    isAndroid = ua.match('android');
  if (isAndroid) {
    var messagingIframe;
    var sendMessageQueue = [];
    var receiveMessageQueue = [];
    var messageHandlers = {};

    var CUSTOM_PROTOCOL_SCHEME = 'wvjbscheme';
    var QUEUE_HAS_MESSAGE = '__BRIDGE_LOADED__/';

    var responseCallbacks = {};
    var uniqueId = 1;

    function _createQueueReadyIframe(doc) {
      messagingIframe = doc.createElement('iframe');
      messagingIframe.style.display = 'none';
      doc.documentElement.appendChild(messagingIframe);
    }

    //set default messageHandler
    function init(messageHandler) {
      if (WebViewJavascriptBridge._messageHandler) {
        throw new Error('WebViewJavascriptBridge.init called twice');
      }
      WebViewJavascriptBridge._messageHandler = messageHandler;
      var receivedMessages = receiveMessageQueue;
      receiveMessageQueue = null;
      for (var i = 0; i < receivedMessages.length; i++) {
        _dispatchMessageFromNative(receivedMessages[i]);
      }
    }

    function send(data, responseCallback) {
      _doSend({
        data: data
      }, responseCallback);
    }

    function registerHandler(handlerName, handler) {
      messageHandlers[handlerName] = handler;
    }

    function callHandler(handlerName, data, responseCallback) {
      _doSend({
        handlerName: handlerName,
        data: data
      }, responseCallback);
    }

    //sendMessage add message, 触发native处理 sendMessage
    function _doSend(message, responseCallback) {
      if (responseCallback) {
        var callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
        responseCallbacks[callbackId] = responseCallback;
        message.callbackId = callbackId;
      }

      sendMessageQueue.push(message);
      messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
    }

    // 提供给native调用,该函数作用:获取sendMessageQueue返回给native,由于android不能直接获取返回的内容,所以使用url shouldOverrideUrlLoading 的方式返回内容
    function _fetchQueue() {
      var messageQueueString = JSON.stringify(sendMessageQueue);
      sendMessageQueue = [];
      //android can't read directly the return data, so we can reload iframe src to communicate with java
      messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString);
    }

    //提供给native使用,
    function _dispatchMessageFromNative(messageJSON) {
      setTimeout(function () {
        var message = JSON.parse(messageJSON);
        var responseCallback;
        //java call finished, now need to call js callback function
        if (message.responseId) {
          responseCallback = responseCallbacks[message.responseId];
          if (!responseCallback) {
            return;
          }
          responseCallback(JSON.parse(message.responseData));
          delete responseCallbacks[message.responseId];
        } else {
          //直接发送
          if (message.callbackId) {
            var callbackResponseId = message.callbackId;
            responseCallback = function (responseData) {
              _doSend({
                responseId: callbackResponseId,
                responseData: responseData
              });
            };
          }

          var handler = WebViewJavascriptBridge._messageHandler;
          if (message.handlerName) {
            handler = messageHandlers[message.handlerName];
          }
          //查找指定handler
          try {
            handler(message.data, responseCallback);
          } catch (exception) {
            if (typeof console != 'undefined') {
              console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
            }
          }
        }
      });
    }

    //提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
    function _handleMessageFromNative(messageJSON) {
      console.log(messageJSON);
      if (receiveMessageQueue && receiveMessageQueue.length > 0) {
        receiveMessageQueue.push(messageJSON);
      } else {
        _dispatchMessageFromNative(messageJSON);
      }
    }

    var WebViewJavascriptBridge = window.WebViewJavascriptBridge = {
      init: init,
      send: send,
      registerHandler: registerHandler,
      callHandler: callHandler,
      _fetchQueue: _fetchQueue,
      _handleMessageFromNative: _handleMessageFromNative
    };

    var doc = document;
    _createQueueReadyIframe(doc);
    var readyEvent = doc.createEvent('Events');
    readyEvent.initEvent('WebViewJavascriptBridgeReady');
    readyEvent.bridge = WebViewJavascriptBridge;
    doc.dispatchEvent(readyEvent);

  };

})();


// 定义WebViewJavascriptBridge的脚本是Android和IOS自动注入的
function setupWebViewJavascriptBridge(callback) {
  var ua = navigator.userAgent.toLowerCase(),
    isiOS = ua.match(/(iphone|ipod|ipad);?/i),
    isAndroid = ua.match('android');
  if (isAndroid) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener(
        'WebViewJavascriptBridgeReady',
        function () {
          callback(WebViewJavascriptBridge)
        },
        false
      );
    }
  } else if (isiOS) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }
}

if (!isDev) {
  setupWebViewJavascriptBridge(function (bridge) {
    bridge.registerHandler('testJavascriptHandler', function (data, responseCallback) {
      alert('JS方法被调用:' + data);
      responseCallback('js执行过了');
    })
  })
}

// callback入参统一规定两个参数
// 第一个参数是否失败，失败1，成功0，也可以返回其他非0的参数表示失败
// 若成功，第二个参数表示业务数据
// 若失败，第二个参数表示错误描述信息(string)

/**
 * 获取行方登录态以及行方特有信息
 * callback入参
 *     - ssoTicket
 *     - publicKey
 */

function tryToGetNative(dealFun) {
  try {
    dealFun()
  } catch (e) {
    console.error(e)
  }
}

export function getToken(callback) {

  tryToGetNative(() => WebViewJavascriptBridge.callHandler('getSSOTicket', null, callback))

}

/**
 * 打开登录页面
 * @param  {object}   options
 *     options.url  string  登陆后回调的页面，不传则回到原来的页面
 * callback入参 ？？
 */
export function openAppPageLogin(options, callback) {
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('openAppPage', {
    ...options,
    style: 'login'
  }, callback));
}

/**
 * 打开开户页面
 * callback入参 ？？
 */
export function openAppPageAccount(callback) {
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('openAppPage', {
    style: 'account'
  }, callback));
}

/**
 * 打开绑卡页面
 * callback入参 ？？
 */
export function openAppPageTurnBindCard(callback) {
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('openAppPage', {
    style: 'turnBindCard'
  }, callback));
}

/**
 * 刷新登录态
 * callback入参 ？？
 */
export function refreshSession(callback) {
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('refreshSession', null, callback));
}

/**
 * 打开安全键盘
 * 注：键盘上有输入框，输入完后需要执行回调
 * options.title  string  标题名称
 * callback入参 ？？
 *     须返回加密后的密码
 */
export function openSafeKeyboard(options, callback) {
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('openSafeKeyboard', options, callback));
}

/**
 * 隐藏返回按钮？
 * callback入参 ？？
 */
export function hideGoback(callback) {
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('hideGoback', null, callback));
}

/**
 * 关闭当前页
 * callback入参 ？？
 */
export function closeWebView(callback) {
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('close', null, callback));
}

/**
 * 设置标题
 * @param  {object}   options
 *     options.title  string  标题名称
 * callback入参 ？？
 */
export function setTitle(options, callback) { //参数title：标题
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('setTitle', options, callback));
}

/**
 * 设置返回
 * @param  {object}
 *   {type: goBack | close | hide}   返回|关闭|隐藏按钮
 * callback入参 {object}
 */
export function setBack(options, callback) {
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('setBack', options, callback));
}

/**
 * 设置关闭
 * @param  {object}   options
 *     {type:  close | hide}    string  显示|关闭按钮
 * callback入参 {object}
 */
export function setClose(options, callback) { //参数title：标题
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('setClose', options, callback));
}

/**
 * 设置缓存
 * @param  {object}   key       缓存key
 * @param  {object}   value     缓存value
 * callback入参 {object}
 */
export function setData(key, value, callback) { //获取登录标识 YES 登录    NO未登录
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('setData', {
    key,
    value: value
  }, callback));
}

/**
 * 获取缓存
 * @param  {object}   key       缓存key
 * callback入参 {
    status:0|1
    data:{
        value:{XXXX}入参，建议存成JSON的数据格式
    }
 }
 *     需要返回缓存的数据
 */
export function getData(key, callback) { //识别首次授权标识 YES 首次    NO不是首次
  tryToGetNative(() => WebViewJavascriptBridge.callHandler('getData', {
    key
  }, callback));
}
