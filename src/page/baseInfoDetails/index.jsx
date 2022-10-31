import React, { useEffect, useState } from 'react'

import { Collapse, Form, Input, Button, Select, DatePicker, Checkbox, Radio, Space, Cascader } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { withRouter } from "react-router-dom";
import { getCookie } from '@/utils'

import { getRegionTree, getDictListByName } from '@/api/common'
import { getBaseInfo, saveUpdate } from '@/api/info'
import AnswerTable from './component/AnswerTable'


import './index.less'

function BaseInfoDetails(props) {
  const { Panel } = Collapse;
  const { Option } = Select;
  const { TextArea } = Input;
  const [form] = Form.useForm()
  // const [id, setId] = useState('')
  // const [saveLoading, setSaveLoading] = useState(false)
  const [showSafeInput, setShowSafeInput] = useState(false)
  const [economicTypeList, setEconomicType] = useState([])
  const [regionTree, setRegionTree] = useState([])
  const [otherSafe, setOtherSafe] = useState('')
  const sights = {
    Beijing: ['Tiananmen', 'Great Wall'],
    Shanghai: ['Oriental Pearl', 'The Bund'],
  };
  useEffect(() => {
    Promise.all([
      getDictListByName('ECONOMY_TYPE'),
      // getRegionTree(),
    ]).then(res => {
      console.log(res)
      let setEconomicTypeArray = res[0].data.map(item => {
        return { value: item.code, label: item.value }
      })
      // console.log(setEconomicTypeArray)
      setEconomicType(setEconomicTypeArray)
      // setRegionTree(handleRegionTree(res[1].data))
      initBaseInfo()
    })
    form.setFieldsValue({
      tableData39: [{
        projectType: '1'
      }]
    })

  }, [])


  const onChange = (key) => {
    console.log(key);
  };

  const handleRegionTree = (list) => {
    list.map(item => {
      item.label = item.name
      item.value = item.code
      if (item.children) {
        item.children = handleRegionTree(item.children)
      }
    })
    return list;
  }
  const regionConfirm = (arr) => {
    if (arr.length < 3) {
      form.resetFields(['regionList'])
    }
  }
  const onFinish = async (values) => {
    try {
    } catch (err) {
    }
  }
  const initBaseInfo = async () => {
    let res = await getBaseInfo(getCookie('entCode'))
    console.log(res)
  }

  const onFinishFailed = () => {
  }
  const safeChange = (value) => {
    // console.log(value)
    const flag = value.toString().indexOf('其他') > -1 ? true : false
    if (flag) {
      setShowSafeInput(true)
    } else {
      setShowSafeInput(false)
    }
  }
  const onSafeInputBlur = (e) => {
    console.log(e)
    // setOtherSafe(e.target.value)
  }
  const setTableData = (data) => {
    form.setFieldsValue({
      tableData39: data
    })
  }
  const formItemLayout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 18,
    },
  };
  return (

    <div className='baseInfoDetails'>
      <Collapse defaultActiveKey={['1']} onChange={onChange} expandIconPosition='end'>
        <Panel header={BaseHeader('企业基本情况')} key="1" showArrow={false} collapsible='disabled'>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            {...formItemLayout}
            className='base-form'
          >

            <Form.Item label='企业注册名称' name='entRegisterName'
              rules={[{ required: true }]}>
              <Input placeholder='请输入' maxLength='128' disabled />
            </Form.Item>

            <Form.Item label='经济类型' name='economicType'
              rules={[{ required: true }]}
            >
              <Select
                placeholder="请选择经济类型"
                allowClear
              >
                {economicTypeList.map(item => {
                  return <Option key={item.value} value={item.value}>{item.label}</Option>
                })}
              </Select>
            </Form.Item>

            <Form.Item label='企业创办时间' name='entEstablishDatetime'
              rules={[{ required: true }]}
            >
              <DatePicker onChange={onChange} />
            </Form.Item>

            <Form.Item label="企业所在/省/市/区" name='regionList'
              rules={[{ required: true }]}
            >
              <Cascader options={regionTree}>
                {/* {value => value.length === 0 ?
                  <span className="input-tip">请选择</span> :
                  <span >{(value.map(item => item?.label)).join(' ')}</span>
                } */}
              </Cascader>
            </Form.Item>

            <Form.Item label="详细地址" name='address'
              rules={[{ required: true }]}>
              <Input placeholder='请输入详细地址' maxLength='99' />
            </Form.Item>

            <Form.Item label='企业职工人数' name='workersNumber'
              rules={[
                { required: true },
                // { pattern: positiveIntegerReg, message: '请输入正确的数值' },
              ]}>
              <Input placeholder='请输入' maxLength='9999999' />
            </Form.Item>

            <Form.Item label='厂区面积（㎡）' name='plantArea'
              rules={[
                { required: true },
                // { pattern: positiveIntegerRegPoint, message: '请输入正确的数值' },
              ]}
            >
              <Input placeholder='请输入' maxLength='99999999' />
            </Form.Item>

            <Form.Item label='企业法定代表人名称' name='legalPerson'
              rules={[{ required: true }]}>
              <Input placeholder='请输入' maxLength='64' disabled />
            </Form.Item>

            <Form.Item label='使用主要化工原料名称' name='useMainMaterialName'
              rules={[{ required: true }]}>
              <Input placeholder='请输入' maxLength='200' />
            </Form.Item>

            <Form.Item label='主要危险工序化学反应类型' name='mainDangerChemicalReactionType'
            >
              <Checkbox.Group
                onChange={onChange}
                options={[
                  { label: '光气及光气化工艺', value: '光气及光气化工艺' },
                  { label: '电解工艺(氯碱)', value: '电解工艺(氯碱)' },
                  { label: '氯化工艺', value: '氯化工艺' },
                  { label: '硝化工艺', value: '硝化工艺' },
                  { label: '合成氨工艺', value: '合成氨工艺' },
                  { label: '裂解(裂化)工艺', value: '裂解(裂化)工艺' },
                  { label: '氟化工艺', value: '氟化工艺' },
                  { label: '加氢工艺', value: '加氢工艺' },
                  { label: '重氮化工艺', value: '重氮化工艺' },
                  { label: '氧化工艺', value: '氧化工艺' },
                  { label: '过氧化工艺', value: '过氧化工艺' },
                  { label: '胺基化工艺', value: '胺基化工艺' },
                  { label: '磺化工艺', value: '磺化工艺' },
                  { label: '聚合工艺', value: '聚合工艺' },
                  { label: '烷基化工艺', value: '烷基化工艺' },
                  { label: '新型煤化工工艺', value: '新型煤化工工艺' },
                  { label: '电石生产工艺', value: '电石生产工艺' },
                  { label: '偶氮化工艺', value: '偶氮化工艺' },
                ]}
              />

            </Form.Item>

            <Form.Item label='现有的安全措施水平' name='safeMeasures'
            >
              <Checkbox.Group
                onChange={safeChange}

                options={[
                  { label: 'DCS控制', value: 'DCS控制' },
                  { label: '可编程序控制器', value: '可编程序控制器' },
                  { label: '经济停车系统', value: '经济停车系统' },
                  { label: '声光浓度报警', value: '声光浓度报警' },
                  { label: '温度压力液位超限报警', value: '温度压力液位超限报警' },
                  { label: '其他', value: '其他' },
                ]}
              />
            </Form.Item>
            {showSafeInput && <TextArea
              defaultValue={otherSafe}
              placeholder='请输入' maxLength='200'
              onBlur={onSafeInputBlur}
              style={{ padding: '12px 16px', margin: '-20px 0 20px 20%', width: '80%', }} />}

            <Form.Item label='反应放热程度' name='reactionExothermicDegree'>
              <Radio.Group>
                <Space>
                  <Radio value='mildExothermic'>轻度放热</Radio>
                  <Radio value='moderateExothermic'>中度放热</Radio>
                  <Radio value='severeExothermic'>剧烈放热</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item label='生产过程存在的危险有害因素' name='productionFactorsDanger'>
              <TextArea placeholder='请输入' maxLength='200' />
            </Form.Item>

          </Form>
        </Panel>
        {/* 执照情况 */}
        <Panel header={BaseHeader('执照情况')} key="2">
          <Collapse defaultActiveKey={['1']} expandIconPosition='end'>
            <Panel header={BaseHeader('企业工商营业执照')} key="1" className='inner-header'>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                {...formItemLayout}
                className='base-form'>
                <Form.Item label='发证单位' name='businessLicenseUnit'
                  rules={[{ required: true }]}>
                  <Input placeholder='请输入' maxLength='128' />
                </Form.Item>
                <Form.Item label='发证日期' name='businessLicenseDate'
                  rules={[{ required: true }]}
                >
                  <DatePicker>
                  </DatePicker>
                </Form.Item>
                <Form.Item label='有效期' name='businessLicenseExpire'
                  rules={[{ required: true }]}
                  onClick={(e, ref) => ref.current.open()}
                  trigger='onConfirm'>
                  <DatePicker>
                  </DatePicker>
                </Form.Item>
                <Form.Item label='证件号码' name='businessLicenseNumber'
                  rules={[
                    { required: true },
                    // { pattern: cardNumberRge, message: '请输入正确的证件号码' },
                  ]}>
                  <Input placeholder='请输入' />
                </Form.Item>
                <Form.Item label='许可证生产经营范围(生产规模)' name='businessLicenseArea'
                  rules={[{ required: true }]}>
                  <TextArea placeholder='请输入' maxLength='200' />
                </Form.Item>
              </Form>

            </Panel>
            <Panel header={BaseHeader('生产安全许可证')} key="99" className='inner-header'>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                {...formItemLayout}
                className='base-form'>
                <Form.Item label='发证单位' name='produceLicenseUnit'
                  rules={[{ required: true }]}>
                  <Input placeholder='请输入' maxLength='128' />
                </Form.Item>
                <Form.Item label='发证日期' name='produceLicenseDate'
                  rules={[{ required: true }]}
                >
                  <DatePicker>
                  </DatePicker>
                </Form.Item>
                <Form.Item label='有效期' name='produceLicenseExpire'
                  rules={[{ required: true }]}
                >
                  <DatePicker >
                  </DatePicker>
                </Form.Item>
                <Form.Item label='证件号码' name='produceLicenseNumber'
                  rules={[
                    { required: true },
                    // { pattern: cardNumberRge, message: '请输入正确的证件号码' },
                  ]}>
                  <Input placeholder='请输入' />
                </Form.Item>
                <Form.Item label='许可证生产经营范围(生产规模)' name='produceLicenseArea'
                  rules={[{ required: true }]}>
                  <TextArea placeholder='请输入' maxLength='200' />
                </Form.Item>
              </Form>


            </Panel>
            <Panel header={BaseHeader('危化品经营许可证')} key="981" className='inner-header'>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                {...formItemLayout}
                className='base-form'>
                <Form.Item label='发证单位' name='dangerLicenseUnit'
                  rules={[{ required: true }]}>
                  <Input placeholder='请输入' maxLength='128' />
                </Form.Item>
                <Form.Item label='发证日期' name='dangerLicenseDate'
                  rules={[{ required: true }]}
                >
                  <DatePicker >
                  </DatePicker>
                </Form.Item>
                <Form.Item label='有效期' name='dangerLicenseExpire'
                  rules={[{ required: true }]}
                >
                  <DatePicker >
                  </DatePicker>
                </Form.Item>
                <Form.Item label='证件号码' name='dangerLicenseNumber'
                  rules={[
                    { required: true },
                    // { pattern: cardNumberRge, message: '请输入正确的证件号码' },
                  ]}>
                  <Input placeholder='请输入' />
                </Form.Item>
                <Form.Item label='许可证生产经营范围(生产规模)' name='dangerLicenseArea'
                  rules={[{ required: true }]}>
                  <TextArea placeholder='请输入' maxLength='200' />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('从业人员分布情况')} key="3" className='inner-header'>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                wrapperCol={{ span: 24 }}
                className='base-form-add'>
                <Form.Item name="tableData39" valuePropName='dataSource'
                >
                  <AnswerTable setTableData={setTableData} />
                </Form.Item>
              </Form>
            </Panel>
          </Collapse>
        </Panel>

      </Collapse>
    </div>
  )
}
function BaseHeader(text) {
  return <div className="info-title">
    <span className='info-span'>*</span>
    <p>{text}</p>
  </div>
}
export default withRouter(BaseInfoDetails)
