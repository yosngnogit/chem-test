import React, {
  useEffect, useState, forwardRef,
  useImperativeHandle,
} from 'react'
import { RightOutlined } from '@ant-design/icons';
import { Collapse, Form, Input, Cascader, Spin, message, Upload } from 'antd';
// import { withRouter } from "react-router-dom";
import { getCookie } from '@/utils'
import { getRegionTree, onDownloadTemp } from '@/api/common'
import { uploadApi, baseURL } from "@/config"

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
  const [id, setId] = useState('')
  const [type, setType] = useState('')

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
      let { regionList, economicType, tableRescueTeamAddressDetail, tableMedicalEquipmentDetail } = values
      let params = {
        entCode: getCookie('entCode'),
        ...values,
        economicType,
        id,
        provinceCode: regionList[0],
        city: regionList[1],
        area: regionList[2],
        tableRescueTeamAddressDetail: tableRescueTeamAddressDetail || [],
        tableMedicalEquipmentDetail: tableMedicalEquipmentDetail || []
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
    console.log(res)
    let {
      id,
      provinceCode,
      city,
      area,
      rescueTeamAddress,
      telephone,
      tableRescueTeamAddressDetail,
      tableMedicalEquipmentDetail
    } = res.data
    setId(id)


    let regionList = []
    if (provinceCode) regionList.push(provinceCode)
    if (city) regionList.push(city)
    if (area) regionList.push(area)
    let params = {
      regionList,
      rescueTeamAddress,
      telephone
    }
    // console.log(tableRescueTeamAddressDetail)
    if (!tableRescueTeamAddressDetail) {
      // console.log(params.tableRescueTeamAddressDetail)
      tableRescueTeamAddressDetail = []
      tableRescueTeamAddressDetail.push(
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
      params.tableRescueTeamAddressDetail = tableRescueTeamAddressDetail
    } else {
      params.tableRescueTeamAddressDetail = tableRescueTeamAddressDetail.map(item => {
        item.key = Math.random()
        return item
      })
    }
    if (!tableMedicalEquipmentDetail) {
      tableMedicalEquipmentDetail = []
      // console.log(params.tableRescueTeamAddressDetail)
      tableMedicalEquipmentDetail.push(
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
      params.tableMedicalEquipmentDetail = tableMedicalEquipmentDetail
    } else {
      params.tableMedicalEquipmentDetail = tableMedicalEquipmentDetail.map(item => {
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
      tableRescueTeamAddressDetail: data
    })
  }
  const setTableData2 = (data) => {
    form.setFieldsValue({
      tableMedicalEquipmentDetail: data
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
  const uploadProps = {
    name: 'file',
    action: uploadApi + `/help/enterprise/table/importExcel`,
    headers: {
      Authorization: 'Bearer' + ' ' + getCookie("access_token"),
      ContentType: 'multipart/form-data'
    },
    data: {
      entCode: getCookie('entCode'),
      type: type
    },
    showUploadList: false,
    accept: '.xls,.xlsx',
    beforeUpload: (file) => {
      let isXls = file.name.split('.')[1]
      let extension = ['xls', 'xlsx', 'jpeg', 'XLS', 'XLSX'].includes(isXls);
      if (!extension) {
        message.error('请上传正确的表格数据!')
        return false;
      }
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 0) {
          message.success(`${info.file.name} 上传成功！`);
          initBaseInfo()
        } else {
          message.warning(`${info.file.response.message} !`);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败！`);
      }
    },
  };
  // const onDownload = (type) => {
  //   onDownloadTemp(getCookie('entCode'), type).then(res => {
  //     console.log(res)
  //   })
  // }
  const onDownload = (type) => {
    window.open(`${baseURL}/help/enterprise/table/exportWord/enterpriseBaseInfo?entCode=${getCookie('entCode')}&exportType=${type}&access_token=${getCookie("access_token")}`)
  }
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

            <Form.Item label="详细地址" name='rescueTeamAddress'
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
          <div className='form-tip-btns'>
            <button className="dowload" onClick={() => onDownloadTemp('trtadTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>
            <Upload {...uploadProps} disabled={isEdit}>
              <div className="import" onClick={() => setType('18')}>导入</div>
            </Upload>
            <button className="export" onClick={() => onDownload('18')} disabled={isEdit}>导出</button>

          </div>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            className='base-form-add'
          >
            <Form.Item name="tableRescueTeamAddressDetail" valuePropName='dataSource'
            >
              <AnswerTable1 setTableData={setTableData1} />
            </Form.Item>
          </Form>
        </Panel>
        <Panel header={BaseHeader('医疗装备和药物')} key="3" forceRender>
          <div className='form-tip-btns'>
            <button className="dowload" onClick={() => onDownloadTemp('temrrTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>
            <Upload {...uploadProps} disabled={isEdit}>
              <div className="import" onClick={() => setType('19')}>导入</div>
            </Upload>
            <button className="export" onClick={() => onDownload('19')} disabled={isEdit}>导出</button>

          </div>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            className='base-form-add'
          >
            <Form.Item name="tableMedicalEquipmentDetail" valuePropName='dataSource'
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
