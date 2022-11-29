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

import { getProductionSafetyForm, saveProductionSafetyForm } from '@/api/info'
import AnswerTable from './productionSafetyTable'

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
    setLoading(true)
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
    console.log(values)
    const timeArray = JSON.parse(JSON.stringify([...values.tableMechanismMemberDetailsVoList]))
    timeArray.forEach(item => {
      if (item.appointmentTime) {
        item.appointmentTime = moment(item.appointmentTime).format('YYYY-MM-DD')
      }
    })
    try {
      if (saveLoading) return
      setSaveLoading(true)
      let { unitName,
        mainLiablePerson,
        entEstablishDatetime,
        safeMechanismName,
        departmentNumber,
        workshopNumber,
        teamNumber,
        workersNumber,
        safetyOfficerNumber,
        tableMechanismMemberDetailsVoList } = values
      let params = {
        entCode: getCookie('entCode'),
        ...values,
        unitName,
        mainLiablePerson,
        entEstablishDatetime,
        safeMechanismName,
        departmentNumber,
        workshopNumber,
        teamNumber,
        workersNumber,
        safetyOfficerNumber,
        tableMechanismMemberDetailsVoList
      }
      if (id) {
        params.id = id
      }
      setSaveLoading(false)
      await saveProductionSafetyForm(params).then(res => {
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
    try {
      let res = await getProductionSafetyForm(getCookie('entCode'))
      if (res.code === -1) setLoading(false)
      if (!res.data.id) return
      let {
        id,
        unitName,
        mainLiablePerson,
        entEstablishDatetime,
        safeMechanismName,
        departmentNumber,
        workshopNumber,
        teamNumber,
        workersNumber,
        safetyOfficerNumber,
        tableMechanismMemberDetailsVoList
      } = res.data
      setId(id)

      let params = {
        unitName,
        mainLiablePerson,
        entEstablishDatetime,
        safeMechanismName,
        departmentNumber,
        workshopNumber,
        teamNumber,
        workersNumber,
        safetyOfficerNumber,
        tableMechanismMemberDetailsVoList
      }
      // console.log(personDistributionSituation)
      if (tableMechanismMemberDetailsVoList.length === 0) {
        // console.log(params.personDistributionSituation)
        tableMechanismMemberDetailsVoList.push(
          {
            key: Math.random(),
            mainWorkTypeName: '',
            personNumber: '',
            holdCertificate: '',
          }
        )
        params.tableMechanismMemberDetailsVoList = tableMechanismMemberDetailsVoList
      } else {
        params.tableMechanismMemberDetailsVoList = tableMechanismMemberDetailsVoList.map(item => {
          item.key = Math.random()
          if (item.appointmentTime !== '') item.appointmentTime = (moment(item.appointmentTime, 'YYYY-MM-DD'))
          return item
        })
      }
      form.setFieldsValue(params)
    } catch (err) {
      form.setFieldsValue({
        tableMechanismMemberDetailsVoList: [{
          key: 0,
          appointmentTime: '',
          memberName: '',
          education: '',
          post: '',
          title: '',
          remark: ''
        }]
      })
      setLoading(false)
      throw err
    }
  }
  const onFinishFailed = () => {
    message.warning('请检查并完成必填项');
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
      <Collapse defaultActiveKey={['1']} expandIconPosition='end'
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
        <Panel header={BaseHeader('安全生产组织机构登记表')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            {...formItemLayout}
            className='base-form'
          >
            <Form.Item label='单位名称' name='unitName'
              rules={[{ required: false }]}>
              <Input maxLength='128' />
            </Form.Item>
            <Form.Item label='主要负责人' name='mainLiablePerson'
              rules={[{ required: false }]}>
              <Input maxLength='64' />
            </Form.Item>
            <Form.Item label='安全机构名称' name='safeMechanismName'
              rules={[{ required: false }]}>
              <Input maxLength='128' />
            </Form.Item>
            <Form.Item label='科室数（个）' name='departmentNumber'
              rules={[
                { required: false },
                { pattern: positiveIntegerReg, message: '请输入正确的数值' }]}>
              <Input />
            </Form.Item>
            <Form.Item label='车间数（个）' name='workshopNumber'
              rules={[
                { required: false },
                { pattern: positiveIntegerReg, message: '请输入正确的数值' }]}>
              <Input />
            </Form.Item>
            <Form.Item label='班组数（个）' name='teamNumber'
              rules={[
                { required: false },
                { pattern: positiveIntegerReg, message: '请输入正确的数值' }]}>
              <Input />
            </Form.Item>
            <Form.Item label='职工总数数（名）' name='workersNumber'
              rules={[
                { required: false },
                { pattern: positiveIntegerReg, message: '请输入正确的数值' }]}>
              <Input />
            </Form.Item>
            <Form.Item label='专兼职安全员（名）' name='safetyOfficerNumber'
              rules={[
                { required: false },
                { pattern: positiveIntegerReg, message: '请输入正确的数值' }]}>
              <Input />
            </Form.Item>

          </Form>
        </Panel>
        <Panel header={BaseHeader('组织机构成成员概况')} key="2" forceRender>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            className='base-form-add'
          >
            <Form.Item name="tableMechanismMemberDetailsVoList" valuePropName='dataSource'
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
