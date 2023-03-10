import React from 'react'
import { Button, Avatar } from 'antd';
import { withRouter } from "react-router-dom";
import { getCookie } from '@/utils'

import './index.less'
function baseInfo(props) {
  const entName = getCookie('entName')
  const onListItemClick = (type) => {
    props.history.push(type)
  }
  return (
    <div className='personalCenter'>
      <div className="center-main">
        <div className="personal-header">
          <Avatar shape="square" size={82} src={require('@/assets/img/personalCenter/avatar.png')} />
          <div className="personal-title">{entName}</div>
        </div>
        <div className="personal-main">
          <ul className='main-list'>
            <li>
              <div className="info-title">
                <p>企业信息</p>
              </div>
              <div className="info-btn">
                <Button type="link" onClick={() => onListItemClick('/personalInfo')} >
                  查看
                </Button>
              </div>
            </li>
            <li>
              <div className="info-title">
                <p>修改密码</p>
              </div>
              <div className="info-btn">
                <Button type="link" onClick={() => onListItemClick('/changePassword')}>
                  修改
                </Button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default withRouter(baseInfo)
