import http from '@/utils/http'

// 查询版本详情
export const getVersionInfo = (data) => {
  return http.request({
    url: `/front/maintain/DiagnosticEntrance/queryDiagnosisVersionDetail`,
    method: 'post',
    data
  })
}

// 查询答题记录
export const getRecordInfo = (entCode) => {
  return http.request({
    url: `/front/maintain/DiagnosticEntrance/queryEntAnswerRecord?entCode=${entCode}`,
    method: 'get',
  })
}

// 查询答题详情
export const getQuestionInfo = (data) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/queryEntAnswerSheetByPage',
    method: 'post',
    data
  })
}

export const getAnswer = (data) => {
  return http.request({
    url: `front/maintain/DiagnosticEntrance/queryEntAnswerPaperModule?paperId=${data}`,
  })
}

export const createAnswer = (params) => {
  return http.post("/front/maintain/DiagnosticEntrance/generateEntPaper", params);
};

// 查询题目锁状态
export const checkLockQuestion = (data) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/lockQuestion',
    method: 'post',
    data
  })
}

// 查询目录
export const getDirectory = (data) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/catalogue',
    method: 'post',
    data
  })
}

// 打标记
export const markedQuestion = (data) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/collection',
    method: 'post',
    data
  })
}

// 保存答题
export const saveQuestion = (data) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/answer',
    method: 'post',
    data
  })
}

// 下一未答
export const nextNotAnswered = (data) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/nextNotAnswered',
    method: 'post',
    data
  })
}

// 下一标记
export const nextMarked = (data) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/nextMarked',
    method: 'post',
    data
  })
}

// 提交模块
export const submitModule = (params) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/submitModule',
    method: 'get',
    params
  })
}
// 提交试卷
export const submitPaper = (params) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/submitPaper',
    method: 'get',
    params
  })
}
// 删除答题记录
export const deleteEntPaper = (params) => {
  return http.request({
    url: '/front/maintain/DiagnosticEntrance/deleteEntPaper',
    method: 'get',
    params
  })
}
// 企业完善信息
export const getInfoPerfect = (entCode) => {
  return http.request({
    url: `/front/maintain/DiagnosticEntrance/getEntBaseIntegrity?entCode=${entCode}`,
    method: 'get',
  })
}