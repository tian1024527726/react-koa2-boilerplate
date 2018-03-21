import {createStore,applyMiddleware,compose,combineReducers} from 'redux'
import {routerMiddleware,routerReducer} from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers/couter'

let DevToolsInstrument;

//开发工具检测
if (process.env.NODE_ENV === 'development' && window.devToolsExtension) {
    DevToolsInstrument = window.devToolsExtension();
}

export default (history)=>{
    //加强了history这个实例，以允许将history中接受到的变化反应到state中去
    const reduxRouterMiddleware = routerMiddleware(history);

    //thunkMiddleware做的事情就是判断 action 类型是否是函数，若是，则执行 action，若不是，则继续传递 action 到下个 middleware。
    const middleware = [reduxRouterMiddleware,thunkMiddleware];

    let finalCreateStore;
    //redux提供了applyMiddleware 这个 api 来加载 middleware
    //借助 compose ， applyMiddleware 可以用来和其他插件一起加强 createStore 函数.
    if(DevToolsInstrument){
        finalCreateStore = compose(applyMiddleware(...middleware),DevToolsInstrument)(createStore);
    }else{
        finalCreateStore = applyMiddleware(...middleware)(createStore);
    }

    //将router组合进reducer
    const reducer = combineReducers({
        root:reducers,
        routing: routerReducer,
    });
    const store = finalCreateStore(reducer);

    return store;
}
