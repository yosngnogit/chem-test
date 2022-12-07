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
import { getHarmForm, saveHarmForm } from '@/api/info'
import AnswerTable from './harmTable'

import '.././index.less'

let AccidenttForm = (props, ref) => {
  const { Panel } = Collapse;
  const [form] = Form.useForm()
  const [saveLoading, setSaveLoading] = useState(false)

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
      if (saveLoading) return
      setSaveLoading(true)
      await saveHarmForm(getCookie('entCode'), timeArray).then(res => {
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
    let res = await getHarmForm(getCookie('entCode'))
    let personDistributionSituation = res.data
    // console.log(personDistributionSituation)
    if (personDistributionSituation.length === 0) {
      // console.log(params.personDistributionSituation)
      personDistributionSituation.push(
        {
          key: Math.random(),
          place: '',
          hazardCategory: '',
          occupationalDiseasesCategory: '',
          checkInspection: '',
          contactNumber: '',
          remark: ''
        }
      )
    } else {
      personDistributionSituation.map(item => {
        item.key = Math.random()
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
  const setTableData = (data) => {
    form.setFieldsValue({
      personDistributionSituation: data
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
      type: 10
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
  //   onDownloadTemp(getCookie('entCode'), 10).then(res => {
  //     console.log(res)
  //   })
  // }
  const onDownload = (type) => {
    window.open(`${baseURL}/help/enterprise/table/exportWord/enterpriseBaseInfo?entCode=${getCookie('entCode')}&exportType=10&access_token=${getCookie("access_token")}`)
  }
  return (
    <Spin spinning={loading}>
      <Collapse defaultActiveKey={['1', '2']} expandIconPosition='end'
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
        <Panel header={BaseHeader('职业危害管理登记表')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <div className='form-tip-btns'>
            <button className="dowload" onClick={() => onDownloadTemp('tohmrTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>

            <Upload {...uploadProps} disabled={isEdit}>
              <div className="import">导入</div>
            </Upload>
            <button className="export" onClick={onDownload} disabled={isEdit}>导出</button>

          </div>
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
