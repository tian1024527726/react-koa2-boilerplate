/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoute = exports.Get = exports.Post = exports.Controller = undefined;

var _koaRouter = __webpack_require__(19);

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaBody = __webpack_require__(20);

var _koaBody2 = _interopRequireDefault(_koaBody);

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Marking a class as a controller.
* Will inject logger and helpers to its instances
* param baseRoute: Prefix of koa router
**/
const Controller = exports.Controller = baseRoute => {
  return clz => {
    clz._deacon_ = _lodash2.default.merge(clz._deacon_, {
      prefix: baseRoute
    });
  };
};

/**
* Marking a function as a Post action for router.
* [route]: route path for this action
* [params]: inject fields from ctx.request.body as args
**/
const Post = exports.Post = opts => {
  return (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new SyntaxError('@Post can only mark methods of controller, not:' + descriptor.value);
    }

    mergeRouteDefinition(target, opts, descriptor.value, 'post');
  };
};

/**
* Marking a function as a Get action for router.
* [route]: route path for this action
* [params]: inject fields from ctx.request.body as args
**/
const Get = exports.Get = opts => {
  return (target, key, descriptor) => {
    if (typeof descriptor.value !== 'function') {
      throw new SyntaxError('@Get can only mark methods of controller, not:' + descriptor.value);
    }

    mergeRouteDefinition(target, opts, descriptor.value, 'get');
  };
};

const mergeRouteDefinition = (target, opts, handler, verb) => {
  if (_lodash2.default.isString(opts)) {
    opts = { route: opts };
  } else if (!_lodash2.default.isPlainObject(opts)) {
    throw new SyntaxError('Router handler must be defined in @Controller' + handler);
  }
  // TODO validate target, before and after.
  let clz = target.constructor;
  let routes = _lodash2.default.get(clz, '_deacon_.routes', []);
  routes.push({
    verb: verb,
    path: opts.route,
    useBody: _lodash2.default.defaultTo(opts.useBody, true),
    before: opts.before,
    handler: handler,
    after: opts.after
  });
  clz._deacon_ = _lodash2.default.merge(clz._deacon_, {
    routes: routes
  });
};

