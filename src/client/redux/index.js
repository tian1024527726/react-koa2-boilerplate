// base lib
import { combineReducers } from "redux"


// 导入 reducer
import home from '@client/pages/HomePage/reducer'
import detail from '@client/pages/DetailPage/reducer'

// 导入 actions
import * as homeAction from '@client/pages/HomePage/action'
import * as detailAction from '@client/pages/DetailPage/action'

// 将actions 加入自动导入对象
export const allActions = {
  homeAction,
  detailAction
};

// 将reducer 加入自动注入对象
export const allReducer = {
  home,
  detail
};



const rootReducer = combineReducers(allReducer);

export default rootReducer;
