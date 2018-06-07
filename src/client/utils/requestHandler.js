let instance;

class RequestHandler {
  constructor() {
    let _this = this;
    if (instance == undefined) {
      instance = _this;
    }
    return instance;
  }
  requestRecord = {}
  handleEvent(e) {
    let type = e.type;
    if (this.requestRecord[type] == undefined) {
      return;
    }
    this.requestRecord[type].forEach(function (item, index) {
      item(e);
    });
  }
  subscribe(type, fn) {
    let _this = this;
    if (_this.requestRecord[type] == undefined) {
      _this.requestRecord[type] = [];
    }
    let typeHandle = _this.requestRecord[type];
    typeHandle.push(fn);
    return function unSubscribe() {
      const index = typeHandle.indexOf(fn);
      typeHandle.splice(index, 1);
      JSON.stringify(_this.requestRecord[type]) === '[]' && delete _this.requestRecord[type]
    }
  }
}
const requestHandler = new RequestHandler();

window.requestHandler = requestHandler

module.exports = requestHandler;