const createRoute = exports.createRoute = opts => {
  // TODO validate opts
  let RouteController = opts.controller;
  let _deacon_ = _lodash2.default.get(RouteController, '_deacon_');
  let instance = new RouteController();
  let router = new _koaRouter2.default({ prefix: _deacon_.prefix });

  _deacon_.routes.forEach(route => {
    let handlers = [];
    route.before && handlers.push(...route.before);
    route.useBody && handlers.push((0, _koaBody2.default)(route.bodyOpts));
    handlers.push(route.handler.bind(instance));
    route.after && handlers.push(...route.after);
    router[route.verb](route.path, ...handlers);
  });

  return router;
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("log4js");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deacon = __webpack_require__(0);

var _user = __webpack_require__(21);

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userRoute = (0, _deacon.createRoute)({
  controller: _user2.default
});

exports.default = userRoute;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _log4js = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const setNativeProperty = (target, key, value) => {
  Object.defineProperty(target, key, {
    value: value,
    enumerable: false,
    configurable: true,
    writable: false
  });
};

let BaseController = class BaseController {
  constructor(name) {
    setNativeProperty(this, 'logger', (0, _log4js.getLogger)(name));

    // setup lodash shortcuts
    Object.keys(_lodash2.default).forEach(key => setNativeProperty(this, `_${key}`, _lodash2.default[key]));
  }
};
exports.default = BaseController;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _deacon = __webpack_require__(0);

var _trade = __webpack_require__(22);

var _trade2 = _interopRequireDefault(_trade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tradeRoute = (0, _deacon.createRoute)({
  controller: _trade2.default
});

exports.default = tradeRoute;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = __webpack_require__(7);

var _koa2 = _interopRequireDefault(_koa);

var _register = __webpack_require__(8);

var _register2 = _interopRequireDefault(_register);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//注册中间件
const { app, logger } = (0, _register2.default)(new _koa2.default());
const port = process.env.PORT || 2334;

app.listen(port);

logger.info(`Server [${process.pid}] is listening on ${port}`);

exports.default = app;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(9);

var _path2 = _interopRequireDefault(_path);

var _koaStatic = __webpack_require__(10);

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaMount = __webpack_require__(11);

var _koaMount2 = _interopRequireDefault(_koaMount);

var _koaViews = __webpack_require__(12);

var _koaViews2 = _interopRequireDefault(_koaViews);

var _koaSession = __webpack_require__(13);

var _koaSession2 = _interopRequireDefault(_koaSession);

var _log4js = __webpack_require__(1);

var _log = __webpack_require__(14);

var _log2 = _interopRequireDefault(_log);

var _session = __webpack_require__(15);

var _session2 = _interopRequireDefault(_session);

var _enrich = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const webroot = _path2.default.join(__dirname, '../client');
const staticroot = _path2.default.resolve('');

// configure log4js
(0, _log4js.configure)(_log2.default);
const logger = (0, _log4js.getLogger)('server');

exports.default = app => {
  logger.debug('Registering middlewares for app...');

  app.env = process.env.NODE_ENV || app.env;

  logger.debug('Setting app env to', app.env);

  app.keys = ['this is a secret key hehe'];
  app.use((0, _koaSession2.default)(_session2.default, app));

  // serve pure static assets
  app.use((0, _koaMount2.default)('/', (0, _koaStatic2.default)(staticroot)));

  if (app.env !== 'development') {
    logger.info(`Setting packed resources directory ${webroot} for env [${process.env.NODE_ENV}]`);
    app.use((0, _koaStatic2.default)(webroot));
    app.use((0, _koaViews2.default)(webroot, { extentions: 'html' }));
  }

  app.use(_enrich.enrichResponse);
  app.use(_enrich.enrichSession);

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      logger.error('Uncaught exception:', e);
      ctx.status = 400;
      ctx.body = e.message;
    }
  });

  if (app.env === 'development') {
    logger.debug('Initializing dynamic routes');
    let dynamicRoute = __webpack_require__(18).default;
    app.use(dynamicRoute);
  } else {
    logger.debug('Initializing static routes');
    let initStaticRoute = __webpack_require__(23).default;
    initStaticRoute(app);
  }

  app.use(async ctx => {
    if (!ctx.headerSent && app.env !== 'development') {
      await ctx.render('index.html');
    }
  });

  logger.debug('Middlewares registering completed\n');

  return { app, logger };
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("koa-static");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("koa-mount");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("koa-views");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("koa-session");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  appenders: {
    console: { type: 'console' }
  },
  categories: {
    default: {
      level: process.env.LOG_LEVEL || 'debug',
      appenders: ['console']
    }
  }
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  key: 'fucking-nice-session.id',
  signed: false,
  rolling: true,
  httpOnly: process.env.NODE_ENV === 'development',
  maxAge: 5 * 3600 * 1000
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enrichSession = exports.enrichResponse = undefined;

var _auth = __webpack_require__(17);

var _auth2 = _interopRequireDefault(_auth);

var _log4js = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = (0, _log4js.getLogger)('middlewares');

/* Common response code
** Will be set to response as rtnCode
*/
const resCode = { success: 1, fail: -1 };

const commonResponse = (ctx, status) => {
  return async (msg, obj = {}) => {
    const rtn = { rtnCode: status };

    if (msg instanceof Object) {
      obj = msg;
      msg = undefined;
    }

    status < 0 ? rtn.errMsg = msg || '请求失败' : rtn.rtnMsg = msg || '请求成功';

    Object.assign(rtn, obj);

    logger.debug(`Response data for request ${ctx.path}:`, JSON.stringify(rtn));

    return ctx.body = rtn;
  };
};

const enrichResponse = exports.enrichResponse = async (ctx, next) => {
  // if (ctx.headers['x-request-token'] === authconf['request-token'] && ctx.method === 'POST') {
  !ctx.success && (ctx.success = commonResponse(ctx, resCode.success));
  !ctx.error && (ctx.error = commonResponse(ctx, resCode.fail));
  // }

  await next();
};

