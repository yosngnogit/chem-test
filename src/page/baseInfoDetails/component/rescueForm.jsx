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
import BaseHeader from '../../../components/baseHeader';

import { getRescueForm, saveRescueForm } from '@/api/info'
import AnswerTable from './rescueTable'
// import AnswerTable2 from './rescueTable2'
// import AnswerTable3 from './rescueTable3'
// import AnswerTable4 from './rescueTable4'

import moment from 'moment';
import '.././index.less'
let AccidenttForm = (props, ref) => {
  const { Panel } = Collapse;
  const [form] = Form.useForm()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [type, setType] = useState('')

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
      setSaveLoading(true)

      let paramsArray = []
      paramsArray = [...values.AnswerTable1, ...values.AnswerTable2, ...values.AnswerTable3, ...values.AnswerTable4]
      let paramsInner = paramsArray.filter(v => v.type !== '')
      console.log(paramsInner)
      await saveRescueForm(getCookie('entCode'), paramsInner).then(res => {
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
    if (personDistributionSituation.length === 0) {
      AnswerTable.push(
        {
          key: Math.random(),
          name: '',
          emergencyWork: '',
          post: '',
          liableDivide: '',
          telephone: '',
        }
      )
      params.AnswerTable1 = AnswerTable
      params.AnswerTable2 = AnswerTable
      params.AnswerTable3 = AnswerTable
      params.AnswerTable4 = AnswerTable
    } else {
      let innerTable1 = []
      let innerTable2 = []
      let innerTable3 = []
      let innerTable4 = []
      personDistributionSituation.map(item => {
        item.key = Math.random()
        if (item.type === 'leader') {
          innerTable1.push(item)
        }
        if (item.type === 'expert') {
          innerTable2.push(item)
        }
        if (item.type === 'office') {
          innerTable3.push(item)
        }
        if (item.type === 'pluralismt') {
          innerTable4.push(item)
        }
        return item
      })
      params.AnswerTable1 = innerTable1
      params.AnswerTable2 = innerTable2
      params.AnswerTable3 = innerTable3
      params.AnswerTable4 = innerTable4
    }
    form.setFieldsValue(params)
  }
  const onFinishFailed = () => {
    message.warning('请检查并完成必填项');
  }
  const setTableData = (data, type, deleteList) => {
    data.map(item => {
      item.type = type
      return item
    })
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
  const uploadProps = {
    name: 'file',
    action: uploadApi + `/help/enterprise/table/importExcel`,
    headers: {
      Authorization: 'Bearer' + ' ' + getCookie("access_token"),

      'X-Requested-With': null,
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
      <Collapse defaultActiveKey={['1', '2']} expandIconPosition='end' collapsible="header"
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
        <Panel header={BaseHeader('企业应急救援管理机构、人员统计表', '')} key="1"
        collapsible='disabled'
        showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <Collapse expandIconPosition='end' defaultActiveKey={['8']}
            expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
            <Panel header={BaseHeader('', '应急管理领导小组')} key="8" className='inner-header' forceRender>
              <div className='form-tip-btns'>
                <button className="dowload" onClick={() => onDownloadTemp('termprTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>

                <Upload {...uploadProps} disabled={isEdit}>
                  <div className="import" onClick={() => setType('12')}>导入</div>
                </Upload>
                <button className="export" onClick={() => onDownload('12')} disabled={isEdit}>导出</button>

              </div>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                disabled={isEdit}
                className='base-form-add'>
                <Form.Item name="AnswerTable1" valuePropName='dataSource'
                >
                  <AnswerTable setTableData={setTableData} tableType='leader' />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('', '应急救援专家')} key="9" className='inner-header' forceRender>
              <div className='form-tip-btns'>
                <button className="dowload" onClick={() => onDownloadTemp('termprTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>

                <Upload {...uploadProps} disabled={isEdit}>
                  <div className="import" onClick={() => setType('13')}>导入</div>
                </Upload>
                <button className="export" onClick={() => onDownload('13')} disabled={isEdit}>导出</button>

              </div>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                disabled={isEdit}
                className='base-form-add'>
                <Form.Item name="AnswerTable2" valuePropName='dataSource'
                >
                  <AnswerTable setTableData={setTableData} tableType='expert' />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('', '应急救援管理办公室')} key="10" className='inner-header' forceRender>
              <div className='form-tip-btns'>
                <button className="dowload" onClick={() => onDownloadTemp('termprTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>

                <Upload {...uploadProps} disabled={isEdit}>
                  <div className="import" onClick={() => setType('14')}>导入</div>
                </Upload>
                <button className="export" onClick={() => onDownload('14')} disabled={isEdit}>导出</button>

              </div>
              <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}
                disabled={isEdit}
                className='base-form-add'>
                <Form.Item name="AnswerTable3" valuePropName='dataSource'
                >
                  <AnswerTable setTableData={setTableData} tableType='office' />
                </Form.Item>
              </Form>
            </Panel>
            <Panel header={BaseHeader('', '应急救援兼职队员')} key="11" className='inner-header' forceRender>
              <div className='form-tip-btns'>
                <button className="dowload" onClick={() => onDownloadTemp('termprTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>

                <Upload {...uploadProps} disabled={isEdit}>
                  <div className="import" onClick={() => setType('15')}>导入</div>
                </Upload>
                <button className="export" onClick={() => onDownload('15')} disabled={isEdit}>导出</button>

              </div>
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

export default forwardRef(AccidenttForm)
