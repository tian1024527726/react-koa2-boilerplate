// base lib
import { combineReducers } from "redux"


// 导入 reducer
import home from '@client/pages/HomePage/reducer'

// 导入 actions
import * as homeAction from '@client/pages/HomePage/action'

// 将actions 加入自动导入对象
export const allActions = {
  homeAction
};

// 将reducer 加入自动注入对象
export const allReducer = {
  home
};



const rootReducer = combineReducers(allReducer);

export default rootReducer;
