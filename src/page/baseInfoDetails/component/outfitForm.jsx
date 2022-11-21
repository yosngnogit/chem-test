import React, {
  useEffect, useState, forwardRef,
  useImperativeHandle,
} from 'react'
import { RightOutlined } from '@ant-design/icons';
import { Collapse, Form, Input, Select, DatePicker, Checkbox, Radio, Space, Cascader, Spin, message } from 'antd';
// import { withRouter } from "react-router-dom";
import { getCookie } from '@/utils'
import { getRegionTree, getDictListByName } from '@/api/common'
import { positiveIntegerReg, positiveIntegerRegPoint, cardNumberRge } from '@/utils/reg'

import { getBaseInfo, saveUpdate } from '@/api/info'
import AnswerTable from './baseTable'

import moment from 'moment';
import '.././index.less'

let AccidenttForm = (props, ref) => {
  const { Panel } = Collapse;
  const { Option } = Select;
  const { TextArea } = Input;
  const [form] = Form.useForm()
  const [id, setId] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [showSafeInput, setShowSafeInput] = useState(false)
  const [economicTypeList, setEconomicType] = useState([])
  const [regionTree, setRegionTree] = useState([])
  const [otherSafe, setOtherSafe] = useState('')
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  useEffect(() => {
    setLoading(true)
    Promise.all([
      getDictListByName('ECONOMY_TYPE'),
      getRegionTree(),
    ]).then(res => {
      let setEconomicTypeArray = res[0].data.map(item => {
        return { value: item.code, label: item.value }
      })
      setEconomicType(setEconomicTypeArray)
      setRegionTree(handleRegionTree(res[1].data))
      initBaseInfo()
      setLoading(false)
    }).catch(err => {
      setLoading(false)
    })
  }, [])
  const handleRegionTree = (list) => {
    list.forEach(item => {
      item.label = item.name
      item.value = item.code
      if (item.children) {
        item.children = handleRegionTree(item.children)
      }
    })
    return list;
  }
  const onFinish = async (values) => {
    try {
      if (saveLoading) return
      setSaveLoading(true)
      let { regionList, safeMeasures, entEstablishDatetime, economicType, mainDangerChemicalReactionType, personDistributionSituation } = values
      let params = {
        entCode: getCookie('entCode'),
        ...values,
        economicType,
        provinceCode: regionList[0],
        city: regionList[1],
        area: regionList[2],
        other: otherSafe,
        safeMeasures: safeMeasures?.join(','),
        mainDangerChemicalReactionType: mainDangerChemicalReactionType?.join(','),
        entEstablishDatetime: entEstablishDatetime.format('YYYY-MM-DD'),
        certificatesSituation: [
          {
            certificatesName: '企业工商营业执照',
            issueUnit: values.businessLicenseUnit,
            issuingDate: values.businessLicenseDate.format('YYYY-MM-DD'),
            valid: values.businessLicenseExpire.format('YYYY-MM-DD'),
            certificatesCode: values.businessLicenseNumber,
            productionManageRange: values.businessLicenseArea
          }, {
            certificatesName: '安全生产许可证',
            issueUnit: values.produceLicenseUnit,
            issuingDate: values.produceLicenseDate.format('YYYY-MM-DD'),
            valid: values.produceLicenseExpire.format('YYYY-MM-DD'),
            certificatesCode: values.produceLicenseNumber,
            productionManageRange: values.produceLicenseArea
          }, {
            certificatesName: '危化品经营许可证',
            issueUnit: values.dangerLicenseUnit,
            issuingDate: values.dangerLicenseDate.format('YYYY-MM-DD'),
            valid: values.dangerLicenseExpire.format('YYYY-MM-DD'),
            certificatesCode: values.dangerLicenseNumber,
            productionManageRange: values.dangerLicenseArea
          }
        ],
        personDistributionSituation: personDistributionSituation || []
      }
      if (id) {
        params.id = id
      }
      setSaveLoading(false)
      await saveUpdate(params).then(res => {
        if (res.code === 0) message.success('保存成功'); setIsEdit(true)
      }).catch(err => {
        throw err
      })
    } catch (err) {
      setSaveLoading(false)
      setIsEdit(true)
      throw err
    }
  }
  const initBaseInfo = async () => {
    let res = await getBaseInfo(getCookie('entCode'))
    form.setFieldsValue({ entRegisterName: res.data.entRegisterName })
    form.setFieldsValue({ legalPerson: res.data.legalPerson })
    form.setFieldsValue({ produceName: '生产安全许可证' })
    form.setFieldsValue({ businessName: '企业工商营业执照' })
    form.setFieldsValue({ dangerName: '危化品经营许可证' })
    if (!res.data.id) return
    let {
      id,
      entRegisterName,
      economicType,
      entEstablishDatetime,
      provinceCode,
      city,
      area,
      address,
      workersNumber,
      plantArea,
      legalPerson,
      useMainMaterialName,
      mainDangerChemicalReactionType,
      safeMeasures,
      other,
      reactionExothermicDegree,
      productionFactorsDanger,
      certificatesSituationMap,
      personDistributionSituation
    } = res.data
    setId(id)
    if (safeMeasures?.indexOf('其他') > -1) {
      setShowSafeInput(true)
    } else {
      setShowSafeInput(false)
    }
    if (other) { setOtherSafe(other) }
    let business = certificatesSituationMap['企业工商营业执照']
    let produce = certificatesSituationMap['安全生产许可证']
    let danger = certificatesSituationMap['危化品经营许可证']
    let regionList = [provinceCode, city, area]
    let params = {
      entRegisterName,
      economicType,
      entEstablishDatetime: moment(entEstablishDatetime),
      regionList,
      address,
      workersNumber,
      plantArea,
      legalPerson,
      useMainMaterialName,
      mainDangerChemicalReactionType: mainDangerChemicalReactionType?.split(','),
      safeMeasures: safeMeasures?.split(','),
      reactionExothermicDegree: reactionExothermicDegree,
      productionFactorsDanger,
      businessLicenseUnit: business?.issueUnit,
      businessLicenseDate: business?.issuingDate && moment(business.issuingDate),
      businessLicenseExpire: business?.issuingDate && moment(business.valid),
      businessLicenseNumber: business?.certificatesCode,
      businessLicenseArea: business?.productionManageRange,

      produceLicenseUnit: produce?.issueUnit,
      produceLicenseDate: produce?.issuingDate && moment(produce.issuingDate),
      produceLicenseExpire: produce?.issuingDate && moment(produce.valid),
      produceLicenseNumber: produce?.certificatesCode,
      produceLicenseArea: produce?.productionManageRange,

      dangerLicenseUnit: danger?.issueUnit,
      dangerLicenseDate: produce?.issuingDate && moment(danger.issuingDate),
      dangerLicenseExpire: produce?.issuingDate && moment(danger.valid),
      dangerLicenseNumber: danger?.certificatesCode,
      dangerLicenseArea: danger?.productionManageRange,
    }
    // console.log(personDistributionSituation)
    if (personDistributionSituation.length === 0) {
      // console.log(params.personDistributionSituation)
      personDistributionSituation.push(
        {
          key: Math.random(),
          mainWorkTypeName: '',
          personNumber: '',
          holdCertificate: '',
        }
      )
      params.personDistributionSituation = personDistributionSituation
    } else {
      params.personDistributionSituation = personDistributionSituation.map(item => {
        item.key = Math.random()
        return item
      })
    }
    form.setFieldsValue(params)
  }
  const onFinishFailed = () => {
    message.warning('请检查并完成必填项');
  }
  const safeChange = (value) => {
    const flag = value.toString().indexOf('其他') > -1 ? true : false
    if (flag) {
      setShowSafeInput(true)
    } else {
      setShowSafeInput(false)
    }
  }
  const onSafeInputBlur = (e) => {
    setOtherSafe(e.target.value)
  }
  const setTableData = (data) => {
    form.setFieldsValue({
      personDistributionSituation: data
    })
  }
  const formItemLayout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const onCallback = () => {
    form.submit()
  }
  useImperativeHandle(ref, () => ({
    // onCallback 就是暴露给父组件的方法
    onCallback
  }));
  const genEditExtra = () => (
    <div
      className='panel-btn'
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
        // form.submit()
        setIsEdit(false)
        props.setEdit(true)
      }}
    >编辑</div>
  );
  const genSaveExtra = () => (
    // <div className='' onClick={() => form.submit()} >111111</div>
    <div
      className='panel-btn'
      onClick={(event) => {
        // If you don't want click extra trigger collapse, you can prevent this:
        event.stopPropagation();
        form.submit()
        props.setEdit(false)
      }}
    >保存</div>
  );
  return (
    <Spin spinning={loading}>
      <Collapse defaultActiveKey={['1', '2']} expandIconPosition='end'
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
        <Panel header={BaseHeader('企业消防设施器材、应急救援器材装备登记表')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            {...formItemLayout}
            disabled={isEdit}
            className='base-form'
          >
            <Form.Item label='企业注册名称' name='entRegisterName'
              rules={[{ required: true }]}>
              <Input maxLength='128' disabled />
            </Form.Item>

            <Form.Item label='经济类型' name='economicType'
              rules={[{ required: true }]}
            >
              <Select
                placeholder="请选择经济类型"
              >
                {economicTypeList.map(item => {
                  return <Option key={item.value} value={item.value}>{item.label}</Option>
                })}
              </Select>
            </Form.Item>

            <Form.Item label='企业创办时间' name='entEstablishDatetime'
              rules={[{ required: true }]}
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item label="企业所在/省/市/区" name='regionList'
              rules={[{ required: true }]}
            >
              <Cascader options={regionTree}>
              </Cascader>
            </Form.Item>

            <Form.Item label="详细地址" name='address'
              rules={[{ required: true }]}>
              <Input placeholder='请输入详细地址' maxLength='128' />
            </Form.Item>

            <Form.Item label='企业职工人数' name='workersNumber'
              rules={[
                { required: true },
                { pattern: positiveIntegerReg, message: '请输入正确的数值' },
              ]}>
              <Input placeholder='请输入企业职工人数' maxLength='9999999' />
            </Form.Item>

            <Form.Item label='厂区面积（㎡）' name='plantArea'
              rules={[
                { required: true },
                { pattern: positiveIntegerRegPoint, message: '请输入正确的数值' },
              ]}
            >
              <Input placeholder='请输入厂区面积' maxLength='99999999' />
            </Form.Item>
            <Form.Item label='企业法定代表人名称' name='legalPerson'
              rules={[{ required: true }]}>
              <Input maxLength='64' disabled />
            </Form.Item>
            <Form.Item label='使用主要化工原料名称' name='useMainMaterialName'
              rules={[{ required: true }]}>
              <Input placeholder='请输入使用主要化工原料名称' maxLength='200' />
            </Form.Item>
            <Form.Item label='主要危险工序化学反应类型' name='mainDangerChemicalReactionType'
            >
              <Checkbox.Group
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
              showCount
              onBlur={onSafeInputBlur}
              style={{ padding: '12px 16px', margin: '-20px 0 20px 31%', width: '71%' }} />}
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
              <TextArea placeholder='请输入生产过程存在的危险有害因素' maxLength='200' showCount />
            </Form.Item>
          </Form>
        </Panel>
        {/* 执照情况 */}
        <Panel header={BaseHeader('执照情况')} key="2" forceRender>
          <Collapse expandIconPosition='end' defaultActiveKey={['3']}
            expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
            <Panel header={BaseHeader('企业工商营业执照')} key="3" className='inner-header' forceRender>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                {...formItemLayout}
                disabled={isEdit}
                className='base-form'>
                <Form.Item label='证件名称' name='businessName'
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item label='发证单位' name='businessLicenseUnit'
                  rules={[{ required: true }]}>
                  <Input placeholder='请输入发证单位' maxLength='128' />
                </Form.Item>
                <Form.Item label='发证日期' name='businessLicenseDate'
                  rules={[{ required: true }]}
                >
                  <DatePicker>
                  </DatePicker>
                </Form.Item>
                <Form.Item label='有效期' name='businessLicenseExpire'
                  rules={[{ required: true }]}
                >
                  <DatePicker>
                  </DatePicker>
                </Form.Item>
                <Form.Item label='证件号码' name='businessLicenseNumber'
                  rules={[
                    { required: true },
                    { pattern: cardNumberRge, message: '请输入正确的证件号码' },
                  ]}>
                  <Input placeholder='请输入证件号码' />
                </Form.Item>
                <Form.Item label='许可证生产经营范围(生产规模)' name='businessLicenseArea'
                  rules={[{ required: true }]}>
                  <TextArea placeholder='请输入许可证生产经营范围(生产规模)' maxLength='200' showCount />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('生产安全许可证')} key="4" className='inner-header' forceRender>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                {...formItemLayout}
                disabled={isEdit}
                className='base-form'>
                <Form.Item label='证件名称' name='produceName'
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item label='发证单位' name='produceLicenseUnit'
                  rules={[{ required: true }]}>
                  <Input placeholder='请输入发证单位' maxLength='128' />
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
                    { pattern: cardNumberRge, message: '请输入正确的证件号码' },
                  ]}>
                  <Input placeholder='请输入证件号码' />
                </Form.Item>
                <Form.Item label='许可证生产经营范围(生产规模)' name='produceLicenseArea'
                  rules={[{ required: true }]}>
                  <TextArea placeholder='请输入许可证生产经营范围(生产规模)' maxLength='200' showCount />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('危化品经营许可证')} key="5" className='inner-header' forceRender>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                {...formItemLayout}
                disabled={isEdit}
                className='base-form'>
                <Form.Item label='证件名称' name='dangerName'
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item label='发证单位' name='dangerLicenseUnit'
                  rules={[{ required: true }]}>
                  <Input placeholder='请输入发证单位' maxLength='128' />
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
                    { pattern: cardNumberRge, message: '请输入正确的证件号码' },
                  ]}>
                  <Input placeholder='请输入证件号码' />
                </Form.Item>
                <Form.Item label='许可证生产经营范围(生产规模)' name='dangerLicenseArea'
                  rules={[{ required: true }]}>
                  <TextArea placeholder='请输入许可证生产经营范围(生产规模)' maxLength='200' showCount />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('从业人员分布情况')} key="6" className='inner-header' forceRender>
              <p className='form-tip'>注：填写企业主要工种如（电工、电焊工、厂内车辆驾驶员，眼里容器操作工、安全员等）</p>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                wrapperCol={{ span: 24 }}
                disabled={isEdit}
                className='base-form-add'>
                <Form.Item name="personDistributionSituation" valuePropName='dataSource'
                >
                  <AnswerTable setTableData={setTableData} />
                </Form.Item>
              </Form>
            </Panel>
          </Collapse>
        </Panel>
      </Collapse>
    </Spin>

  )
}
function BaseHeader(text) {
  return <div className="info-title">
    <span className='info-span'>*</span>
    <p>{text}</p>
  </div>
}
export default forwardRef(AccidenttForm)
