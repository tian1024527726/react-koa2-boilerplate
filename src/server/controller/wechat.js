import BaseController from './base'
import EnhanceAxios from '../../client/utils/enhanceAxios'
const Axios = EnhanceAxios({ baseURL: 'https://api.weixin.qq.com/', beforeSend: ()=>{console.log('request begin')} });
const sha1 = require('sha1')


import { Controller, Get } from '../util/deacon'

const appId = 'wx048542eb7b0de3b2'
const appSecret = '5b5dadf3c5b4ad5d06c07ac2a75a04e7'
const noncestr = 'productmall_weixin'

@Controller('/api/wechat')
class WechatController extends BaseController {
  constructor () {
    super('wechat')
  }

  @Get('/signature')
  async signature (ctx) {
    const res = await Axios.get(`cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`)
    .then((res)=>{
      return res
    })
    return await ctx.success(res)
  }
}

export default WechatController
