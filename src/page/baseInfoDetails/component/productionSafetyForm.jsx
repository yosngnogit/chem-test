import React, {
  useEffect, useState, forwardRef,
  useImperativeHandle,
} from 'react'
import { RightOutlined } from '@ant-design/icons';
import { Collapse, Form, Input, Spin, message, Upload } from 'antd';
// import { withRouter } from "react-router-dom";
import { getCookie } from '@/utils'
import { onDownloadTemp } from '@/api/common'
import { uploadApi, baseURL } from "@/config"

import { positiveIntegerReg, } from '@/utils/reg'

import { getProductionSafetyForm, saveProductionSafetyForm } from '@/api/info'
import AnswerTable from './productionSafetyTable'

import moment from 'moment';
import '.././index.less'

let ProductionSafetyForm = (props, ref) => {
  const { Panel } = Collapse;
  const [form] = Form.useForm()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  useEffect(() => {
    if (isEdit) initBaseInfo()
  }, [isEdit])
  const onFinish = async (values) => {
    try {
      const timeArray = JSON.parse(JSON.stringify([...values.tableMechanismMemberDetails]))
      timeArray.forEach(item => {
        if (item.appointmentTime) {
          item.appointmentTime = moment(item.appointmentTime).format('YYYY-MM-DD')
        }
      })
      values.tableMechanismMemberDetails = timeArray
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
        tableMechanismMemberDetails } = values
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
        tableMechanismMemberDetails
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
        tableMechanismMemberDetails
      } = res.data
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
        tableMechanismMemberDetails
      }
      if (!tableMechanismMemberDetails) {
        // console.log(params.personDistributionSituation)
        tableMechanismMemberDetails = []
        tableMechanismMemberDetails.push(
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
        params.tableMechanismMemberDetails = tableMechanismMemberDetails
      } else {
        params.tableMechanismMemberDetails = tableMechanismMemberDetails.map(item => {
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
      tableMechanismMemberDetails: data
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
      ContentType:'multipart/form-data',
      'X-Requested-With':null,
    },
    data: {
      entCode: getCookie('entCode'),
      type: 3
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
  // const onDownload = () => {
  //   onDownloadTemp(getCookie('entCode'), 3).then(res => {
  //     console.log(res)
  //   })
  // }
  const onDownload = (type) => {
    window.open(`${baseURL}/help/enterprise/table/exportWord/enterpriseBaseInfo?entCode=${getCookie('entCode')}&exportType=3&access_token=${getCookie("access_token")}`)
  }
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
          <div className='form-tip-btns'>
            <button className="dowload" onClick={() => onDownloadTemp('tmmdTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>

            <Upload {...uploadProps} disabled={isEdit}>
              <div className="import">导入</div>
            </Upload>
            <button className="export" onClick={onDownload} disabled={isEdit}>导出</button>

          </div>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
            disabled={isEdit}
            className='base-form-add'
          >
            <Form.Item name="tableMechanismMemberDetails" valuePropName='dataSource'
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
