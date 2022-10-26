/*
 * @Author: zenglinquan
 * @Date: 2022-08-05 18:09:01
 * @LastEditors: zenglinquan
 * @LastEditTime: 2022-08-12 09:27:27
 * @Description: 
 */
import http from "@/utils/http";

export const getApplicationList = () => {
    return http.get('/front/maintain/app/plateManage/selectWebPlateApplicationList');
}

export const getEnterPriseName = () => {
    return http.get('/front/user/sys/enterprise/getEntCode');
}

export const addConsult = (params) => {
    return http.post('/front/maintain/maintain/consult/add', params);
}

// 消息提示
export const getMsgNumber = () => {
  return http.request({
    url: '/front/maintain/news/userNewsAnnounce/selectNewsCount'
  })
}

export const getMsg = (data) => {
  return http.request({
    url: '/front/maintain/news/userNewsAnnounce/selectListPage',
    method: 'post',
    data
  })
}
export const readMsg = (id) => {
  return http.request({
    url: `/front/maintain/news/userNewsAnnounce/updateIsRead/${id}`
  })
}
export const updateAllRead = (type) => {
  return http.request({
    url: `/front/maintain/news/userNewsAnnounce/updateAllRead?notifyType=${type}`
  })
}

// Footer
export const getOuterLink = () => { 
  return http.request({
    url: `/front/maintain/app/portalFootLinks/getOuterLink`
  })
 }



