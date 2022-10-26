
import http from "@/utils/http";
import { getEnvConfig } from './envConfig'
import { appCode, SmsTemplate } from "../config";
import { getCookie, setCookie, clearCookie } from '@/utils'
const token = getCookie('access_token')

// 方式1：登录
export const login = async (data) => {
  let res = await http.request({
    url: '/auth/login',
    method: 'post',
    data: {
      ...data,
      client_id: "app",
    }
  })
  localStorage.setItem("isEnterprise", res.data.isEnterprise);
  setCookie('access_token', res.data.access_token)
  setCookie('username', res.data.username)
  await Promise.all([getUserInfo(), getEntCode()])
  setTimeout(() => {
    window.location.href = window.loginPreviousHref || '/'
  }, 200);
  return res
}

// 方式2:二维码登录
export const getQrCodeStatus = async (params) => {
  const { statusCode, uuid } = params
  let res = await http.request({
    url: `/auth/getQrCodeStatus`,
    params: {
      currentStatus: statusCode,
      uuid
    }
  })
  if (res.data.statusCode === 30000) {
    setCookie('access_token', res.data.access_token)
    setCookie('username', res.data.username)
    await Promise.all([getUserInfo(), getEntCode()])
    window.location.href = window.loginPreviousHref || '/'
  }
  return res
}

export const getUserInfo = async () => {
  let res = await http.request({
    url: '/front/consumer/usercenter/custUserCenterInfo',
    params: {
      appCode,
    }
  })
  res.data && res.data.userInfo && setCookie('userId', res.data.userInfo.userId)
  res.data && res.data.userInfo && setCookie('mobile', res.data.userInfo.mobile)
  return res
};

export const getEntCode = async () => {
  let res = await http.request({
    url: '/front/user/sys/enterprise/getEntCode'
  })
  res.data && res.data.entCode && setCookie('entCode', res.data.entCode)
  res.data && res.data.entCode && setCookie('cid', res.data.entCode)
  res.data && res.data.entName && setCookie('entName', res.data.entName)
  return res
};

export const getLoginSms = (phone) => {
  return http.request({
    url: `/front/message/sendSms/loginRegisterSendVerificationCode?templateCode=${SmsTemplate}&mobile=` + phone,
    method: 'post'
  })
}

export const getQrCode = (userType) => {
  return http.request({
    url: `/auth/getQrCodeImg?userType=${userType}`
  })
}


// 退出登录
export const logOut = async () => {
  let res = await http.delete(`/auth/user/token?access_token=${token}&env=${getEnvConfig().env}&domain=${getEnvConfig().domain}`, { access_token: token });
  clearLoginInfo()
  window.location.pathname = '/login'
  return res
}
export const clearLoginInfo = () => {
  clearCookie()
  // 不需要清除的值
  let storage = {
    login_username: '',
    login_userType: '',
    login_remeber: '',
    login_password: '',
  }
  Object.keys(storage).forEach(key => {
    storage[key] = localStorage.getItem(key) || ''
  })
  localStorage.clear();
  Object.keys(storage).forEach(key => {
    localStorage.setItem(key, storage[key])
  })
}


// 注册
export const checkRegisterInfo = (data) => {
  return http.request({
    url: '/front/consumer/checkRegisterInfo',
    method: 'post',
    data
  })
}

export const sysUserRegister = (data) => {
  return http.request({
    url: '/front/consumer/sysUserRegister',
    method: 'post',
    data
  })
}

export const checkEnterpriseRegisterInfo = (params) => {
  return http.request({
    url: '/front/user/sys/enterprise/checkEnterpriseRegisterInfo',
    params
  })
}

export const enterpriseRegister = (data) => {
  return http.request({
    url: '/front/user/sys/enterprise/register',
    method: 'post',
    data
  })
}

// 忘记密码
export const checkEnterpriseUsername = (params) => {
  return http.request({
    url: '/front/consumer/checkEnterpriseUsername',
    params
  })
}

export const forgetPassword = (data) => {
  return http.request({
    url: '/front/consumer/forgetPassword',
    method: 'post',
    data
  })
}

// 后台管理getUserInfoByToken
export const getUserInfoByToken = (data) => {
  return http.request({
    url: '/front/consumer/getUserInfoByToken',
    method: 'get',
    data
  })
}