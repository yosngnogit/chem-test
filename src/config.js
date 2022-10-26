const env = process.env.NODE_ENV
// 开发环境
let baseURL = 'http://10.52.24.21:8021/api'
let appCode = 'CBRAIN_OFFICIAL'
let clientId = 'android'
let SmsTemplate = 'SMS_154950909'

// 生产环境
if (env === 'production' && process.env.IS_DEV === 'false') {
  baseURL = 'http://10.52.24.21:8021/api'
}

export {
  baseURL,
  appCode,
  clientId,
  SmsTemplate,
}