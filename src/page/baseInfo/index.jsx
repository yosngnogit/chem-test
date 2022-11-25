import React from 'react'
import { Image, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import { withRouter } from "react-router-dom";

import './index.less'

function baseInfo(props) {
  const onListItemClick = () => {
    // 用路由定义type
    props.history.push('baseInfoDetails')
  }
  const goBack = () => {
    // 用路由定义type
    props.history.go(-1)
  }
  return (
    <div className='baseInfo'>
      <div className="base-header">
        <Button type="link" className='back' onClick={() => goBack()}><LeftOutlined /></Button>
        <div className="base-title">中控技术股份有限公司</div>
        <div className="base-tip">开始自诊断前，请先完善企业基本信息</div>
      </div>
      <div className="base-main">
        <ul className='main-list'>
          <li onClick={onListItemClick}>
            <div className="info-title">
              <span>*</span>
              <p>企业基本情况</p>
            </div>
            <div className="info-icon">
              <Image
                width={18}
                preview={false}
                src={require('@/assets/img/baseInfo/complete.png')}
              />
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
