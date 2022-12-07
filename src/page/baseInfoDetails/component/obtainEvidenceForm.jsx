import React, {
  useEffect, useState, forwardRef,
  useImperativeHandle,
} from 'react'
import { RightOutlined } from '@ant-design/icons';
import { Collapse, Form, Upload, Spin, message } from 'antd';
// import { withRouter } from "react-router-dom";
import { getCookie } from '@/utils'
import { onDownloadTemp } from '@/api/common'
import { uploadApi, baseURL } from "@/config"

import { getObtainEvidenceForm, saveObtainEvidenceForm } from '@/api/info'
import AnswerTable from './obtainEvidenceTable'

import moment from 'moment';
import '.././index.less'

let ProductionSafetyForm = (props, ref) => {
  const { Panel } = Collapse;
  const [form] = Form.useForm()
  const [saveLoading, setSaveLoading] = useState(false)
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
        if (item.reviewDate) {
          item.reviewDate = moment(item.reviewDate).format('YYYY-MM-DD')
        }
      })
      if (saveLoading) return
      setSaveLoading(true)
      await saveObtainEvidenceForm(getCookie('entCode'), timeArray).then(res => {
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
      console.log('企业主要负责人', res)
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
            issuingAuthority: '',
            issuingDate: '',
            certificateNumber: '',
            reviewDate: '',
            remark: ''
          }
        )
      } else {
        tableForensicRecord.map(item => {
          item.key = Math.random()
          if (item.trainDate) item.trainDate = (moment(item.trainDate, 'YYYY-MM-DD'))
          else item.trainDate = ''
          if (item.issuingDate) item.issuingDate = (moment(item.issuingDate, 'YYYY-MM-DD'))
          else item.issuingDate = ''
          if (item.reviewDate) item.reviewDate = (moment(item.reviewDate, 'YYYY-MM-DD'))
          else item.reviewDate = ''
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
      type: 4
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
  //   onDownloadTemp(getCookie('entCode'), 4).then(res => {
  //     console.log(res)
  //   })
  // }
  const onDownload = (type) => {
    window.open(`${baseURL}/help/enterprise/table/exportWord/enterpriseBaseInfo?entCode=${getCookie('entCode')}&exportType=4&access_token=${getCookie("access_token")}`)
  }
  return (
    <Spin spinning={loading}>
      <Collapse defaultActiveKey={['1', '2']} expandIconPosition='end'
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
        <Panel header={BaseHeader('企业主要负责人、安全管理人员安全生产管理资格培训取证记录')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <div className='form-tip-btns'>
            <button className="dowload" onClick={() => onDownloadTemp('tfrTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>
            <Upload {...uploadProps} disabled={isEdit}>
              <div className="import">导入</div>
            </Upload>
            <button className="export" onClick={onDownload} disabled={isEdit}>导出</button>

          </div>
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
