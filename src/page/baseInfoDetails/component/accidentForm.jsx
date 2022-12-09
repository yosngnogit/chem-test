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

import { getAccidentForm, saveAccidentForm } from '@/api/info'
import AnswerTable from './accidentTable'
import BaseHeader from '../../../components/baseHeader';

import moment from 'moment';
import '.././index.less'

let ProductionSafetyForm = (props, ref) => {
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
    initBaseInfo()

  }, [])
  const onFinish = async (values) => {
    try {
      const timeArray = JSON.parse(JSON.stringify([...values.personDistributionSituation]))
      timeArray.forEach(item => {
        item.entCode = getCookie('entCode')
        if (item.happenTime) {
          item.happenTime = moment(item.happenTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (item.accidentAnalysisTime) {
          item.accidentAnalysisTime = moment(item.accidentAnalysisTime).format('YYYY-MM-DD HH:mm:ss')
        }
      })
      if (saveLoading) return
      setSaveLoading(true)

      setSaveLoading(false)
      await saveAccidentForm(getCookie('entCode'), timeArray).then(res => {
        if (res.code === 0) message.success('保存成功'); setIsEdit(true)
        initBaseInfo()
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
    let res = await getAccidentForm(getCookie('entCode'))
    let personDistributionSituation = res.data
    // console.log(personDistributionSituation)
    if (personDistributionSituation.length === 0) {
      personDistributionSituation.push(
        {
          key: Math.random(),
          happenTime: '',
          dept: '',
          casualtiesName: '',
          sex: '',
          age: '',
          workType: '',
          workYear: '',
          accidentProfile: '',
          accidentAnalysisTime: '',
          accidentAnalysisNature: '',
          accidentLoss: '',
          accidentCategory: '',
          accidentLiablePerson: '',
        }
      )
    } else {
      personDistributionSituation.map(item => {
        item.key = Math.random()
        if (item.happenTime) item.happenTime = (moment(item.happenTime, 'YYYY-MM-DD HH:mm:ss'))
        else item.happenTime = ''
        if (item.accidentAnalysisTime) item.accidentAnalysisTime = (moment(item.accidentAnalysisTime, 'YYYY-MM-DD HH:mm:ss'))
        else item.accidentAnalysisTime = ''
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

      'X-Requested-With': null,
    },
    data: {
      entCode: getCookie('entCode'),
      type: 7
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
  //   onDownloadTemp(getCookie('entCode'), 7).then(res => {
  //     console.log(res)
  //   })

  // }
  const onDownload = () => {
    window.open(`${baseURL}/help/enterprise/table/exportWord/enterpriseBaseInfo?entCode=${getCookie('entCode')}&exportType=7&access_token=${getCookie("access_token")}`)
  }
  return (
    <Spin spinning={loading}>
      <Collapse defaultActiveKey={['1', '2']} expandIconPosition='end'
        collapsible="header"
        expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 270 : 90} />}>
        <Panel header={BaseHeader('生产安全事故统计表', '')} key="1" showArrow={false} extra={isEdit ? genEditExtra() : genSaveExtra()}>
          <div className='form-tip-btns'>
            <button className="dowload" onClick={() => onDownloadTemp('tsasTemplate').then(res => window.open(res.data))} disabled={isEdit}>下载模板</button>
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
export default forwardRef(ProductionSafetyForm)
