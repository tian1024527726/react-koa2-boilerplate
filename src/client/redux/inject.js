// base lib
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { allReducer as allStates, allActions } from './index'
import { getType } from '@client/utils'

/**
 *
 * @param {*} data 数组类型的states或actions
 * @param {*} src  state或dispacth
 * @param {*} type 类型
 */
function creatRedux(data, src, type) {
  let res = {};
  data.map((item, index) => {
    if (type === 'state') {
      res[item] = src.root[item]
    } else {
      res[item] = bindActionCreators(allActions[item], src)
    }
  })
  return res;
}

/**
 *
 * @param {*} options 参数
 */
export default function (...options) {
  const checkArgs = options.every((item, index) => {
    if (getType(item) != 'string') {
      console.error(`
请按如下格式传参————————————————
  Inject('app') 或 Inject('app','user') `)
      return false;
    }
    return true;
  })
  return function (component) {
    if (!checkArgs) return;
    //将所有reducer和action的key转成一个长字符串
    const allString = [...Object.keys(allActions), ...Object.keys(allStates)].join('|');
    // 过滤处理state
    function filterState() {
      let res = [];
      options.map((item, index) => {
        let reg = new RegExp(item, 'i');
        if (allString.match(reg)) {
          res.push(allString.match(reg)[0])
        } else {
          console.error(`没有找到可绑定的state---------${item}`);
        }
      })
      if (res.length) {
        return res;
      } else {
        return [];
      }
    }
    // 过滤处理action
    function filterAction() {
      let res = [];
      options.map((item, index) => {
        let reg = new RegExp(item, 'i');
        if (allString.match(reg)) {
          res.push(`${allString.match(reg)[0]}Action`)
        } else {
          console.error(`没有找到可绑定的action---------${item}`)
        }
      })
      if (res.length) {
        return res;
      } else {
        return [];
      }
    }
    const mapState = state => {
      const baseStates = filterState();
      const enhanceStates = creatRedux(baseStates, state, 'state');
      return enhanceStates;
    };

    const mapDispatch = dispatch => {
      const baseActions = filterAction();
      const enhanceActions = creatRedux(baseActions, dispatch);
      return enhanceActions;
    };

    return connect(mapState, mapDispatch)(component);
  }
};



