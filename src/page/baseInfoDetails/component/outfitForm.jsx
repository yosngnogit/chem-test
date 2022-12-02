import React, {
  useEffect, useState, forwardRef,
  useImperativeHandle,
} from 'react'
import { RightOutlined } from '@ant-design/icons';
import { Collapse, Form, Input, Cascader, Spin, message } from 'antd';
// import { withRouter } from "react-router-dom";
import { getCookie } from '@/utils'
import { getRegionTree } from '@/api/common'
import { tellReg } from '@/utils/reg'

import { getOutfitForm, saveOutfitForm } from '@/api/info'
import AnswerTable1 from './outfitTable1'
import AnswerTable2 from './outfitTable2'

import '.././index.less'

let AccidenttForm = (props, ref) => {
  const { Panel } = Collapse;
  const [form] = Form.useForm()
  const [saveLoading, setSaveLoading] = useState(false)
  const [regionTree, setRegionTree] = useState([])
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  useEffect(() => {
    setLoading(true)
    Promise.all([
      getRegionTree(),
    ]).then(res => {
      setRegionTree(handleRegionTree(res[0].data))
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
      let { regionList, economicType, tableRescueTeamAddressDetailVoList, tableMedicalEquipmentDetailVoList } = values
      let params = {
        entCode: getCookie('entCode'),
        ...values,
        economicType,
        provinceCode: regionList[0],
        city: regionList[1],
        area: regionList[2],
        tableRescueTeamAddressDetailVoList: tableRescueTeamAddressDetailVoList || [],
        tableMedicalEquipmentDetailVoList: tableMedicalEquipmentDetailVoList || []
      }

      await saveOutfitForm(params).then(res => {
        if (res.code === 0) {
          message.success('保存成功');
          setIsEdit(true)
          setSaveLoading(false)
          initBaseInfo()
        }
      }).catch(err => {
        setSaveLoading(false)
        throw err
      })
    } catch (err) {
      setSaveLoading(false)
      setIsEdit(true)
      throw err
    }
  }
  const initBaseInfo = async () => {
    let res = await getOutfitForm(getCookie('entCode'))
    // console.log(res)
    let {
      provinceCode,
      city,
      area,
      address,
      telephone,
      tableRescueTeamAddressDetailVoList,
      tableMedicalEquipmentDetailVoList
    } = res.data

    let regionList = []
    if (provinceCode) regionList.push(provinceCode)
    if (city) regionList.push(city)
    if (area) regionList.push(area)
    console.log(regionList)
    let params = {
      regionList,
      address,
      telephone
    }
    // console.log(tableRescueTeamAddressDetailVoList)
    if (!tableRescueTeamAddressDetailVoList) {
      // console.log(params.tableRescueTeamAddressDetailVoList)
      tableRescueTeamAddressDetailVoList = []
      tableRescueTeamAddressDetailVoList.push(
        {
          key: Math.random(),
          name: '',
          sex: '',
          telephone: '',
          rescueWorkPost: '',
          liableDivide: '',
          remark: ''
        }
      )
      params.tableRescueTeamAddressDetailVoList = tableRescueTeamAddressDetailVoList
    } else {
      params.tableRescueTeamAddressDetailVoList = tableRescueTeamAddressDetailVoList.map(item => {
        item.key = Math.random()
        return item
      })
    }
    if (!tableMedicalEquipmentDetailVoList) {
      tableMedicalEquipmentDetailVoList = []
      // console.log(params.tableRescueTeamAddressDetailVoList)
      tableMedicalEquipmentDetailVoList.push(
        {
          key: Math.random(),
          name: '',
          number: '',
          specification: '',
          storageLocation: '',
          maintainOrValid: '',
          purpose: '',
          liablePerson: '',
          remark: '',
        }
      )
      params.tableMedicalEquipmentDetailVoList = tableMedicalEquipmentDetailVoList
    } else {
      params.tableMedicalEquipmentDetailVoList = tableMedicalEquipmentDetailVoList.map(item => {
        item.key = Math.random()
        return item
      })
    }
    form.setFieldsValue(params)
  }
  const onFinishFailed = () => {
    message.warning('请检查并完成必填项');
  }

  const setTableData1 = (data) => {
    form.setFieldsValue({
      tableRescueTeamAddressDetailVoList: data
    })
  }
  const setTableData2 = (data) => {
    form.setFieldsValue({
      tableMedicalEquipmentDetailVoList: data
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
      <Collapse
        defaultActiveKey={['1', '2']} expandIconPosition='end'
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
        <Panel header={BaseHeader('企业医疗救护组织、人员、装备和药物登记表')} key="1"
          showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            {...formItemLayout}
            disabled={isEdit}
            className='base-form'
          >
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
            <Form.Item label="电话" name='telephone'
              rules={[
                { required: true },
                { pattern: tellReg, message: '请输入正确的号码' },
              ]}>
              <Input placeholder='请输入电话' maxLength='128' />
            </Form.Item>

          </Form>
        </Panel>
        <Panel header={BaseHeader('医疗救护组人员')} key="2" forceRender>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            className='base-form-add'
          >
            <Form.Item name="tableRescueTeamAddressDetailVoList" valuePropName='dataSource'
            >
              <AnswerTable1 setTableData={setTableData1} />
            </Form.Item>
          </Form>
        </Panel>
        <Panel header={BaseHeader('医疗装备和药物')} key="3" forceRender>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            className='base-form-add'
          >
            <Form.Item name="tableMedicalEquipmentDetailVoList" valuePropName='dataSource'
            >
              <AnswerTable2 setTableData={setTableData2} />
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
