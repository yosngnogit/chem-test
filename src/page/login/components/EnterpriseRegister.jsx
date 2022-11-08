import React, { useState, useEffect } from 'react'
import md5 from 'js-md5'
import { Button, Form, Input, Select, Message, Cascader } from "antd";
import { baseURL, appCode, clientId } from '@/config'
import { getUUID } from '@/utils'
import { USCCReg, idCardReg, pwdReg, phoneReg, passportReg, cardHKMacaoReg, cardTaiwanRge, cardForeignerPermanentReg } from '@/utils/reg'
import { getDictListByName, getProvinceList, getIndustryTree } from '@/api/common'
import { checkEnterpriseRegisterInfo, getLoginSms, enterpriseRegister } from '@/api/login'


export default function EnterpriseRegister(props) {
  const { switchPageType } = props
  const [stepActie, setStepActie] = useState(0)
  const [step1Form, setSstep1Form] = useState({})

  return (

    <div className='register'>
      <div className="register_nav">
        {stepActie === 0 &&
          <div className="register_nav-step">
            <img src={require('@/assets/img/login/Steps1-long.png')} alt="" />
          </div>
        }
        {stepActie === 1 &&
          <div className="register_nav-step">
            <img src={require('@/assets/img/login/Steps2-long.png')} alt="" />
          </div>
        }
        {stepActie === 2 &&
          <div className="register_nav-step">
            <img src={require('@/assets/img/login/Steps.png')} alt="" />
          </div>
        }
      </div>
      <div className='register_content'>
        {stepActie === 0 && <Setp1 switchPageType={switchPageType} nextStep={setStepActie} step1Form={step1Form} setSstep1Form={setSstep1Form} />}
        {stepActie === 1 && <Setp2 nextStep={setStepActie} step1Form={step1Form} />}
        {stepActie === 2 && <Setp3 switchPageType={switchPageType} />}
      </div>
    </div>
  )
}

