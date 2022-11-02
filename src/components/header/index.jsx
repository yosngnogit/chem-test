import React, { useState } from 'react'

import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message } from 'antd';

import './index.less'

export default function Header(props) {
  const { transparent = false, fixed = false } = props

  const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
  };
  
  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          label: '1st menu item',
          key: '1',
        },
        {
          label: '2nd menu item',
          key: '2',
        },
        {
          label: '3rd menu item',
          key: '3',
        },
      ]}
    />
  );

  return (
    <div className={`${transparent ? 'header_transparent' : 'header'} ${fixed?'header-fixde': ''}`}>
      <div className="header-left">
        <div className="header-title">企业安全自诊断平台</div>
      </div>
      <div className="header-right">
        <div className="header-user">
          <img className='header-user-avatar' src={require('@/assets/img/index/avatar.png')} alt="" />
          <Dropdown overlay={menu}>
            <div className='header-user-name'>
              浙江中控技术
              <DownOutlined className='header-user-name-arrow'/>
            </div>
          </Dropdown>
          <div className="header-user-btn">开始诊断</div>
        </div>
      </div>
    </div>
  )
}
