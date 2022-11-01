import React, { useState } from "react";
import md5 from 'js-md5'
import { withRouter } from "react-router-dom";
import { Button, Checkbox, Form, Input } from "antd";

import { login } from '@/api/login'

function UserLogin(props) {
  const { switchPageType } = props
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form] = Form.useForm()


  const defaultChecked = localStorage.getItem('login_remeber') === 'true'

  const initialize = () => {
    let username = localStorage.getItem('login_username')
    let password = localStorage.getItem('login_password')
    if (password) {
      return {
        username,
        password,
      }
    }
  }

  const onFinish = async ({ username, password }) => {
    try {
      if (loadingLogin) return
      setLoadingLogin(true)
      await login({
        userType: "enterprise",
        username,
        password: md5(password),
        grant_type: "password",
      })
      props.history.push('/')
      setLoadingLogin(false)
      if (remember) {
        localStorage.setItem('login_username', username)
        localStorage.setItem('login_password', password)
        localStorage.setItem('login_remeber', remember)
      } else {
        localStorage.removeItem('login_username');
        localStorage.removeItem('login_password');
        localStorage.removeItem('login_remeber');
      }
    } catch (err) {
      setLoadingLogin(false)
      throw err
    }
  }

  return (
    <div className="user-login">
      <Form
        name="userLogin"
        form={form}
        initialValues={initialize()}
        onFinish={onFinish}
        layout='vertical'
      >
        <Form.Item label='用户名' name="username">
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item label='密码' name="password">
          <Input type='password' placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          className="remember"
          name="remember"
        
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        ><div>
           <Checkbox  onChange={(value) => { setRemember(value) }}>
            <div className="remember-me">记住我</div>
           </Checkbox>
        </div>
         
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <div className="user-login-bottom" onClick={() => form.submit()}>
            登录
          </div>
        </Form.Item>
      </Form>

      <div className="register">
        <span className="register_tip">您还没有账户?</span>
        <span className="register_btn" onClick={() => { switchPageType('register') }}>&nbsp;&nbsp;现在注册</span>
      </div>
    </div>
  );
};
export default withRouter(UserLogin)