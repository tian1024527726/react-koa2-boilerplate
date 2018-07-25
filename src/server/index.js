import Koa from 'koa'
import register from './register'

//注册中间件
const { app, logger } = register(new Koa())
const port = process.env.PORT || 2334
app.listen(port)


logger.info(`Server [${process.pid}] is listening on ${port}`)

export default app
