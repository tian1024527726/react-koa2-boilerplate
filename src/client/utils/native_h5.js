/**
 * Native H5 交互JS。
 * @since 2016-5-23
 */

;(function(window,undefined){
    function newApp() {
        var App = {
              callbacks: {}
          },
          slice = Array.prototype.slice;
        /**
         * 常量定义
         */
        var ua = navigator.userAgent.toUpperCase();
        // 当前环境是否为Android平台
        App.IS_ANDROID = ua.indexOf('ANDROID') != -1;
        // 当前环境是否为IOS平台
        App.IS_IOS = ua.indexOf('IPHONE OS') != -1;
        // 当前环境是否为WP平台
        App.IS_WP = ua.indexOf('WINDOWS') != -1 && ua.indexOf('PHONE') != -1;

        App.IS_YZT = /One Account (IOS|Android)/ig.test(ua);

        App.callbacks.__leftAction__ = function() {
            var haveLeftAction = typeof App.callbacks.leftAction === 'function',
              args = slice.call(arguments);
            if(haveLeftAction) {
                setTimeout(function() {
                    App.callbacks.leftAction.apply(App.callbacks, args);
                },0);
                if(App.IS_ANDROID) {
                    App.call(['called']);
                } else if(App.IS_IOS) {
                    return true;
                }
            }
        };


        //=======================Native 相关================================

        var callindex = 0,
          isFunc = function(name) { return typeof name === 'function';},
          isObj = function(name) { return typeof name === 'object';};
        /**
         * 调用一个Native方法
         * @param {String} name 方法名称
         */
        App.call = function(name) {
            // 获取传递给Native方法的参数
            var args = slice.call(arguments, 1);
            var successCallback = '' , errorCallback = '' , item = null ,returnArg;
            var methodName = name[name.length-1];
            if (App.IS_YZT) {


                if(App.IS_ANDROID) {
                    if(window.HostApp){
                        var newArguments = [];
                        for(var i=0;i<args.length;i++){
                            if(isFunc(args[i])){
                                var callbackName = methodName+'Callback'+callindex ;
                                window[callbackName] = args[i] ;
                                newArguments.push(callbackName);
                                callindex++ ;
                            }else if(isObj(args[i])){
                                newArguments.push( JSON.stringify( args[i] ) ) ;
                            }else{
                                newArguments.push(args[i]) ;
                            }
                        }

                        // 之所以要重新调用，是因为Android 初始化HostApp可能晚于JS调用。
                        try{
                            HostApp[methodName].apply(window.HostApp,newArguments);
                        }catch(e){
                            // TODO 这里应该走Mock functions
                            var params = slice.call(arguments, 0);
                            setTimeout(function(){
                                App['call'].apply(window.App,params);
                            },300);
                        }
                    }else{
                        var params = slice.call(arguments, 0);
                        setTimeout(function(){
                            App['call'].apply(window.App,params);
                        },1000);
                    }

                } else if(App.IS_IOS) {
                    var tempArgument = [];
                    for(var i=0;i<args.length;i++ ){
                        if(isFunc(args[i])){
                            var callbackName = methodName+'Callback'+callindex ;
                            window[callbackName] = args[i] ;
                            tempArgument.push(callbackName);
                            callindex++ ;
                        }else{
                            args[i] && tempArgument.push(args[i]);
                        }

                    }
                    callindex++;
                    var iframe = document.createElement('iframe');
                    var _src = 'callnative://'+methodName+'/'+ (tempArgument && tempArgument.length ? encodeURIComponent(JSON.stringify(tempArgument)) + '/' + callindex : '');
                    console.log(_src);
                    iframe.src = _src;
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                    iframe.parentNode.removeChild(iframe);
                    iframe= null;
                } else {
                    // WP 用户不支持。 Mock functions, 模拟H5 容器
                    console.warn('Tips: No available environment WP');
                    // Mock functions, 模拟H5 容器
                    for (var i =0; i < args.length; i++) {
                        if(isFunc(args[i])) {
                            args[i]({});
                            return;
                        }
                    }
                }

            } else {
                console.warn('Tips: No available environment, NO YZT');
                // Mock functions, 模拟H5 容器
                for (var i =0; i < args.length; i++) {
                    if(isFunc(args[i])) {
                        args[i]({});
                        return;
                    }
                }
            }
        }

        return App;
    }

    function oldApp() {
        var callIndex = 0,
          isIOSNative = navigator.userAgent.indexOf("One Account IOS") > -1,
          isAndroidNative = navigator.userAgent.indexOf("One Account Android") > -1,
          App = {};
        App.isIOS = isIOSNative;
        App.isAndroid = isAndroidNative;
        App.isNative = isIOSNative || isAndroidNative;
        App.isHighVersion =  window.isChangeSkin ? 'true' !== window.isChangeSkin : false;
        App.nativeCallbacks = {};
        App.call = (function() {
            function processArguments(methodName) {
                var args = Array.prototype.slice.call(arguments, 1),
                  callback = '',
                  item = null;
                //遍历
                for (var i = 0, len = args.length; i < len; i++) {
                    item = args[i];
                    if (typeof item === "undefined") {
                        item = '';
                    } else if (typeof(item) == 'function') {
                        // 如果参数是一个Function类型, 则将Function存储到window对象, 并将函数名传递给Native
                        callback = methodName + '_Callback' + (callIndex++);
                        window[callback] = item;
                        item = callback;
                    } else if (typeof item === 'object') {
                        item = JSON.stringify(item);
                    }
                    args[i] = encodeURI(item);
                }
                return args;
            }
            var call;
            if (isIOSNative) {
                call = function call(methodName) {
                    var args = processArguments.apply(this, arguments);
                    if (args.length) {
                        args = '/' + args.join('||');
                    } else {
                        args = '/';
                    }
                    // IOS通过location.href调用Native方法, _call变量存储一个随机数确保每次调用时URL不一致
                    ++callIndex;
                    var iframe = document.createElement("iframe");
                    iframe.style.display = 'none';
                    if (/paone:\/\//ig.test(methodName)) {
                        iframe.src = methodName + args + '||' + callIndex;
                    } else {
                        iframe.src = 'native://' + methodName + args + '||' + callIndex;
                    }
                     console.log(iframe.src);
                    document.body.appendChild(iframe);
                    document.body.removeChild(iframe);
                    iframe = null;
                }
            } else if (isAndroidNative) {
                call = function call(methodName) {
                    var args = processArguments.apply(this, arguments);
                    try {
                        for (var i = 0, len = args.length; i < len; i++) {
                           args[i] = '\'' + args[i] + '\'';
                        }
                        eval('window.android.' + methodName + '(' + args.join(',') + ')');
                        // TODO
                        // NPMethod called on non-NPObject
                        // var fn = function() {
                        //     return window.android[methodName] && window.android[methodName]();
                        // };
                        // window[args[0]] && window[args[0]](fn());
                    } catch (e) {
                        console.log(e);
                    }
                }
            } else {
                call = function() {};
            }
            return call;
        }());
        return App;
    }




    window.App = newApp();
    window.App.oldVersion = oldApp();

}(window));


