import http from '@/utils/http'

// 查询版本详情
export const getVersionInfo = (entCode) => {
  return http.request({
    url: `/front/maintain/DiagnosticEntrance/queryDiagnosisVersionDetail?entCode=${entCode}`,
    method: 'get',
  })
}

// 查询答题记录
export const getRecordInfo = (entCode) => {
  return http.request({
    url: `/front/maintain/DiagnosticEntrance/queryEntAnswerRecord?entCode=${entCode}`,
    method: 'get',
  })
}