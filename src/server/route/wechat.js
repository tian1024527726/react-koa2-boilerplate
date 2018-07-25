import { createRoute } from '../util/deacon'
import WechatController from '../controller/wechat'

const wechatRoute = createRoute({
  controller: WechatController
})

export default wechatRoute
