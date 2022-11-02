import React from 'react'
import { Avatar } from 'antd';
import { withRouter } from "react-router-dom";

import '../index.less'

function personalBaseInfo(props) {
  const onListItemClick = (type) => {
    // 用路由定义type
    props.history.go(-1)
  }
  return (
    <div className='personalCenter'>
      <div className="personal-header">
        <Avatar shape="square" size={82} src={require('@/assets/img/personalCenter/avatar.png')} />
        <div className="personal-title">中控技术股份有限公司</div>
      </div>
      <div className="personal-main">
        <ul className='main-list'>
          <li className='info-li'>
            <div className="info-title">
              <p>企业名称</p>
            </div>
            <div className="info-btn">
              <p>企业名称</p>
            </div>
          </li>
          <li className='info-li'>
            <div className="info-title">
              <p>统一社会信用代码</p>
            </div>
            <div className="info-btn">
              <p>企业名称</p>
            </div>
          </li>
          <li className='info-li'>
            <div className="info-title">
              <p>法定代表人</p>
            </div>
            <div className="info-btn">
              <p>企业名称</p>
            </div>
          </li>
          <li className='info-li'>
            <div className="info-title">
              <p>用户名</p>
            </div>
            <div className="info-btn">
              <p>企业名称</p>
            </div>
          </li>
          <li className='info-li'>
            <div className="info-title">
              <p>绑定手机号</p>
            </div>
            <div className="info-btn">
              <p>企业名称</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="personal-footer">
        <div className='logout' onClick={() => onListItemClick('/personalInfo')}>确定</div>
      </div>
    </div>
  )
}
export default withRouter(personalBaseInfo)
