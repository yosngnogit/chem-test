import http from "@/utils/http";
// 报告 雷达图

export const report = (id) => {
  return http.request({
    url: `/front/diagnosis/diagnosisPaperReport/${id}`,
   
  })
}