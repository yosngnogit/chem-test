import React, { useState, useEffect } from 'react'

// import { Button, Avatar } from 'antd';
import { withRouter } from "react-router-dom";
import { Button, Form, Input, Avatar } from "antd";
import { LeftOutlined } from '@ant-design/icons';
import md5 from 'js-md5'

import { getCookie } from '@/utils'
import { pwdReg } from '@/utils/reg'
import { sendCode, checkMessageCode, modifyPassword } from '@/api/personalCenter'
import { logOut } from '@/api/login';
import '../index.less'
const mobile = getCookie('mobile')
const entName = getCookie('entName')
function ChangePassword(props) {
  const [active, setActive] = useState(0)
  const [step1Form, setSstep1Form] = useState({})

  const goBack = () => {
    // 用路由定义type
    props.history.go(-1)
  }
  return (
    <div className='personalCenter'>
      <div className="personal-header">
        <Button type="link" className='back' onClick={() => goBack()}><LeftOutlined /></Button>
        <Avatar shape="square" size={82} src={require('@/assets/img/personalCenter/avatar.png')} />
        <div className="personal-title">{entName}</div>
      </div>
      <div className="personal-main">
        <div className='change-password'>
          {active === 0 && <Step0 nextStep={setActive} setSstep1Form={setSstep1Form} />}
          {active === 1 && <Step1 step1Form={step1Form} />}
        </div>
      </div>
    </div>
  )
}
let timerID = 0
function Step0(props) {
  const { nextStep, setSstep1Form } = props
  const [form] = Form.useForm()
  const [counter, setCounter] = useState(60)
  const [requestId, setRequestId] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false);
  useEffect(() => {
    clearInterval(timerID)
    return () => clearInterval(timerID)
  }, [])
  useEffect(() => {
    if (counter <= 0 || counter >= 60) {
      clearInterval(timerID)
      timerID = 0
      setCounter(60)
    }
  }, [counter])
  const getSmsCode = async () => {
    try {
      if (timerID) return
      timerID = true //设置一个true值，防止重复点击
      let { mobile } = form.getFieldsValue()
      let res = await sendCode(mobile)
      setRequestId(res.data.requestId)
      timerID = setInterval(() => {
        setCounter(pre => pre - 1)
      }, 1000);
    } catch (err) {
      timerID = 0
      throw err
    }
  }

  const onFinish = async (values) => {
    try {
      if (loadingLogin) return
      setLoadingLogin(true)
      await checkMessageCode({
        requestId,
        ...values,
      })
      setLoadingLogin(false)
      setSstep1Form({ mobile: values.mobile })
      nextStep(1)
    } catch (err) {
      setLoadingLogin(false)
      throw err
    }
  }

  return (
    <Form
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      initialValues={{
        mobile, entName
      }}
      labelCol={{
        span: 8
      }}
    >
      <Form.Item
        name="entName"
        label="确认企业名称"
        rules={[
          { required: true },
        ]}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="mobile"
        label="确认绑定手机号"
        rules={[
          { required: true },
        ]}
      >
        <Input disabled />
      </Form.Item>

      <Input.Group compact>
        <Form.Item
          name="code"
          label="验证码"
          rules={[
            { required: true, message: "请输入验证码" },
          ]}
        >
          <Input
            placeholder="请输入验证码"
            maxLength={6}
          />
        </Form.Item>

        <Button onClick={getSmsCode} type='link' style={{ width: 124 }}>
          {counter > 0 && counter < 60 ? `${counter}s后重新获取` : '获取验证码'}
          {/* 获取验证码 */}

        </Button>
      </Input.Group>

      {/* <Form.Item className='footer'> */}
      {/* <div className="change-password_btns">
          <Button type="primary" htmlType="submit">下一步</Button>
        </div> */}
      <div className="password-footer">
        <div className='logout' onClick={form.submit}>下一步</div>
      </div>
      {/* </Form.Item> */}
    </Form>
  )
}

function Step1(props) {
  // const navigate = useNavigate();
  let { step1Form } = props
  const [form] = Form.useForm()
  const [loadingLogin, setLoadingLogin] = useState(false);

  const onFinish = async (values) => {
    try {
      if (loadingLogin) return
      setLoadingLogin(true)
      await modifyPassword({
        mobile: step1Form.mobile,
        newPassword: md5(values.newPassword),
        rePassword: md5(values.rePassword)
      })
      await logOut()
      // navigate('/login');
      setLoadingLogin(false)
    } catch (err) {
      setLoadingLogin(false)
      throw err
    }
  }

  return (
    <Form
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      labelCol={{ span: 8 }}
      labelAlign='right'
    >
      <Form.Item
        name="newPassword"
        label="新的企业账号密码"
        rules={[
          { required: true, message: "请输入密码" },
          { pattern: pwdReg, message: "请输入6-16位大小写、数字、特殊符号组合" },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="rePassword"
        label="确认新密码"
        rules={[
          { required: true, message: "请确认密码" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('确认密码与密码输入不一致'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      {/* <Form.Item>
        <div className="change-password_btns">
          <Button type="primary" htmlType="submit">下一步</Button>
        </div>
      </Form.Item> */}
      <div className="password-footer">
        <div className='logout' onClick={form.submit}>确认</div>
      </div>
    </Form>
  )
}
export default withRouter(ChangePassword)
