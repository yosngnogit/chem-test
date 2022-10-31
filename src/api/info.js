import http from "@/utils/http";

// 企业基本信息
export const getInfo = (entCode) => {
  return http.request({
    url: ``,
  })
}

//保存企业基本情况
export const saveUpdate = (data) => {
  return http.request({
    url: '/front/enterprise/table/tableEnterpriseBaseInfo/saveUpdate',
    method: 'post',
    data
  })
}

// 获取企业基本情况
export const getBaseInfo = (entCode) => {
  return http.request({
    url: `/front/enterprise/table/tableEnterpriseBaseInfo/info/${entCode}`,
  })
}