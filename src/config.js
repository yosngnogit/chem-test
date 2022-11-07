const env = process.env.NODE_ENV
let baseURL = 'http://10.52.24.22:8500' // 自诊断开发环境
let appCode = 'CBRAIN_OFFICIAL'
let clientId = 'android'
let SmsTemplate = 'SMS_154950909'

if (env === 'production') {
  if (process.env.BUILD_NAME === 'exam') {
    // 测试环境
    baseURL = 'http://101.68.70.245:8090/api'
  } else if (process.env.BUILD_NAME === 'prod') {
    // 生产环境
    baseURL = 'http://112.124.0.32:8021/api'
  } else if (process.env.BUILD_NAME === 'experience') {
    // 体验版
    baseURL = 'http://60.12.1.36:8021/api'
  }
}

export {
  baseURL,
  appCode,
  clientId,
  SmsTemplate,
}