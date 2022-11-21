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
import AnswerTable from './rescueTable'

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
        <Panel header={BaseHeader('企业应急救援管理机构、人员统计表')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            className='base-form-add'
          >
            <Form.Item name="personDistributionSituation" valuePropName='dataSource'
            >
              <AnswerTable setTableData={setTableData} />
            </Form.Item>
          </Form>
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
