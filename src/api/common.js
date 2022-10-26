/*
 * @Author: zenglinquan
 * @Date: 2022-08-19 10:33:28
 * @LastEditors: zenglinquan
 * @LastEditTime: 2022-09-27 14:10:43
 * @Description: 
 */
import http from "../utils/http";

export const getDictListByName = (name) => {
  return http.request({
    url: '/help/user/sys/dict/dictListByName',
    params: {
      name
    }
  })
}

export const findNation = () => {
  return http.request({
    url: '/front/user/sys/sysDict/findNation',
    method: 'post'
  })
}

export const getProvinceList = () => {
  return http.request({
    url: '/front/sys/sysProvince/provinceList',
  })
}

export const getUserInfoJwt = () => {
  return http.request({
    url: '/front/s2b/getUserInfoJwt',
  })
}
// 埋点
export function adhibitionPoint (params) {
  http.post(`/front/user/sys/sysAccessApplicationLog/save `, params)
}