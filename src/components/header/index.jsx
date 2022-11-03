import React from 'react'
import { withRouter } from "react-router-dom";

import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';

import './index.less'
import { getCookie } from '@/utils';
import { logOut } from '@/api/login'

function Header(props) {
  const token = getCookie('access_token')
  const entName = getCookie('entName')
  const { transparent = false, fixed = false } = props

  const onMenuClick = ({ key }) => {
    if(key === 'logout'){
      logOut()
    } else {
      props.history.push('/personalCenter')
    }
  }
  
  const menu = (
    <Menu
      onClick={onMenuClick}
      items={[
        { label: '个人中心', key: 'user' },
        { label: '退出登录', key: 'logout' }
      ]}
    />
  )

  const toLogin = () => {
    props.history.push('/login')
  }

  return (
    <div className={`${transparent ? 'header_transparent' : 'header'} ${fixed?'header-fixde': ''}`}>
      <div className="header-left">
        <div className="header-title">企业安全自诊断平台</div>
      </div>
      <div className="header-right">
        { token ? 
          <div className="header-user">
            <img className='header-user-avatar' src={require('@/assets/img/index/avatar.png')} alt="" />
            <Dropdown overlay={menu}>
              <div className='header-user-name'>
                {entName}<DownOutlined className='header-user-name-arrow'/>
              </div>
            </Dropdown>
            
            <div className="header-user-btn">开始诊断</div>
          </div> :
          <div className='header-login-btn' onClick={toLogin}>登陆</div>
        }
      </div>
    </div>
  )
}

export default withRouter(Header)