// 第一步
function Setp1(props) {
  const { nextStep, step1Form, setSstep1Form, switchPageType } = props
  const [form] = Form.useForm();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [provinceList, setProvinceList] = useState([])
  const [legalTypeList, setLegalTypeList] = useState([])
  const [cardTypeList, setcardTypeList] = useState([])
  const [industryTree, setIndustryTree] = useState([])

  useEffect(() => {
    Promise.all([
      getProvinceList(),
      getDictListByName('LEGAL_TYPE'),
      getDictListByName('LEGAL_CERT_TYPE'),
      getIndustryTree()
    ]).then(res => {
      setProvinceList(res[0].data||[])
      setLegalTypeList(res[1].data||[])
      setcardTypeList(res[2].data||[])
      setIndustryTree(handleIndustryTree(res[3].data)||[])
    })
    form.setFieldsValue(step1Form)
  }, [])

  const handleIndustryTree = (list) => {
    list.map(item => {
      item.label = item.industryName
      item.value = item.industryId
      if (item.children) {
        item.children = handleIndustryTree(item.children)
      }
    })
    return list;
  }

  const onFinish = async (values) => {
    console.log(values)
    try {
      if (loadingLogin) return
      setLoadingLogin(true)
      await checkEnterpriseRegisterInfo({
        entName: values.entName,
        entCode: values.entCode,
        name: values.name,
        provinceCode: values.provinceCode,
        legalType: values.legalType,
        cardType: values.legalCertType,
        cardCode:values.cardCode      
      })

      console.log(values, values.provinceCode)
      setSstep1Form(values)
      nextStep(1)
      setLoadingLogin(false)
    } catch (err) {
      setLoadingLogin(false)
      throw err
    }
  }

  const onFinishFailed = () => {
    Message.info({
      content: '请检查并完成必填项',
    })
  }

  const cardCodeValid = (rule, val) => {
    if (!form.getFieldValue('cardCode')) return Promise.reject('请输入证件号码')
    let legalCertType = form.getFieldValue('legalCertType')
    //  legalCertType = legalCertType && legalCertType[0]
    let reg = idCardReg
    if (legalCertType === '20') reg = passportReg
    if (legalCertType === '30') reg = cardHKMacaoReg
    if (legalCertType === '40') reg = cardTaiwanRge
    if (legalCertType === '50') reg = cardForeignerPermanentReg
    if (reg.test(val)) {
      return Promise.resolve()
    } else {
      return Promise.reject('格式错误')
    }
  }

  const back = () => {
    form.resetFields()
    switchPageType('login')
  }

  return (
    <div className="register-step1">
      <Form
        form={form}
        layout='horizontal'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <Form.Item label='省份' name="provinceCode"
          rules={[{required: true, message: '请选择省份' }]}

        >
          <Select placeholder="请选择省份">
            {provinceList.map((item) =>
              <Select.Option value={item.codeP} key={item.id}>{item.name}</Select.Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item label='法人类型' name="legalType"
          rules={[{ required: true, message: '请选择法人类型' }]}
        >
          <Select placeholder="请选择法人类型">
            {legalTypeList.map((item) =>
              <Select.Option value={item.code} key={item.code}>{item.value}</Select.Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item label='企业名称' name="entName"
          rules={[{ required: true, message: '请输入企业名称' }]}>
          <Input placeholder="请输入" maxLength={128} />
        </Form.Item>

        <Form.Item label='统一社会信用代码' name="entCode"
          rules={[
            { required: true, message: '请输入统一社会信用代码' },
            {
              pattern: USCCReg, message: '请输入正确的格式'
            }
          ]}>
          <Input placeholder="请输入" maxLength={18} />
        </Form.Item>

        <Form.Item label='法定代表人' name="name"
          rules={[{ required: true, message: '请输入法人姓名' }]}>
          <Input placeholder="请输入" maxLength={255} />
        </Form.Item>

        <Form.Item label='证件类型' name="legalCertType"
          rules={[{ required: true, message: '请选择证件类型' }]}
        >
          <Select placeholder="请选择证件类型">
            {cardTypeList.map((item) =>
              <Select.Option value={item.code} key={item.code}>{item.value}</Select.Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item label='法定代表人证件号码' name="cardCode"
          rules={[
            { required: true, validator: cardCodeValid }
          ]}>
          <Input placeholder="请输入" maxLength={18} />
        </Form.Item>

        <Form.Item label='所属行业' name="industry"
          rules={[{ required: true, message: '请选择所属行业' }]}

        >
          <Cascader options={industryTree} placeholder="选择所属行业" />
        </Form.Item>
        <Form.Item

        >
          <Button className='register-btn' type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>

      </Form>
    </div>
  )
}

// 第二步
let timerID = 0 //计时器ID
function Setp2(props) {
  const { nextStep, step1Form } = props
  const [form] = Form.useForm()
  const [counter, setCounter] = useState(60)
  const [smsRequestId, setSmsRequestId] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [uuid, setUuid] = useState('');

  const back = () => {
    form.resetFields()
    nextStep(0)
  }

  useEffect(() => {
    clearInterval(timerID)
    setUuid(getUUID())
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
      await form.validateFields(['mobile'])
      let { mobile } = form.getFieldsValue()
      let res = await getLoginSms(mobile)
      setSmsRequestId(res.data.requestId)
      timerID = setInterval(() => {
        setCounter(pre => pre - 1)
      }, 1000);
    } catch (err) {
      timerID = 0
      throw err
    }
  }

  const onFinish = async (params) => {
    console.log(step1Form,params)
    
    try {
      if (loadingLogin) return
      setLoadingLogin(true)
      params = {
        ...step1Form,
        ...params,
        industry: step1Form.industry?.join(','),
        provinceCode: step1Form.provinceCode,
        legalType: step1Form.legalType,
        legalCertType: step1Form.legalCertType,
        legalPerson: step1Form.name,
        legalCertNumber: step1Form.cardCode,
        telephone: params.mobile,
        appCode,
        clientId,
        uuid,
        requestId: smsRequestId,
        password: md5(params.password),
        rePassword: md5(params.rePassword)
      }
      let res = await enterpriseRegister({ ...params })
      if (res.code === 0) nextStep(2)
      setLoadingLogin(false)
    } catch (err) {
      setLoadingLogin(false)
      throw err
    }
  }

  const onFinishFailed = () => {
    Message.info({
      content: '请检查并完成必填项',
    })
  }

  return (
    <div className="register-step2">
      <Form
        name="step2"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout='horizontal'
        form={form}
        labelCol={{
          span: 7,
        }}
      // wrapperCol={{
      //   span: 17,
      // }}
      >
        <Form.Item label='用户名' name="username"
          rules={[{ required: true, message: "请输入用户名" }]}>
          <Input placeholder="请输入" maxLength={20} />
        </Form.Item>

        <Form.Item label='密码' name="password"
          rules={[
            { required: true, message: "请输入密码" },
            { pattern: pwdReg, message: "请输入6-16位大小写、数字、特殊符号组合" },
          ]}>
          <Input type='password' placeholder="请输入" maxLength={16} />
        </Form.Item>

        <Form.Item label='确认密码' name="rePassword"
          rules={[
            { required: true, message: "请确认密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('确认密码与密码输入不一致'));
              },
            }),
          ]}>
          <Input type='password' placeholder="请确认" />
        </Form.Item>
        <Form.Item label='手机号' name="mobile"
          rules={[
            { required: true, message: "请输入手机号" },
            { pattern: phoneReg, message: '请输入正确的手机号' }
          ]}>
          <Input placeholder="请输入" maxLength={11} />
        </Form.Item>

        <Form.Item label='图形验证码' name="captcha"
          rules={[{ required: true, message: "请输入验证码" }]}>
          <div className="register_captcha">
            <Input placeholder="请输入验证码" maxLength={5} />
            <img src={`${baseURL}/front/consumer/sysCaptcha/${uuid}`} alt="" onClick={() => setUuid(getUUID())} />
          </div>
        </Form.Item>

        <Form.Item label='验证码' name="messageCode"
          rules={[{ required: true, message: "请输入验证码" }]}
        >
          <div className="register_captcha">
            <Input placeholder='请输入验证码' maxLength={6} />
            <a className='extra-part' onClick={getSmsCode}>
              {counter > 0 && counter < 60 ? `${counter}s后重新获取` : '获取验证码'}
            </a>
          </div>
        </Form.Item>


        <Form.Item>
          <div className='footer-btn'>
            <div className='footer-left' onClick={back}>上一步</div>
            <div className='footer-right' onClick={form.submit}>确 认</div>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

// 第三步
function Setp3(props) {
  useEffect(() => {
    setTimeout(() => {
      props.switchPageType('login')
    }, 3000)
  }, [])

  return (
    <div className="register-step3">
      <div className="register-step3_tip">
        <img src={require('@/assets/img/login/rigister_sucess.png')} alt="" />
        <p>注册成功</p>
      </div>
      <div className="register-step3_back">
        <span>3s</span>后自动跳转登录页面
      </div>
    </div>
  )
}