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

import { getLedgerForm, saveLedgerForm } from '@/api/info'
import AnswerTable from './ledgerTable'

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
      const timeArray = JSON.parse(JSON.stringify([...values.personDistributionSituation]))
      timeArray.forEach(item => {
        if (item.exfactoryDate) {
          item.exfactoryDate = moment(item.exfactoryDate).format('YYYY-MM-DD')
        }
        if (item.purchaseDatetime) {
          item.purchaseDatetime = moment(item.purchaseDatetime).format('YYYY-MM-DD')
        }
        if (item.maintainDatetime) {
          item.maintainDatetime = moment(item.maintainDatetime).format('YYYY-MM-DD HH:mm:ss')
        }
      })
      if (saveLoading) return
      setSaveLoading(true)

      setSaveLoading(false)
      await saveLedgerForm(getCookie('entCode'), timeArray).then(res => {
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
    let res = await getLedgerForm(getCookie('entCode'))
    let personDistributionSituation = res.data
    // console.log(personDistributionSituation)
    if (personDistributionSituation.length === 0) {
      // console.log(params.personDistributionSituation)
      personDistributionSituation.push(
        {
          key: Math.random(),
          equipmentName: '',
          specification: '',
          manufacturerUnit: '',
          exfactoryDate: '',
          purchaseDatetime: '',
          manageLiablePerson: '',
          maintainDatetime: '',
          maintainDetail: ''
        }
      )
    } else {
      personDistributionSituation.map(item => {
        item.key = Math.random()
        if (item.exfactoryDate) item.exfactoryDate = (moment(item.exfactoryDate, 'YYYY-MM-DD'))
        else item.exfactoryDate = ''
        if (item.purchaseDatetime) item.purchaseDatetime = (moment(item.purchaseDatetime, 'YYYY-MM-DD'))
        else item.purchaseDatetime = ''
        if (item.maintainDatetime) item.maintainDatetime = (moment(item.maintainDatetime, 'YYYY-MM-DD HH:mm:ss'))
        else item.maintainDatetime = ''
        return item
      })
    }
    form.setFieldsValue({
      personDistributionSituation: personDistributionSituation
    })
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
        <Panel header={BaseHeader('安全设备设施登记使用管理台账')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
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
