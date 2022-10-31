import React from 'react'
import { Image } from 'antd';
import { withRouter } from "react-router-dom";

import './index.less'

function baseInfo(props) {
  const onListItemClick = (type) => {
    // 用路由定义type
    props.history.push('baseInfoDetails')
  }
  return (
    <div className='baseInfo'>
      <div className="base-header">
        <div className="base-title">中控技术股份有限公司</div>
        <div className="base-tip">开始自诊断前，请先完善企业基本信息</div>
      </div>
      <div className="base-main">
        <ul className='main-list'>
          <li>
            <div className="info-title">
              <span>*</span>
              <p>企业基本情况</p>
            </div>
            <div className="info-icon">

              <Image
                width={10}
                preview={false}
                src={require('@/assets/img/baseInfo/Vectorinfo-right.png')}
              />
            </div>
          </li>
        </ul>

      </div>
      <div className="base-footer">
        <div className="base-button" onClick={onListItemClick}>完善信息</div>
      </div>
    </div>
  )
}
export default withRouter(baseInfo)
