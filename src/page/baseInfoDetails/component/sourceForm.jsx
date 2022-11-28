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

import { saveSourceForm, getSourceForm } from '@/api/info'
import AnswerTable from './sourceTable'

import moment from 'moment';
import '.././index.less'

let SourceForm = (props, ref) => {
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
    if (isEdit) initBaseInfo()
  }, [isEdit])
  const onFinish = async (values) => {
    try {
      if (saveLoading) return
      setSaveLoading(true)
      console.log(values)
      values.tableDangerSourceMonitorManageRegister.map(item => {
        item.entCode = getCookie('entCode')
        return item
      })
      // let { regionList, safeMeasures, entEstablishDatetime, economicType, mainDangerChemicalReactionType, personDistributionSituation } = values
      let params = {
        // entCode: getCookie('entCode'),
        ...values,
      }
      if (id) {
        params.id = id
      }
      // console.log(params)
      setSaveLoading(false)
      await saveSourceForm(params).then(res => {
        console.log(res)
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
    let res = await getSourceForm(getCookie('entCode'))
    console.log(res)
    form.setFieldsValue({
      tableDangerSourceMonitorManageRegister: [
        {
          key: 0,
          unitName: '',
          dangerPosition: '',
          level: '',
          inPosition: '',
          levelJudgeMechanismName: '',
          riskFactors: '',
          possibleDanger: '',
          mainLiablePerson: '',
          monitorLiablePerson: '',
          detection: '',
          assessment: ''
        }
      ]
    })

    // form.setFieldsValue(params)
  }
  const onFinishFailed = () => {
    message.warning('请检查并完成必填项');
  }
  const setTableData = (data) => {
    // console.log(first)
    form.setFieldsValue({
      tableDangerSourceMonitorManageRegister: data
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
        collapsible="header"
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
        <Panel header={BaseHeader('危险源（点）监控管理表')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            className='base-form-add'
          >
            <Form.Item name="tableDangerSourceMonitorManageRegister" valuePropName='dataSource'
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
export default forwardRef(SourceForm)
