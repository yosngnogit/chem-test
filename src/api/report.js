import http from "@/utils/http";
// 报告 雷达图

export const report = (id) => {
  return http.request({
    url: `/front/diagnosis/diagnosisPaperReport/${id}`,
  })
}
// 下一标记 /front/diagnosis/diagnosisPaperReport/nextMarked
export const nextMark = (data) => {
  return http.request({
    url: `/front/diagnosis/diagnosisPaperReport/nextMarked`,
    method: 'post',
    data
  })
}