(function(WIN, undefined) {
    var nativeCallback = {};
    var App = WIN.App;
    var SUCCESS = 'success', ERROR = 'error';
    var TRUE_STR = 'true', FALSE_STR = 'false';
    var YztApp = function () {
        var agentMatch, appVerison;
        agentMatch = window.navigator.userAgent.match(/Toa\/(.+?)(;| )/);
        appVerison = agentMatch ? agentMatch[1] : '';

        this.isIOS = App.IS_IOS;
        this.isAndroid = App.IS_ANDROID;
        this.isYztApp = App.IS_YZT;

        this._menus = [];
        this._setShareData();
        this._setShareIsAvailable(true);

        this.isOldVersion = (appVerison && appVerison < '4.2.0');


        // JS回退功能可能会引起跳转到其他页面的时候无法回退,解决方案:
        fixBackIssue(this.isIOS);
    };

    /**
     *  Iphone / IPad 端webview或者浏览器不支持onbeforunload , 改用onpagehide
     */
    function fixBackIssue(isIOS) {
        // 刷新的时候也会触发此函数, 应该不会有问题。(onunload 测试时可能会不执行,
        // 但是 onbeforeunload 几乎每次有执行. 另外hash值改变时也不会执行。
        var handler,
            actionHandler;
        if (isIOS) {
            handler = WIN.onpagehide;
            actionHandler = function () {
                WIN.YztApp && WIN.YztApp.configureGoBack(false); // 关闭JS控制回退功能
            }
        } else {
            handler = WIN.onbeforeunload;
            actionHandler = function () {
                delayThred(function () {
                    WIN.YztApp && WIN.YztApp.configureGoBack(false)
                });
            };
        }

        if (!handler) {
            handler = actionHandler;
        } else {
            handler = function () {
                handler.call(WIN);
                actionHandler();
            }
        }

        isIOS ? (WIN.onpagehide = handler) : (WIN.onbeforeunload = handler);
    }

    function getType(obj) {
        return Object.prototype.toString.call(obj);
    }

    function formatJSON(data) {
        if (typeof data === 'string') {
            return JSON.parse(data);
        } else {
            return data;
        }
    }

    function delayThred(func, time) {
        setTimeout(function() {
            func && func();
        }, time || 0)
    }

    YztApp.prototype = {
        constructor: YztApp,
        /**
         * shareData
         * isShare
         * successFn
         * errorFn
         var shareData = {
            'title":"分享活动",
            "content":"分享内容",
            "href":"http://test-events.pingan.com.cn:41080/h5/yaoyiyao/index.html",
            "imgUrl":"http://test-events.pingan.com.cn:41080/h5/yaoyiyao/images/p.png",
            'successCallback':'shareSuccessCallback',
            'failCallback':'shareFailCallback'
        };
            @changelog App 5.3 新增是否需要登录的配置
         */
        configureShare: function(shareData, isShare, successFn, errorFn, isNeedLogin) {
            shareData = shareData || {};
            shareData.successCallback = 'yztShareSuccessFn';
            shareData.failCallback = 'yztShareFailFn';

            nativeCallback[shareData.successCallback] = function (data) {
                delayThred(function () {
                    successFn && successFn(data);
                });
            };

            nativeCallback[shareData.failCallback] = function (data) {
                delayThred(function () {
                    errorFn && errorFn(data);
                });
            };

            this._setShareIsAvailable(isShare, isNeedLogin);
            this._setShareData(shareData);
        },
        /**
         * 设置分享内容
         * @param data
         * @private
         * @changelog  2015.10.12 修改, 修复分享时重复stringify 分享数据的问题。
         */
        _setShareData: function (data) {
            /**
             * Native 获取分享数据
             * @returns {string}
             */
            nativeCallback.getShareData = function() {
                data = typeof data === 'object' ? JSON.stringify(data) : data;
                if(this.isIOS){
                    return data;
                }else if(this.isAndroid){
                    delayThred(function () {
                        App.call(['onGetShareData'], data);
                    });
                }
            }.bind(this);
        },

        /**
         * 设置更多功能菜单中各子功能显示状态
         * @private
         *
         * @changelog V5.3 设置右上角功能不需要Android触发, 由JS主动传递参数给Android
         */
        _setMenuActions: function() {
            var menus = this._menus.length ? this._menus : [];


            if (this.isAndroid) {
                delayThred(function () {
                    App.call(['onGetMenuVariableActions'],JSON.stringify(menus));
                });
            }

            nativeCallback.getMenuVariableActions = function () {
                if(this.isIOS){
                    return JSON.stringify(menus);
                }else if(this.isAndroid){
                    delayThred(function () {
                        App.call(['onGetMenuVariableActions'],JSON.stringify(menus));
                    });
                }
            }.bind(this);
        },

        /**
         * 设置是否可以分享
         * @param isShare
         * @private
         * @changelog App V5.3 增加是否需要登录功能配置,默认不需要登录
         */
        _setShareIsAvailable: function (isShare, isNeedLogin) {
            this._setMenuActionConfig('share', isShare, isNeedLogin);
        },

        /**
         *  设置功能配置列表
         * @param feature
         * @param isAvailable
         * @param isNeedLogin
         * @private
         */
        _setMenuActionConfig: function(feature, isAvailable, isNeedLogin) {
            isAvailable = isAvailable ? TRUE_STR : FALSE_STR;
            isNeedLogin = isNeedLogin ? TRUE_STR : FALSE_STR;
            if (this._menus.length) {
                this._menus.forEach(function(t) {
                    if (t.feature === feature) {
                        t.enable = isAvailable;
                        t.isNeedLogin = isNeedLogin;
                    }
                });
            } else {
                this._menus.push({
                    'feature': feature,
                    'enable': isAvailable,
                    'isNeedLogin': isNeedLogin
                });
            }

            this._setMenuActions();
        },

        /**
         * 分享到 某一个平台
         * @param type
         */
        callShareToFunc: function(type, shareData) {
            App.call(['shareTo'], {shareType: type || '0'});
            shareData && this._setShareData(shareData);
        },

        /**
         * 弹出分享浮层
         * @param type
         */
        callShareAllFunc: function(shareData) {
            App.call(['shareAll'], function (a) {
                console.log(a);
            }, function (b) {
                console.log(b);
            }, {});
            shareData && this._setShareData(shareData);
        },

        /**
         * 进入Native 页面
         * @param url
         * @param func
         * @param isClearPath， 是否清理中间的路径，使回退直接回退到H5
         */
        accessNativeModule: function(url, func, isClearPath) {
            App.call(['openURL'], function (data) {
                func && func(data ? SUCCESS : ERROR, data);
            }, function (error) {
                func && func(ERROR, error);
            }, {url: url, isClearPath: isClearPath ? true : false});
        },

        /**
         * 获取用户登录态
         */
        getLoginStatus: function(callback) {
            App.call(['checkLoginStatus'], function(data) {
                callback && callback(SUCCESS, formatJSON(data));
            }, function(err) {
                //do nothing
                callback && callback(ERROR, err);
            }, {});
        },

        /**
         *  获取设备信息， 版本号， clientNo 等
         */
        getDeviceInfo: function(callback) {
            App.call(['sendMessage'],function(data){
                callback && callback(SUCCESS, formatJSON(data));
            },function(error){
                callback && callback(ERROR, error);
            },['getDeviceInfo']);
        },

        /**
         * 获取请求GP的公共参数
         */
        getGPParams: function (callback) {
            App.call(['getPublicParameters'], function(data){
                callback && callback(SUCCESS, formatJSON(data));
            }, function(err) {
                callback && callback(ERROR, err);
            },{});
        },

        /**
         * 设置title
         * @param title
         */
        setTitle: function (title) {

            App.call(['setNavTitle'], {title: title || ''});

            document && (document.title = title);
        },

        /**
         * 获取SSO信息
         * @param callback
         */
        getSSOTicket: function(callback) {
            App.call(['sendMessage'], function(data) {
                callback && callback(SUCCESS, formatJSON(data));
            }, function(err) {
                callback && callback(ERROR, err);
            }, ['getSSOTicket']);
        },

        /**
         * 获取用户五项信息， 加密后的
         */
        getNativeInfo: function(callback) {
            if (this.isOldVersion) {
                App.oldVersion.call('getNativeInfo', function(data) {
                    callback && callback(formatJSON(data));
                });
            } else {
                App.call(['getNativeInfo'], function(data){

                    callback && callback(formatJSON(data));
                }, function(data) {
                    callback && callback(data);
                }, {});
            }

        },

        /**
         * 显示或者隐藏导航栏
         */
        showOrHideNav: function(isShow) {
            App.call(['showNavigationBar'],null, null, {'show': isShow ? true : false});
        },

        /**
         * 是否显示navigationBar右端的更多按钮
         */
        showOrHideNavMoreBtn: function(isShow) {
            App.call(['showRightBarButtonItem'], null, null,{'show': isShow? true : false});
        },

        /**
         * 埋点
         * @param eventId
         * @param label
         * @param params
         */
        ubt: function (eventId, label, params) {
            App.call(['talkingData'], null, null, {
                eventId: eventId || '',
                label: label || '',
                params: params || {}
            });
        },

        /**
         * 显示加载中
         */
        showLoading: function() {
            App.call(["showProgress"], "", "", {});
        },

        /**
         *  隐藏加载中
         */
        hideLoading: function() {
            App.call(["hideProgress"], "", "", {});
        },

        /**
         * 显示提示信息
         * @param msg
         */
        showToast: function (msg) {
            App.call(['showSuccessMsg'], null, null,{'message': msg || ''});
        },

        /**
         * 只有IOS才有手势右滑关闭Webview功能，此方法用于部分广告页面
         * @since 2016.6.15
         */
        disableSwipeBack: function() {
            if (this.isIOS) {
                App.oldVersion.call('paone://leftSlipBackDisabled');
            }
        },

        /**
         *  调起Native 登陆
         */
        callLogin: function () {
            if (this.isOldVersion) {
                App.call(['goToLogin'], null, null, null);
            } else {
                this.accessNativeModule('patoa://pingan.com/login', null, false);
            }
        },

        /**
         * TODO: 待废弃方法
         *
         * 用户实名认证
         */
        updateUserIndentify: function () {
            App.call(['setUserIndentity'], null, null, null);
        },

        /**
        * 重置密码
        */
        resetPassword: function () {
            App.call(['resetLoginPassword'], null, null, null);
        },

        // version 4.3 新增方法

        /**
        * 配置页面回退相关功能
        */
        configureGoBack: function (flag, func) {
            App.call(['isNeedJSBack'], null, null, {status: flag ? TRUE_STR : FALSE_STR});

            var newFunc = function() {
                window.history.back();
            };
            if(func) {
                newFunc = function() {
                    delayThred(func);
                }
            }

            // 如果开启了JS控制回退; 但没有设置回退方法, 则默认走history.back();
            // 如果关闭JS回退, 默认goBackAction 默认置为history.back();
            App.goBackAction = newFunc;
        },

        /**
        *  配置是否需要显示关闭按钮。 (位于回退按钮旁边)
        */
        showOrHideCloseBtn: function (flag) {
            App.call(['closeBtnControl'], null, null, {status: flag ? TRUE_STR : FALSE_STR});
        },

        /**
         * 设置webview 背景颜色(IOS 实现)
         */
        setWebviewBg: function (color) {
            var bg = '';
            if (color) {
                bg = color.split('#');
                if (bg && bg.length > 1) {
                    color =  bg[1];
                }
                App.call(['setBackgroundColor'], null, null, {backgroundColor: color});
            }
        },

        /**
         * 获取AccessTicket
         */
        getAccessTicket: function (callback) {
            App.call(['getAccessTicket'], function (data) {
                callback && callback(SUCCESS, formatJSON(data));
            }, function (err) {
                callback && callback(ERROR, formatJSON(err));
            }, {});
        },

        //v4.4 新增方法

        /**
         * 关闭Webview, 并触发刷新通知,刷新其他页面??
         */
        closeWebAndRefresh: function () {
            App.call(['closeWebAndRefresh'], null, null, {needRefresh: true});
        },

        /**
         * 关闭IOS 边界回弹效果 (橡皮筋)
         */
        setWebviewBounce: function (flag) {
            if (flag !== false) {
                flag = true;
            }
            this.isIOS && App.call(['setWebViewBounce'], null, null, {enableBounce: flag});
        },

        // 5.0 新增方法

        /**
         * 设置右上角按钮列表
         * @param arr
         *
         * 对象中必传参数：
         *   (键)@“name”: (值)图片的名字;
         *   (键)@“isImage”: (值)@0/@1,分别代表按钮显示为：文字/图片;
         *   (键)@“url”:(值)点击按钮跳转的链接

             埋点参数（可选）：
             @"eventId":
             @"label":
             @"params":
         */
        configureRightBtns: function (arr) {
            App.call(['setRightButtons'], null, null, {rightButtonsArray: arr});
        },

        /**
         * 获取用户昵称
         * @param callback
         */
        getUserNickname: function (callback) {
            App.call(['getUserNickname'], function (data) {
                callback && callback(SUCCESS, formatJSON(data));
            }, function (err) {
                callback && callback(ERROR, formatJSON(err));
            }, {});
        },


        // 5.2 新增方法

        /**
         *  获取单个联系人
         * @param callback
         *
         * {
            "contactName":"李四",
            "phoneNum":"15921312222"
            }
         */
        selectContact: function (callback) {
            App.call(['getSingleContact'], function(data) {
                callback && callback(SUCCESS, formatJSON(data));
            }, function(err) {
                callback && callback(ERROR, formatJSON(err));
            }, {});
        },


        getUserCardInfo: function (callback) {
            App.call(['getIdCardInfo'], function(data){
                callback && callback(SUCCESS, formatJSON(data));
            }, function (err) {
                callback && callback(SUCCESS, formatJSON(err));
            }, {});
        },

        //5.3 新增 设置导航栏颜色
        /**
         *
         * @param style=为字符串时表示背景色, 为对象时表示整个style对象
         * @param alpha  可选
         */
        setNavStyle: function (style, alpha) {
            var type = getType(style);
            if (type === '[object String]') {
                App.call(['setNavStyle'], null, null, {bgColor: style, alpha: alpha || 1});
            } else if (type === '[object Object]') {
                App.call(['setNavStyle'], null, null, style);
            } else {
                console.warn('颜色未定义');
            }
        }

    };


    WIN.YztApp = new YztApp();

    WIN.nativeCallback = nativeCallback;
})(window);


if (typeof(module) !== 'undefined'){
        module.exports = window.YztApp;
    }
// window.module && (module.exports = window.YztApp);
