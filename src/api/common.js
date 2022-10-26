import http from "../utils/http";

// 字典
export const getDictListByName = (name) => {
  return http.request({
    url: '/help/user/sys/dict/dictListByName',
    params: {
      name
    }
  })
}

// 省
export const getProvinceList = () => {
  return http.request({
    url: '/front/sys/sysProvince/provinceList',
  })
}

// 所属行业
export const getIndustryTree = () => {
  return http.request({
    method: 'post',
    url: '/front/user/sys/custIndustry/queryList',
  })
}

// 省/市/区 树
export const getRegionTree = () => {
  return http.request({
    url: '/front/sys/sysProvince/queryAddressList',
  })
}
