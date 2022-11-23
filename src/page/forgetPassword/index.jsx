import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Image } from "antd";
import { SyncOutlined, HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './index.less'
import md5 from 'js-md5'

import { baseURL } from '@/config'
import { getUUID, toLogin } from '@/utils'

import { pwdReg } from '@/utils/reg'
import { clearLoginInfo } from '@/api/login'
import { checkEnterpriseUsername, forgetPassword } from '@/api/login'
import { sendCode, checkMessageCode } from '@/api/personalCenter'


export default function ForgetPassword(props) {
  const [stepActie, setStepActie] = useState(0)
  const [step0Form, setSstep0Form] = useState({})
  const onBack = () => {
    props.history.push('login')
  }
  return (
    <div className='forget-bg'>
      <div className="forget-header">
        <p onClick={() => props.history.push('/')}>安全管理体系自诊断软件</p>
        <div className='back' onClick={() => props.history.push('/')}>
          <HomeOutlined />
          <span className='back-p'>回到首页</span> </div>
      </div>
      <div className="forget-form">
        <div className='forget_header'>
          <div className="forget_header_title">忘记密码</div>
          <div className="forget_header_back" onClick={onBack}>
            <ArrowLeftOutlined />
            <span>返回登录</span> </div>
        </div>
        {stepActie === 0 && <Setp0 nextStep={setStepActie} setSstep0Form={setSstep0Form} />}
        {stepActie === 1 && <Setp1 nextStep={setStepActie} step0Form={step0Form} />}
        {stepActie === 2 && <Step2 step0Form={step0Form} />}
      </div>
    </div>
  )
}


function Setp0(props) {
  const { nextStep, setSstep0Form } = props
  const [form] = Form.useForm()
  const [uuid, setUuid] = useState(getUUID());
  const [loadingLogin, setLoadingLogin] = useState(false);


  useEffect(() => {
    setUuid(getUUID())
  }, [])

  const onFinish = async (values) => {
    try {
      if (loadingLogin) return
      setLoadingLogin(true)
      let params = { ...values, uuid }
      let res = await checkEnterpriseUsername(params)
      setSstep0Form({
        username: values.username,
        entName: res.data.ent_name,
        mobile: res.data.mobile
      })
      nextStep(1)
      setLoadingLogin(false)
    } catch (err) {
      setLoadingLogin(false)
      throw err
    }
  }

  return (
    <Form
      name="step1"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      layout="vertical"
    >

      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder="请输入用户名" maxLength={20} />
      </Form.Item>

      <Form.Item
        name="captcha"
        label="图形验证码"
        rules={[
          { required: true, message: "请输入验证码" },
        ]}
      >
        <Input
          placeholder="请输入验证码"
          maxLength={5}
          suffix={
            <div className='register_captcha'>
              <img src={`${baseURL}/front/consumer/sysCaptcha/${uuid}`} alt="" />
              <SyncOutlined onClick={() => setUuid(getUUID())} />
            </div>
          }
        />
      </Form.Item>

      <Form.Item>
        <div className="step-btn">
          <Button type="primary" htmlType="submit" block size="large">下一步</Button>
        </div>
      </Form.Item>

    </Form>
  )
}

let timerID = 0 //计时器ID
function Setp1(props) {
  let { step0Form, nextStep } = props
  const [form] = Form.useForm()
  const [counter, setCounter] = useState(60)
  const [requestId, setSmsRequestId] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false);

  useEffect(() => {
    clearInterval(timerID)
    return () => clearInterval(timerID)
  }, [])

  const onFinish = async (values) => {
    try {
      if (loadingLogin) return
      setLoadingLogin(true)
      await checkMessageCode({
        requestId,
        mobile: values.mobile,
        code: values.code,
      })
      nextStep(2)
      setLoadingLogin(false)
    } catch (err) {
      setLoadingLogin(false)
      throw err
    }
  }

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
      await form.validateFields(['mobile'])
      let { mobile } = form.getFieldsValue()
      let res = await sendCode(mobile)
      setSmsRequestId(res.data.requestId)
      timerID = setInterval(() => {
        setCounter(pre => pre - 1)
      }, 1000);
    } catch (err) {
      timerID = 0
      throw err
    }
  }

  return (
    <Form
      name="form"
      form={form}
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      initialValues={{
        entName: step0Form.entName,
        mobile: step0Form.mobile
      }}
    >

      <Form.Item
        name="entName"
        label="企业名称"
        rules={[{ required: true, message: "未查询到企业名称" }]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item
        name="mobile"
        label="绑定手机号"
        rules={[{ required: true, message: "未查询到绑定手机号" }]}
      >
        <Input disabled />
      </Form.Item>

      <Form.Item label="验证码" name="code" rules={[{ required: true, message: '' }]}>
        <Form.Item
          name="code"
          // label="验证码"
          rules={[
            { required: true, message: "请输入验证码" },
          ]}
        >
          <Input placeholder="请输入验证码" maxLength={6} suffix={
            <Button onClick={getSmsCode} className='code-btn'>
              {counter > 0 && counter < 60 ? `${counter}s后重新获取` : '获取验证码'}
            </Button>
          } />
        </Form.Item>


      </Form.Item>


      <Form.Item>
        <div className="step-btn">
          <Button type="primary" htmlType="submit" block size="large">下一步</Button>
        </div>
      </Form.Item>

    </Form>
  )
}

function Step2(props) {
  let { step0Form } = props
  const [form] = Form.useForm()
  const [loadingLogin, setLoadingLogin] = useState(false);

  const onFinish = async (values) => {

    try {
      if (loadingLogin) return
      setLoadingLogin(true)
      await forgetPassword({
        mobile: step0Form.mobile,
        username: step0Form.username,
        newPassword: md5(values.newPassword),
      })
      clearLoginInfo()
      toLogin();
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
      layout="vertical"
    >
      <Form.Item
        name="newPassword"
        label="新密码"
        rules={[
          { required: true, message: "请输入密码" },
          { pattern: pwdReg, message: "请输入6-16位大小写、数字、特殊符号组合" },
        ]}
      >
        <Input.Password className='password-input' placeholder='6-16位大小写、数字、特殊符号组合' />
      </Form.Item>

      <Form.Item
        name="rePassword"
        label="确认密码"
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
        <Input.Password className='password-input' placeholder='确认密码' />
      </Form.Item>

      <Form.Item>
        <div className="step-btn">
          <Button type="primary" block htmlType="submit" size="large">确认</Button>
        </div>
      </Form.Item>
    </Form>
  )
}

