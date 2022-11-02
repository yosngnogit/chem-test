import http from "../utils/http";

export const getPersonInfo = (params) => {
  return http.post(
    '/front/consumer/selectPersonInfo', params
  )
};

export const getEnterpriseInfo = () => {
  return http.get('/front/queryEnterpriseInfo');
};

export const updateHeadPhoto = (params) => {
  return http.post(
    '/front/consumer/updateHeadPhoto', params
  )
};
// 

export const getAvarta = (params) => {
  return http.post(
    '/front/consumer/selectPersonInfo', params
  )
};
// 查询企业绑定状态 searchStatus
export const searchStatus = () => {
  return http.get(
    '/front/user/sys/userBindEnterprise/selectBindInfo'
  )
};
// 查询企业
export const searchEntName = (params) => {
  return http.post(
    '/front/user/sys/enterprise/selectEnterprise', params
  )
};
// 查询表单
export const getForm = (params) => {
  return http.post(
    `/front/user/sys/enterprise/queryEnterpriseBindInfo`, params
  )
};
// 发送验证码 getMessageCode
export const getMessageCode = (params) => {
  return http.post(
    `/front/message/sendSms/entBindSendVerificationCode?mobile=${params}`,
  )
};
// 提交申请
export const submitForm = (params) => {
  return http.post(
    `/front/user/sys/userBindEnterprise/submit`, params
  )
};
// 取消绑定 resetBind
export const resetBind = (params) => {
  return http.get(
    `/front/user/sys/userBindEnterprise/cancelBind?enterpriseId=${params}`,
  )
};
// 修改密码
export const sendCode = (mobile) => {
  return http.request({
    url: `/front/message/sendSms/modifyPasswordSendVerificationCode?mobile=${mobile}`,
    method: 'post',
  })
}
export const checkMessageCode = (params) => {
  return http.request({
    url: '/front/message/sendSms/checkMessageCode',
    params
  })
}
export const modifyPassword = (data) => {
  return http.request({
    url: `/front/consumer/modifyPassword`,
    method: 'post',
    data
  })
}