const enrichSession = exports.enrichSession = async (ctx, next) => {
  if (process.env.NODE_ENV === 'development' && !ctx.session.user) {
    if (ctx.cookies.get('dev-user')) {
      ctx.session.user = JSON.parse(ctx.cookies.get('dev-user'));
    } else if (ctx.headers['x-dev-token'] === _auth2.default['dev-token']) {
      ctx.session.user = { id: 'dev-user' };
    }
  }

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user;
  }

  await next();
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const privateKey = exports.privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDH/b8R+bDeOArUlvxe7nN1gPTOoV3YmuwQoqH2B1TjfaADBMzZ
YnRJg+uBJ0dSYzGBj5yR/6jNNJG9ElM9oIXe4BZ5YGeAeUmdars9lgdbN3sYf9pV
7EZhuu7ClxSC75L0Ni8HlOhHXx6fS2VxN0Y8d5bYVeuD+WMDoxqaTJt80QIDAQAB
AoGAHqWg8SU9WGBoMHnOxNFvuhL/8OZDllzvTgFOJoCrHo1yxuOmbK2sulNP9KPL
RzHSNVOHn8v41zF2H+49+VSvDtmrE1jP/Ezo85escpT7kENwmS1YDsenx1ECsNCB
aqXpW93aDYB5eUsYttWb1X5yeKh04YuESJm0G0MWiUWPZn0CQQD84RXNe0ZKIvBl
c6ALeKmwxhyHIB4gD2G/6FJ5MFm4uoQNgeNRG6xulffIlN8Ix0GqdhniwJFoIJfv
oQhaNG2rAkEAynWSyPQz8RNXYekqvz4JHHDowNiziQ8VKyAV88Z19RsGUUJT8aTy
tsW7J+YiHmMQpfyFpaspRScSBVrr5mercwJBALa6+2NBShh2SNo2hBbl+VDIx4KJ
Hduy4cKn4Ti7TIolFRkhm55XbfF3ItbpZIVWXsgLkUb+OdRRgRjid0OfkQMCQGYF
o2cyb+4+wdzsA4eFek/jsdZkHOynNhKaQ5WpX42ZBbDzDJwLc+eYcnxjorPPVfde
7fYS72QSkSkzrQZZHXMCQQCtyYR7e8Ms0fdPjPjqvvHP2m3We7+s8sMBsOZ7gTz+
adXjcUTPQtyc+G2u7tCpYHAsQkTzRzBm3eZkl8+oQbWa
-----END RSA PRIVATE KEY-----`;

exports.default = {
  'request-token': 'unique-token',
  'dev-token': 'dev-token'
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async (ctx, next) => {
  if (ctx.path.match(/^\/api\/user\//)) {
    return await __webpack_require__(2).default.routes()(ctx, next);
  }

  if (ctx.path.match(/^\/api\/trade\//)) {
    return await __webpack_require__(5).default.routes()(ctx, next);
  }
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("koa-body");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dec, _dec2, _dec3, _class, _desc, _value, _class2;

var _base = __webpack_require__(4);

var _base2 = _interopRequireDefault(_base);

var _deacon = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

let UserController = (_dec = (0, _deacon.Controller)('/api/user'), _dec2 = (0, _deacon.Post)('/login'), _dec3 = (0, _deacon.Post)('/register'), _dec(_class = (_class2 = class UserController extends _base2.default {
  constructor() {
    super('user');
  }

  async login(ctx) {
    this.logger.info('Login process starts');
    this.logger.info('Ctx body:', ctx.request.body);
    return await ctx.success('Logged in!', { content: ctx.request.body });
  }

  async register(ctx) {
    this.logger.info('Register process starts');
    return await ctx.success('Register in!', { content: ctx.request.body });
  }

  test() {
    this.logger.info('hahahaha, this is a test!');
  }
}, (_applyDecoratedDescriptor(_class2.prototype, 'login', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'login'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'register', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'register'), _class2.prototype)), _class2)) || _class);
exports.default = UserController;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dec, _dec2, _dec3, _class, _desc, _value, _class2;

var _base = __webpack_require__(4);

var _base2 = _interopRequireDefault(_base);

var _deacon = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

let TradeController = (_dec = (0, _deacon.Controller)('/api/trade'), _dec2 = (0, _deacon.Post)('/book'), _dec3 = (0, _deacon.Get)('/list'), _dec(_class = (_class2 = class TradeController extends _base2.default {
  constructor() {
    super('trade');
  }

  async bookTrade(ctx) {
    return await ctx.success('Logged in!' + this.test(), { content: ctx.request.body });
  }

  async getTradeList(ctx) {
    return await ctx.success('Register in!', { content: ctx.request.body });
  }
}, (_applyDecoratedDescriptor(_class2.prototype, 'bookTrade', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'bookTrade'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'getTradeList', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'getTradeList'), _class2.prototype)), _class2)) || _class);
exports.default = TradeController;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = __webpack_require__(2);

var _user2 = _interopRequireDefault(_user);

var _trade = __webpack_require__(5);

var _trade2 = _interopRequireDefault(_trade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = [_user2.default, _trade2.default];

exports.default = app => {
  routes.forEach(route => {
    app.use(route.routes(), route.allowedMethods());
  });
};

/***/ })
/******/ ]);