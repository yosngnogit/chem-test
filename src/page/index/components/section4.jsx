import React from 'react'
import { withRouter } from "react-router-dom";

import { getCookie } from '@/utils';

const tickIcon = require('@/assets/img/common/tick.png')
const fockIcon = require('@/assets/img/common/fork.png')

const freeList = [
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: false },
  { name: '项目项目项目', open: false },
]
const notFreeList = [
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
  { name: '项目项目项目', open: true },
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
                <img className="section4-content-project-open" src={item.open?tickIcon:fockIcon} alt="" />
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
                <img className="section4-content-project-open" src={item.open?tickIcon:fockIcon} alt="" />
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
