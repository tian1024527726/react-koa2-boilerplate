'use strict'

var Koa = require('koa')
var Axios = require('axios')

var sha1 = require('sha1')
var config = {
  wechat: {
      appID:'wx048542eb7b0de3b2',
      appsecret:'5b5dadf3c5b4ad5d06c07ac2a75a04e7',
      token:'weixin'
  }
}

var app = new Koa();

app.use(function *(next) {
  console.log(this.query)
  var aapId = config.wechat.appID
  var appSecret = config.wechat.appsecret
  var token = config.wechat.token
  var signature = this.query.signature
  var nonce = this.query.nonce
  var timestamp = this.query.timestamp
  var echostr = this.query.echostr
  var str = [token, timestamp, nonce].sort().join('')
  var sha = sha1(str)
  var button =  {
    "button":[
    {
         "type":"view",
         "name":"保险",
         "url":"https://h0-stg.yztcdn.com/insurance/qichezhijia/index.html"
     },
     {
          "name":"菜单",
          "sub_button":[
          {
              "type":"view",
              "name":"搜索",
              "url":"http://www.soso.com/"
           },
           {
              "type":"click",
              "name":"赞一下我们",
              "key":"V1001_GOOD"
           }]
      }]
}
  Axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${aapId}&secret=${appSecret}`)
      .then((res)=>{
        var access_token = res.access_token;
        console.log(access_token)
        Axios.post(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`,button)
        .then(res => {
          console.log(res)
        })
      })
  if (sha === signature) {
      this.body = echostr + ''
  } else {
      this.body = 'wrong'
  }
})

app.listen(8080)
