import React, { Component } from 'react'
import './index.less'
import UserLogin from './components/UserLogin'
 import EnterpriseRegister from './components/EnterpriseRegister'

export default class Login extends Component {
  state = {
    pageType: 'login',//  login:登录页面 register:注册页面 forget:忘记密码页面
    userType: 'user', // user:个人用户  enterprise:企业用户
  }

  componentDidMount() {
    let userType = localStorage.getItem('login_userType')
    this.setState({
      userType: userType ? userType : this.state.userType
    })


  }

  switchPageType = (pageType) => {
    this.setState(({
      pageType:pageType,
    }))
  }

  render() {
    const { pageType } = this.state
    return (
      <div id="login">
        <div className="login-box">
          { pageType === 'login' && 
            <div className='login'>
                <div className="login-title">安全管理体系自诊断软件</div>
              <div className="login-content">                               
                <div className='login-content-title'>登录</div>
                  <UserLogin  switchPageType={this.switchPageType}/>                
              </div>
            </div>
          }
          { pageType === 'register' && 
            <div className="register">
              <EnterpriseRegister switchPageType={this.switchPageType} />
            </div>
          }
          
        </div>
      </div>
    )
  }
}
