import React, { useRef, useEffect, useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, Checkbox, Radio, Space, Cascader, Spin, message } from 'antd';
import { withRouter } from "react-router-dom";
import { getCookie } from '@/utils'
import { getComponyList } from '@/api/info'


import { Image } from 'antd';

import './index.less'
import BaseForm from './component/baseForm';
import SourceForm from './component/sourceForm'
import ProductionSafetyForm from './component/productionSafetyForm'
import ObtainEvidenceForm from './component/obtainEvidenceForm';
import CertificateForm from './component/certificateForm'
import EquipmentForm from './component/equipmentForm'
import AccidentForm from './component/accidentForm';
import MaterialForm from './component/materialForm'
import LedgerForm from './component/ledgerForm'
import HarmForm from './component/harmForm';
import InputForm from './component/inputForm'
import RescueForm from './component/rescueForm'
import OutfitForm from './component/outfitForm';
// import { kdf } from 'crypto-js';

function BaseInfoDetails(props) {

  const [baseList, setBaseList] = useState(
    [
      {
        name: '企业基本情况表',
        status: true,
        componentName: 'BaseForm'
      },
      {
        name: '危险源（点）监控管理登记表',
        status: true,
        componentName: 'SourceForm',
      }, {
        name: '安全生产组织机构登记表',
        status: true,
        componentName: 'ProductionSafetyForm',
      }, {
        name: '企业主要负责人、安全管理人员安全生产管理资格培训取证记录',
        status: true,
        componentName: 'ObtainEvidenceForm',
      },
      {
        name: '特种作业人员培训、考核、持证登记表',
        status: true,
        componentName: 'CertificateForm',
      }, {
        name: '特种设备登记表',
        status: false,
        componentName: 'EquipmentForm',
      }
      , {
        name: '生产安全事故统计表',
        status: true,
        componentName: 'AccidentForm',
      }, {
        name: '消防器材、防护配置情况登记表',
        status: true,
        componentName: 'MaterialForm',
      },
      {
        name: '安全设备设施登记使用管理台账',
        status: true,
        componentName: 'LedgerForm',
      }, {
        name: '职业危害管理登记表',
        status: false,
        componentName: 'HarmForm',
      }, {
        name: '安全生产投入登记表',
        status: true,
        componentName: 'InputForm',
      },
      {
        name: '企业应急救援管理机构、人员统计表',
        status: true,
        componentName: 'RescueForm',
      }, {
        name: '企业消防设施器材、应急救援器材装备登记表',
        status: false,
        componentName: 'OutfitForm',
      }
    ])
  const [isActive, setIsActive] = useState(0)
  // const [loading, setLoading] = useState(false);
  const [componentName, setComponentName] = useState('BaseForm');
  const [formName, setFormName] = useState('企业基本情况表');

  const [componentEdit, setComponentEdit] = useState(false);
  const refbase = useRef(null);
  const { confirm } = Modal;

  useEffect(() => {
    // console.log(getCookie('entCode'))
    getComponyList(getCookie('entCode')).then(res=>{
      console.log(res)
    }).catch(err=>{
      // console.log(err)
    })
   
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
    //   initBaseInfo()
    //   setLoading(false)
    // }).catch(err => {
    //   setLoading(false)
    // })
  }, [])


  const searchForm = (e, index) => {
    // setParkData(parkObj[e.cityCode])
    // console.log(e)
    if (componentEdit) {
      confirm({
        style: { top: '30%' },
        content: '是否保存当前页面修改内容?',
        okText: '确认',
        onOk() {
          refbase.current.onCallback();
          // setComponentType(e.componentName)
          setIsActive(index)
          setComponentName(e.componentName)
          setFormName(e.name)
        },
        onCancel() {
          setIsActive(index)
          setComponentEdit(false)
          setComponentName(e.componentName)
          setFormName(e.name)
        }
      })
    }
    else {
      setIsActive(index)
      setComponentName(e.componentName)
      setFormName(e.name)
    }
  }
  const setEdit = (data) => {
    setComponentEdit(data)
  }
  const onBack = () => {
    props.history.go(-1)
    // setComponentType(componentName)
    refbase.current.onCallback();

  }
  // const setComponentType = (param) => {
  //   switch (param) {
  //     case 'BaseForm':
  //       refbase.current.onCallback();
  //       break
  //     case 'SourceForm':
  //       console.log('2')
  //       break
  //     case 'ProductionSafetyForm':
  //       refbase.current.onCallback();
  //       break
  //     case 'ObtainEvidenceForm':
  //       console.log('2')
  //       break
  //     case 'CertificateForm':
  //       refbase.current.onCallback();
  //       break
  //     case 'EquipmentForm':
  //       console.log('2')
  //       break
  //     case 'AccidentForm':
  //       refbase.current.onCallback();
  //       break
  //     case 'MaterialForm':
  //       console.log('2')
  //       break
  //     case 'LedgerForm':
  //       refbase.current.onCallback();
  //       break
  //     case 'HarmForm':
  //       console.log('2')
  //       break
  //     case 'InputForm':
  //       console.log('2')
  //       break
  //     case 'RescueForm':
  //       console.log('2')
  //       break
  //     case 'OutfitForm':
  //       console.log('2')
  //       break
  //     default:
  //       console.log('default')
  //   }
  // }
  return (
    <div className='baseInfoDetails'>
      <div className='background'>
        <div className="haeder-tip">
          <p onClick={onBack}>企业基本信息表 / </p><span>{formName}</span>
        </div>
        <div className="baseInfo-header">
          <p>中控技术股份有限公司</p>
          <span>开始自诊断前，请先完善企业基本信息</span>
        </div>
        <div className='base-main'>
          <ul className="base-list">
            {
              baseList.map((i, index) => {
                return <li
                  key={i.componentName}
                  className={index === isActive ? 'activebtn' : ''}
                  onClick={() => searchForm(i, index)}>
                  <p>  <span>*</span> {i.name}</p>
                  <div className='icons'>
                    {
                      i.status ?
                        <Image
                          width={18}
                          preview={false}
                          src={require('@/assets/img/baseInfo/complete.png')}
                        />
                        : <Image
                          width={18}
                          preview={false}
                          src={require('@/assets/img/baseInfo/uncomplete.png')}
                        />
                    }
                    <div className='right-icon'>
                    </div>
                    {/* <Image
                      width={10}
                      preview={false}
                      src={require('@/assets/img/baseInfo/Vectorinfo-right.png')}
                    /> */}

                  </div>
                </li>
              })
            }
          </ul>
          {
            componentName === 'BaseForm' ? <BaseForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'SourceForm' ? <SourceForm setEdit={setEdit} /> : ''
          }
          {
            componentName === 'ProductionSafetyForm' ? <ProductionSafetyForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'ObtainEvidenceForm' ? <ObtainEvidenceForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'CertificateForm' ? <CertificateForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'EquipmentForm' ? <EquipmentForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'AccidentForm' ? <AccidentForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'MaterialForm' ? <MaterialForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'LedgerForm' ? <LedgerForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'HarmForm' ? <HarmForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'InputForm' ? <InputForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'RescueForm' ? <RescueForm setEdit={setEdit} ref={refbase} /> : ''
          }
          {
            componentName === 'OutfitForm' ? <OutfitForm setEdit={setEdit} ref={refbase} /> : ''
          }

        </div>

      </div>
    </div>
  )
}
// function BaseHeader(text) {
//   return <div className="info-title">
//     <span className='info-span'>*</span>
//     <p>{text}</p>
//   </div>
// }
export default withRouter(BaseInfoDetails)
