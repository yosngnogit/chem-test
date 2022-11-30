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

import { getCertificateForm, saveCertificateForm } from '@/api/info'
import AnswerTable from './certificateTable'

import moment from 'moment';
import '.././index.less'

let ProductionSafetyForm = (props, ref) => {
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
    // setLoading(true)
    // Promise.all([
    //   getDictListByName('ECONOMY_TYPE'),
    //   getRegionTree(),
    // ]).then(res => {
    //   let setEconomicTypeArray = res[0].data.map(item => {
    //     return { value: item.code, label: item.value }
    //   })
    //   setEconomicType(setEconomicTypeArray)
    //   setRegionTree(handleRegionTree(res[1].data))
    //   setLoading(false)
    // }).catch(err => {
    //   setLoading(false)
    // })
    initBaseInfo()

  }, [])

  const onFinish = async (values) => {
    try {
      const timeArray = JSON.parse(JSON.stringify([...values.personDistributionSituation]))
      timeArray.forEach(item => {
        item.entCode = getCookie('entCode')
        if (item.birthday) {
          item.birthday = moment(item.birthday).format('YYYY-MM-DD')
        }
        if (item.trainingTime) {
          item.trainingTime = moment(item.trainingTime).format('YYYY-MM-DD')
        }
        if (item.reviewTime) {
          item.reviewTime = moment(item.reviewTime).format('YYYY-MM-DD')
        }
      })
      if (saveLoading) return
      setSaveLoading(true)

      await saveCertificateForm(getCookie('entCode'), timeArray).then(res => {
        setSaveLoading(false)

        if (res.code === 0) message.success('保存成功'); setIsEdit(true)
      }).catch(err => {
        setSaveLoading(false)
        setIsEdit(true)
        throw err
      })
    } catch (err) {
      setSaveLoading(false)
      setIsEdit(true)
      throw err
    }
  }
  const initBaseInfo = async () => {
    let res = await getCertificateForm(getCookie('entCode'))
    console.log(1111, res)
    let personDistributionSituation = res.data
    // console.log(personDistributionSituation)
    if (personDistributionSituation.length === 0) {
      // console.log(params.personDistributionSituation)
      personDistributionSituation.push(
        {
          key: Math.random(),
          name: '',
          sex: '',
          birthday: '',
          workingSeniority: '',
          currentPosition: '',
          thisPostSeniority: '',
          trainingTime: '',
          reviewTime: '',
          issueUnit: '',
          operationCertificateNumber: '',
          cardNumber: ''
        }
      )
    } else {
      personDistributionSituation.map(item => {
        item.key = Math.random()
        if (item.birthday !== '') item.birthday = (moment(item.birthday, 'YYYY-MM-DD'))
        if (item.trainingTime !== '') item.trainingTime = (moment(item.trainingTime, 'YYYY-MM-DD'))
        if (item.reviewTime !== '') item.reviewTime = (moment(item.reviewTime, 'YYYY-MM-DD'))
        return item
      })
    }
    form.setFieldsValue({
      personDistributionSituation:personDistributionSituation
    })
  }
  const onFinishFailed = () => {
    message.warning('请检查并完成必填项');
  }
  const setTableData = (data) => {
    form.setFieldsValue({
      personDistributionSituation: data
    })
  }
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
        <Panel header={BaseHeader('特种作业人员培训、考核、持证登记表')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
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
export default forwardRef(ProductionSafetyForm)
