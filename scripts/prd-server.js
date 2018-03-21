const config = require('../config')
const path = require('path')
const Koa = require('koa')
const app = new Koa()
const koaStatic = require('koa-static')  //静态文件处理的中间件
const koaViews = require('koa-views')  //渲染模板的中间件
const opn = require('opn')  //open模块,打开文件和url等
const ip = require('ip')  //获取本地ip模块

const webroot = config.dists.client;

app.use(koaStatic(webroot))
app.use(koaViews(webroot, { extentions: 'html' }))

app.use(async ctx => {
    await ctx.render('index.html')
})

const port = process.env.PORT || 3002

app.listen(port)

opn(`http://${ip.address()}:${port}`)

module.exports = app
