import React from 'react'
import { withRouter } from "react-router-dom";

import { getCookie } from '@/utils';

const tickIcon = require('@/assets/img/common/tick.png')
const fockIcon = require('@/assets/img/common/fork.png')

const freeList = [
  { name: '免费版答题通道（基础测评）', open: true },
  { name: '企业安全管理水平诊断测评', open: true },
  { name: '安全管理要点分项测评', open: true },
  
]
const notFreeList = [
  { name: '专业版答题通道（精准评估）', open: true },
  { name: '行业对标评估', open: true },
  { name: '安全管理改进建议', open: true },
  { name: '安全管理专家辅导', open: true },
  { name: '《企业EHSS安全管理》教材', open: true },
]

function Section4(props) {
  const token = getCookie('access_token')

  const startDiagnosis = () => {
    if(token){
      props.history.push('/answerEntrance')
    } else {
      props.history.push('/login')
    }
  }

  return (
    <div className='section section4'>
      <div className="section4-title">版本差异</div>
      <div className="section4-content">
        <div className="section4-content-left">
          <div className="section4-content-title">免费</div>
          {
            freeList.map((item, index) => (
              <div className="section4-content-project" key={index}>
                <div className="section4-content-project-name">{item.name}</div>
              </div>
            ))
          }
        </div>
        <div className="section4-content-right">
          <div className="section4-content-title">收费</div>
          {
            notFreeList.map((item, index) => (
              <div className="section4-content-project" key={index}>
                <div className="section4-content-project-name">{item.name}</div>
              </div>
            ))
          }
        </div>
        <div className="section4-content-btn" onClick={startDiagnosis}>开始诊断</div>
      </div>
    </div>
  )
}

export default withRouter(Section4)
