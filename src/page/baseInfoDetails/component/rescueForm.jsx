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

import { getRescueForm, saveRescueForm } from '@/api/info'
import AnswerTable from './rescueTable'

import moment from 'moment';
import '.././index.less'
let AccidenttForm = (props, ref) => {
  const { Panel } = Collapse;
  const [form] = Form.useForm()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [tableObj, setTableObj] = useState({
    leader: 'AnswerTable1',
    expert: 'AnswerTable2',
    office: 'AnswerTable3',
    pluralismt: 'AnswerTable4'
  });

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
    if (isEdit) initBaseInfo()
  }, [isEdit])

  const onFinish = async (values) => {
    try {
      let paramsArray = []
      paramsArray = [...values.AnswerTable1, ...values.AnswerTable2, ...values.AnswerTable3, ...values.AnswerTable4]
      if (saveLoading) return
      console.log(paramsArray)
      paramsArray = paramsArray.filter(v => v.type !== '')
      setSaveLoading(true)
      await saveRescueForm(getCookie('entCode'), paramsArray).then(res => {
        if (res.code === 0) message.success('保存成功'); setIsEdit(true)
        setSaveLoading(false)
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
    let res = await getRescueForm(getCookie('entCode'))
    let personDistributionSituation = res.data
    let AnswerTable = []
    let params = {
      AnswerTable1: [],
      AnswerTable2: [],
      AnswerTable3: [],
      AnswerTable4: []
    }
    // console.log(personDistributionSituation)
    if (personDistributionSituation.length === 0) {
      AnswerTable.push(
        {
          key: Math.random(),
          name: '',
          emergencyWork: '',
          post: '',
          liableDivide: '',
          telephone: '',
          type: ''
        }
      )
      params.AnswerTable1 = params.AnswerTable2 = params.AnswerTable3 = params.AnswerTable4 = AnswerTable
    } else {
      personDistributionSituation.map(item => {
        item.key = Math.random()
        if (item.type === 'leader') params.AnswerTable1.push(item)
        else params.AnswerTable1.push({
          key: Math.random(),
          name: '',
          number: '',
          specification: '',
          storageLocation: '',
          maintainOrValid: '',
          purpose: '',
          liablePerson: '',
          type: 'leader'
        })
        if (item.type === 'expert') params.AnswerTable2.push(item)
        else params.AnswerTable2.push({
          key: Math.random(),
          name: '',
          number: '',
          specification: '',
          storageLocation: '',
          maintainOrValid: '',
          purpose: '',
          liablePerson: '',
          type: 'expert'
        })
        if (item.type === 'office') params.AnswerTable3.push(item)
        else params.AnswerTable3.push({
          key: Math.random(),
          name: '',
          number: '',
          specification: '',
          storageLocation: '',
          maintainOrValid: '',
          purpose: '',
          liablePerson: '',
          type: 'office'
        })
        if (item.type === 'pluralismt') params.AnswerTable4.push(item)
        else params.AnswerTable4.push({
          key: Math.random(),
          name: '',
          number: '',
          specification: '',
          storageLocation: '',
          maintainOrValid: '',
          purpose: '',
          liablePerson: '',
          type: 'pluralismt'
        })
        return item
      })
    }
    form.setFieldsValue(params)
  }
  const onFinishFailed = () => {
    message.warning('请检查并完成必填项');
  }
  const setTableData = (data, type) => {
    form.setFieldValue(
      tableObj[type], data
    )
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
        <Panel header={BaseHeader('企业应急救援管理机构、人员统计表')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <Collapse expandIconPosition='end' defaultActiveKey={['8']}
            expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
            <Panel header={BaseHeader('应急管理领导小组')} key="8" className='inner-header' forceRender>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                disabled={isEdit}
                className='base-form-add'>
                <Form.Item name="AnswerTable1" valuePropName='dataSource'
                >
                  <AnswerTable setTableData={setTableData} tableType='leader' />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('应急救援专家')} key="9" className='inner-header' forceRender>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                disabled={isEdit}
                className='base-form-add'>
                <Form.Item name="AnswerTable2" valuePropName='dataSource'
                >
                  <AnswerTable setTableData={setTableData} tableType='expert' />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('应急救援管理办公室')} key="10" className='inner-header' forceRender>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                disabled={isEdit}
                className='base-form-add'>
                <Form.Item name="AnswerTable3" valuePropName='dataSource'
                >
                  <AnswerTable setTableData={setTableData} tableType='office' />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('应急救援兼职队员')} key="11" className='inner-header' forceRender>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                disabled={isEdit}
                className='base-form-add'>
                <Form.Item name="AnswerTable4" valuePropName='dataSource'
                >
                  <AnswerTable setTableData={setTableData} tableType='pluralismt' />
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
