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

import { getObtainEvidenceForm, saveObtainEvidenceForm } from '@/api/info'
import AnswerTable from './obtainEvidenceTable'

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

    initBaseInfo()

  }, [])

  const onFinish = async (values) => {

    try {
      const timeArray = JSON.parse(JSON.stringify([...values.tableForensicRecord]))
      timeArray.forEach(item => {
        item.entCode = getCookie('entCode')
        if (item.trainDate) {
          item.trainDate = moment(item.trainDate).format('YYYY-MM-DD')
        }
        if (item.issuingDate) {
          item.issuingDate = moment(item.issuingDate).format('YYYY-MM-DD')
        }
        if (item.trainDate) {
          item.reviewDate = moment(item.reviewDate).format('YYYY-MM-DD')
        }
      })
      if (saveLoading) return
      setSaveLoading(true)
      await saveObtainEvidenceForm(timeArray).then(res => {
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
    try {
      let res = await getObtainEvidenceForm(getCookie('entCode'))
      let tableForensicRecord = res.data
      if (tableForensicRecord.length === 0) {
        tableForensicRecord.push(
          {
            key: Math.random(),
            name: '',
            sex: '',
            post: '',
            trainDate: '',
            testScores: '',
            // 缺少发证部门
            issuingDate: '',
            certificateNumber: '',
            reviewDate: '',
            remark: ''
          }
        )
      } else {
        tableForensicRecord.map(item => {
          item.key = Math.random()
          if (item.trainDate !== '') item.trainDate = (moment(item.trainDate, 'YYYY-MM-DD'))
          if (item.issuingDate !== '') item.issuingDate = (moment(item.issuingDate, 'YYYY-MM-DD'))
          if (item.reviewDate !== '') item.reviewDate = (moment(item.reviewDate, 'YYYY-MM-DD'))
          return item
        })
      }
      form.setFieldsValue({
        tableForensicRecord: tableForensicRecord
      })
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)

    }

  }
  const onFinishFailed = () => {
    message.warning('请检查并完成必填项');
  }
  const setTableData = (data) => {
    form.setFieldsValue({
      tableForensicRecord: data
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
        <Panel header={BaseHeader('企业主要负责人、安全管理人员安全生产管理资格培训取证记录')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            className='base-form-add'
          >
            <Form.Item name="tableForensicRecord" valuePropName='dataSource'
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
