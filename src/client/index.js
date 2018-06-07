import Fastclick from "fastclick";
Fastclick.attach(document.body);

import promise from 'es6-promise'
promise.polyfill();
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { hashHistory } from 'react-router';
import configureStore from './redux/store';
import App from './app';


const store = configureStore(hashHistory);
// 创建一个增强版的history来结合store同步导航事件
const history = syncHistoryWithStore(hashHistory,store);
const rootElement = document.getElementById('app');

const render = (Component,store,history) => {
    ReactDOM.render(
        // 利用Provider可以使我们的 store 能为下面的组件所用
        <Component store={store} history={history}/>,
        rootElement
    );
}

render(App,store,history);

if(module.hot){
    module.hot.accept('./app', () => {
        ReactDOM.unmountComponentAtNode(rootElement);
        const App = require('./app');
        render(App,store,history);
    })
}
