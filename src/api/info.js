import http from "@/utils/http";

// 企业基本信息
export const getInfo = (entCode) => {
  return http.request({
    url: ``,
  })
}
// 企业基本信息列表
export const getComponyList = (entCode) => {
  return http.request({
    url: `/front/enterprise/table/tableList/info/${entCode}`,
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
// 获取危险源监控管理
export const getSourceForm = (entCode) => {
  return http.request({
    url: `/front/enterprise/table/tableDangerSourceMonitorManageRegister/info/${entCode}`,
  })
}
// 保存saveSourceForm
export const saveSourceForm = (entcode, data) => {
  return http.request({
    url: `/front/enterprise/table/tableDangerSourceMonitorManageRegister/saveOrUpdate?entCode=${entcode}`,
    method: 'post',
    data
  })
}
// 获取安全生产组织
export const getProductionSafetyForm = (entCode) => {
  return http.request({
    url: `/front/enterprise/table/tableSafeProductionMechanismRegister/info/${entCode}`,
  })
}
// 保存saveSourceForm
export const saveProductionSafetyForm = (data) => {
  return http.request({
    url: `/front/enterprise/table/tableSafeProductionMechanismRegister/saveOrUpdate`,
    method: 'post',
    data
  })
}
// 获取企业主要负责人安全管理
export const getObtainEvidenceForm = (entCode) => {
  return http.request({
    url: `/front/enterprise/table/tableForensicRecord/info/${entCode}`,
  })
}
// 保存saveSourceForm
export const saveObtainEvidenceForm = (entCode, data) => {
  return http.request({
    url: `/front/enterprise/table/tableForensicRecord/saveOrUpdate?entCode=${entCode}`,
    method: 'post',
    data
  })
}
// 获取特种作业人员培训考核持证
export const getCertificateForm = (entCode) => {
  return http.request({
    url: `/front/enterprise/table/tableHoldCertificateRegister/info/${entCode}`,
  })
}
// 保存saveSourceForm
export const saveCertificateForm = (entCode, data) => {
  return http.request({
    url: `/front/enterprise/table/tableHoldCertificateRegister/saveOrUpdate?entCode=${entCode}`,
    method: 'post',
    data
  })
}
// 获取特种设备登记表
export const getEquipmentForm = (entCode) => {
  return http.request({
    url: `/front/enterprise/table/tableSpecialEquipmentRegister/info/${entCode}`,
  })
}
// 保存saveSourceForm
export const saveEquipmentForm = (entCode, data) => {
  return http.request({
    url: `/front/enterprise/table/tableSpecialEquipmentRegister/saveOrUpdate?entCode=${entCode}`,
    method: 'post',
    data
  })
}
// 获取生产安全事故
export const getAccidentForm = (entCode) => {
  return http.request({
    url: `/front/enterprise/table/tableSafeAccidentStatistics/info/${entCode}`,
  })
}
// 保存saveSourceForm
export const saveAccidentForm = (entCode, data) => {
  return http.request({
    url: `/front/enterprise/table/tableSafeAccidentStatistics/saveOrUpdate?entCode=${entCode}`,
    method: 'post',
    data
  })
}
// 获取消防器材、防护配置情况登记表
export const getMaterialForm = (entCode) => {
  return http.request({
    url: `/front/enterprise/table/tableProtectionConfigurationRegister/info/${entCode}`,
  })
}
// 保存saveSourceForm
export const saveMaterialForm = (entCode, data) => {
  return http.request({
    url: `/front/enterprise/table/tableProtectionConfigurationRegister/saveOrUpdate?entCode=${entCode}`,
    method: 'post',
    data
  })
}
