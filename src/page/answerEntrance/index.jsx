import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Progress, Message, } from 'antd'
import { getVersionInfo, getRecordInfo, deleteEntPaper, getInfoPerfect, createAnswer } from "../../api/answer";
import { getCookie } from '@/utils'

import './index.less'

function AnswerEntrance(props) {
  const entCode = getCookie('entCode');

  const [info, setInfo] = useState({ free: {}, pay: {} })
  const [listData, setListData] = useState([])
  const [infoPerfect, setInfoPerfect] = useState([])

  const { confirm } = Modal;

  useEffect(() => {
    getVersionInfo({ entCode, entType: 1 }).then(res => {
      setInfo(res.data)
    })
    getRecordInfo(entCode).then(res => {
      setListData(res.data)
    })
    getInfoPerfect(entCode).then(res => {
      setInfoPerfect(res.data)
    })
  }, [])
  const goSchedule = (item, type) => {
    // console.log(item)
    // 判断是新建还是继续答题
    if (type === 'add') {
      createAnswer({ ...item, entCode }).then(res => {
        // console.log(res.data)
        // props.history.push(`/report?paperId=${res.data}&paperType=${item.paperType}`)
        props.history.push(`/answerSchedule?paperId=${res.data}`)
      })
      return;
    } else {
      props.history.push(`/answerSchedule?paperId=${item.paperId}`)
    }
    // const str = JSON.stringify({ versionNo: item.versionNo, paperType: item.paperType, quesNum: item.quesNum });
    // props.history.push(`/answerSchedule?paperId=${item.paperId}&body=${str}`)
  }

  const goCreate = (item) => {
    let innerArray = []
    if(item.paperType=='2'){
      if(listData.filter(data=>data.paperType==='2').length==0){
        confirm({
          bodyClassName: 'pay-confirm',
          content: '是否创建新答题？',
          okText: '确认',
          onOk() { goSchedule(item, 'add') }})
      }
      else{
        listData.map(v => {
          v.active = false
        })
        confirm({
          bodyClassName: 'pay-confirm',
          content: '已有测试正在进行中，确定是否新建测试？',
          okText: '确认',
          onOk() { goSchedule(item, 'add') },
          onCancel() {
            innerArray = JSON.parse(JSON.stringify(listData));
            // 免费
            if (item.paperType === '1') {
              innerArray.forEach(i => {
                if (i.paperStatus === '0' && i.paperType === '1') {
                  i.active = true
                }
                // if (i.paperStatus === '0' && item.paperType === '2') i.payactive = true
              })
            }
            // 付费
            else {
              innerArray.forEach(i => {
                if (i.paperStatus === '0' && i.paperType === '2') {
                  i.active = true
                }
              })
            }
            setListData(innerArray)
          }
        })
      }
   } else{
    if(listData.filter(data=>data.paperType==='1').length==0){
      confirm({
        bodyClassName: 'pay-confirm',
        content: '是否创建新答题？',
        okText: '确认',
        onOk() { goSchedule(item, 'add') }})
     }
     else{
      listData.map(v => {
        v.active = false
      })
      confirm({
        bodyClassName: 'pay-confirm',
        content: '已有测试正在进行中，确定是否新建测试？',
        okText: '确认',
        onOk() { goSchedule(item, 'add') },
        onCancel() {
          innerArray = JSON.parse(JSON.stringify(listData));
          // 免费
          if (item.paperType === '1') {
            innerArray.forEach(i => {
              if (i.paperStatus === '0' && i.paperType === '1') {
                i.active = true
              }
              // if (i.paperStatus === '0' && item.paperType === '2') i.payactive = true
            })
          }
          // 付费
          else {
            innerArray.forEach(i => {
              if (i.paperStatus === '0' && i.paperType === '2') {
                i.active = true
              }
            })
          }
          setListData(innerArray)
        }
      })
     }
   }
      
   
  }

  const goPay = () => {
    if (info.pay.canAnswer) {
      goCreate({ versionNo: info.versionNo, paperType: '2', quesNum: info.pay.quesNum })
      return;
    }
    confirm({
      title: '提示',
      content: '付费版未解锁，请联系客服进行解锁。联系方式：159-5810-2151。',
      okText: '确定',
      okType: 'danger',
      // onOk() {
      //     toLogin()
      // }
    })
  }
  const onDelete = (item) => {
    confirm({
      content: '确定删除此条答题记录？',
      onOk: () => {
        // const data = listData.filter(l => l.paperId !== item.paperId);
        // setListData(data);
        deleteEntPaper({ paperId: item.paperId }).then(res => {
          if (res.data) {
            Message.info({ content: '删除成功' })
            getRecordInfo(entCode).then(res => {
              setListData(res.data)
            })
          }
        })
      }
    })
  }
  const onLookReport = (item) => {
    props.history.push(`/report?paperId=${item.paperId}&paperType=${item.paperType}`)
  }
  const resetActive = () => {
    listData.forEach(v => {
      v.active = false
    })
    let innerArray = JSON.parse(JSON.stringify(listData));
    setListData(innerArray)
  }
  return (
    <div className='answerEntrance' onClick={resetActive}>
      <div className="answer-main">
        <div className='answer-perfect'>
          <div>企业信息已完成{infoPerfect ? infoPerfect : 0}%,</div>
          <div className='answer-perfect-div' onClick={() => { props.history.push('/baseInfoDetails') }}>去完善</div><img src={require('@/assets/img/answerEntrance/Vector.png')} style={{ width: '6px', height: '10px' }} alt="" />
        </div>
        <div className="answer-main-list">

          <div className="answer-cards">
            <div className="card-free" onClick={() => { goCreate({ versionNo: info.versionNo, paperType: '1', quesNum: info.free.quesNum }) }}>
              <img src={require('@/assets/img/answerEntrance/free.png')} width={38} height={44} alt='' />
              <div className="free-tip">
                <div className="free-tip-p">
                  <span>免费版</span>
                </div>
                <span className='tip-span'>{info.free.quesNum}题，普通诊断</span>
              </div>
            </div>
            <div className="card-notfree" onClick={goPay}>
              <img src={require('@/assets/img/answerEntrance/notfree.png')} width={46} height={46} alt='' />

              <div className="free-tip">
                <div>
                  <div className="free-tip-p"> {info.pay.canAnswer ?
                    <img src={require('@/assets/img/answerEntrance/unLock.png')} width={26} height={24} style={{ marginRight: '6px' }} alt='' /> :
                    <img src={require('@/assets/img/answerEntrance/lock.png')} width={21} height={24} style={{ marginRight: '6px' }} alt='' />}
                    <span>付费版</span>
                  </div>
                </div>
                <span className='tip-span'> {info.pay.quesNum}题，精确诊断</span>
              </div>
            </div>
          </div>
          <div className='answer-tips'> <span>Tips:</span> 请联系当地中控5S店解锁付费版，获得更精准的诊断结果</div>
          <div style={{ width: '1440px', height: '8px', margin: 'auto', backgroundColor: '#F8F8FA' }}></div>
          <ul className="answer-list">
            {
              listData.map((item, index) => {
                return <li key={index} className={item.active ? 'active-border' : ''} >
                  <div className="list-top">
                    <div className={item.free ? "list-title-true" : "list-title-false"}>
                      <div>
                        <span className={item.paperType === '1' ? "title-tip-true" : "title-tip-false"}>{item.paperType === '1' ? '免费版' : '付费版'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="list-bottom">
                    <div className='list-bottom-name'>{item.paperName}</div>
                    <div className='list-bottom-time'>开始时间：{item.beginTime}</div>
                    <div className={item.paperStatus === '1' ? 'list-finish' : 'list-status'} >{item.paperStatus === '1' ? '已完成' : '进行中'}</div>
                    <div style={{ display: 'flex' }}>
                      <Progress
                        percent={item.overallProgress}
                        strokeWidth={6} showInfo={false}
                        strokeColor='#4074FF' />
                      <div className="pro-num" style={{ marginLeft: '8px' }}>{item.overallProgress}%</div>
                    </div>
                    <div className="evaluate">
                      {
                        item.paperStatus === '1' ? <div className="list-level">
                          <div className="list-sorce">{item.score || 0}分</div>
                        </div> :
                          <span className="list-pro">
                          </span>
                      }
                    </div>
                    <div className='list-button'>

                      <div className='list-button-con' onClick={() => { item.paperStatus === '1' ? onLookReport(item) : goSchedule(item, 'edit') }}>
                        {item.paperStatus === '1' ? '查看报告' : '继续答题'}
                      </div>
                      <div className='list-button-del' onClick={() => { onDelete(item) }}>删除记录</div>
                    </div>
                  </div>
                </li>
              })

            }
          </ul>
        </div>

      </div>

    </div>
  )
}
export default withRouter(AnswerEntrance)