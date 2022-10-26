const env = process.env.NODE_ENV
// 开发环境
let baseURL = 'http://101.68.70.242:10260/api'
let ledgeBaseURL = 'http://101.68.70.242:10263'
let appCode = 'CBRAIN_OFFICIAL'
let clientId = 'android'
let SmsTemplate = 'SMS_154950909'
let uploadApi = "http://101.68.70.242:10260/api"
let consultingServicesUrl = 'http://101.68.70.242:10260/ent'

// 生产环境
if (env === 'production' && process.env.IS_DEV === 'false') {
  baseURL = 'https://chemical-brain.com/api'
  consultingServicesUrl = 'https://c-brain-uat.plantmate.com/api'
  ledgeBaseURL = 'https://www.plantmate.com'
}

export {
  baseURL,
  ledgeBaseURL,
  appCode,
  clientId,
  SmsTemplate,
  uploadApi,
  consultingServicesUrl,
}