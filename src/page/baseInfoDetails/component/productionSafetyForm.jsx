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
    if (isEdit) initBaseInfo()
  }, [isEdit])
  const onFinish = async (values) => {
    try {
      const timeArray = JSON.parse(JSON.stringify([...values.tableMechanismMemberDetailsFormList]))
      timeArray.forEach(item => {
        if (item.appointmentTime) {
          item.appointmentTime = moment(item.appointmentTime).format('YYYY-MM-DD')
        }
      })
      values.tableMechanismMemberDetailsFormList = timeArray
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
        tableMechanismMemberDetailsFormList } = values
      let params = {
        entCode: getCookie('entCode'),
        unitName,
        mainLiablePerson,
        entEstablishDatetime,
        safeMechanismName,
        departmentNumber,
        workshopNumber,
        teamNumber,
        workersNumber,
        safetyOfficerNumber,
        tableMechanismMemberDetailsFormList
      }
      await saveProductionSafetyForm(params).then(res => {
        if (res.code === 0) message.success('保存成功'); setIsEdit(true)
        setSaveLoading(false)

      }).catch(err => {
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
    setLoading(true)
    try {
      let res = await getProductionSafetyForm(getCookie('entCode'))
      if (res.code === -1) setLoading(false)
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
        tableMechanismMemberDetailsFormList
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
        tableMechanismMemberDetailsFormList
      }
      // console.log(personDistributionSituation)
      if (!tableMechanismMemberDetailsFormList) {
        // console.log(params.personDistributionSituation)
        tableMechanismMemberDetailsFormList = []
        tableMechanismMemberDetailsFormList.push(
          {
            key: Math.random(),
            appointmentTime: '',
            memberName: '',
            education: '',
            post: '',
            title: '',
            remark: ''
          }
        )
        params.tableMechanismMemberDetailsFormList = tableMechanismMemberDetailsFormList
      } else {
        params.tableMechanismMemberDetailsFormList = tableMechanismMemberDetailsFormList.map(item => {
          item.key = Math.random()
          if (item.appointmentTime) item.appointmentTime = (moment(item.appointmentTime, 'YYYY-MM-DD'))
          return item
        })
      }
      form.setFieldsValue(params)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      throw err
    }
  }
  const onFinishFailed = () => {
    message.warning('请检查并完成必填项');
  }
  const setTableData = (data) => {
    form.setFieldsValue({
      tableMechanismMemberDetailsFormList: data
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
            <Form.Item name="tableMechanismMemberDetailsFormList" valuePropName='dataSource'
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
