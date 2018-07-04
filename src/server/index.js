import Koa from 'koa'
import register from './register'

//注册中间件
const { app, logger } = register(new Koa())
const port = process.env.PORT || 2334
/**
 * 插入react代码 进行服务端改造
 */
// 引入renderToString
import { renderToString } from 'react-dom/server';
import routes from './route/index'
// 服务端是没有BrowserRouter 所以用StaticRouter
import { hashHistory } from 'react-router';
import configureStore from '../client/redux/store';
import { syncHistoryWithStore } from 'react-router-redux';
const store = configureStore(hashHistory);

// 创建一个增强版的history来结合store同步导航事件
const history = syncHistoryWithStore(hashHistory,store);

app.use(async (ctx) => {
  const frontComponents = renderToString(
    (<Provider store={store}>
      <Router routes={routes} history={history} />
    </Provider>)
  )
  ctx.body = frontComponents;
} )



app.listen(port)

logger.info(`Server [${process.pid}] is listening on ${port}`)

export default app
