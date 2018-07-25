import authconf from './config/auth'
import { getLogger } from 'log4js'

const logger = getLogger('middlewares')

/* Common response code
** Will be set to response as rtnCode
*/
const resCode = { success: 1, fail: -1 }

const commonResponse = (ctx, status) => {
  return async (msg, obj = {}) => {

    if (msg instanceof Object) {
      obj = msg
      msg = undefined
    }

    Object.assign(obj)

    logger.debug(`Response data for request ${ctx.path}:`, JSON.stringify(obj))

    return ctx.body = obj
  }
}

export const enrichResponse = async (ctx, next) => {
  // if (ctx.headers['x-request-token'] === authconf['request-token'] && ctx.method === 'POST') {
    !ctx.success && (ctx.success = commonResponse(ctx, resCode.success))
    !ctx.error && (ctx.error = commonResponse(ctx, resCode.fail))
  // }

  await next()
}

export const enrichSession = async (ctx, next) => {
  if (process.env.NODE_ENV === 'development' && !ctx.session.user) {
    if (ctx.cookies.get('dev-user')) {
      ctx.session.user = JSON.parse(ctx.cookies.get('dev-user'))
    } else if (ctx.headers['x-dev-token'] === authconf['dev-token']) {
      ctx.session.user = { id: 'dev-user' }
    }
  }

  if (ctx.session.user) {
    ctx.state.user = ctx.session.user
  }

  await next()
}
