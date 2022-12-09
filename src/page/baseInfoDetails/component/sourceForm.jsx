import React, {
  useEffect, useState, forwardRef,
  useImperativeHandle,
} from 'react'
import { RightOutlined } from '@ant-design/icons';
import { Collapse, Form, Spin, message, Upload } from 'antd';
// import { withRouter } from "react-router-dom";
import { getCookie } from '@/utils'
import { onDownloadTemp } from '@/api/common'
import { uploadApi, baseURL } from "@/config"


import { saveSourceForm, getSourceForm } from '@/api/info'
import AnswerTable from './sourceTable'
import BaseHeader from '../../../components/baseHeader';

// import moment from 'moment';
import '.././index.less'

let SourceForm = (props, ref) => {
  const { Panel } = Collapse;
  const [form] = Form.useForm()
  const [saveLoading, setSaveLoading] = useState(false)
  const [entCode, setEntCode] = useState(getCookie('entCode'))
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(true);

  useEffect(() => {

    if (isEdit) initBaseInfo()
  }, [isEdit])
  const onFinish = async (values) => {
    try {
      if (saveLoading) return
      setSaveLoading(true)
      let paramsArray = values.tableDangerSourceMonitorManageRegister
      await saveSourceForm(entCode, paramsArray).then(res => {
        setSaveLoading(false)
        if (res.code === 0) message.success('保存成功'); setIsEdit(true)
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
      let res = await getSourceForm(entCode)
      res.data.map(item => {
        item.key = Math.random()
        return item
      })
      form.setFieldsValue({
        tableDangerSourceMonitorManageRegister: res.data
      })
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
  const uploadProps = {
    name: 'file',
    action: uploadApi + `/help/enterprise/table/importExcel`,
    headers: {
      Authorization: 'Bearer' + ' ' + getCookie("access_token"),

      'X-Requested-With': null,
    },
    data: {
      entCode: entCode,
      type: 2
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
        // console.log(info.file, info.fileList);
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
  //   onDownloadTemp(entCode, 2).then(res => {
  //     console.log(res)
  //   })
  // }
  const onDownload = (type) => {
    window.open(`${baseURL}/help/enterprise/table/exportWord/enterpriseBaseInfo?entCode=${getCookie('entCode')}&exportType=2&access_token=${getCookie("access_token")}`)
  }
  return (
    <Spin spinning={loading}>
      <Collapse defaultActiveKey={['1', '2']} expandIconPosition='end'
        collapsible="header"
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
        <Panel header={BaseHeader('危险源（点）监控管理表', '')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <div className='form-tip-btns'>
            <button className="dowload" onClick={() => onDownloadTemp('tdsmmrTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>

            <Upload {...uploadProps} disabled={isEdit}>
              <div className="import">导入</div>
            </Upload>
            <button className="export" onClick={onDownload} disabled={isEdit}>导出</button>

          </div>
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

export default forwardRef(SourceForm)
