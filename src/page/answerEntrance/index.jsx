import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Progress, Message,Spin } from 'antd'
import { getVersionInfo, getRecordInfo, deleteEntPaper } from "../../api/answer";
import { getCookie } from '@/utils'
import { decrypt } from '@/utils/aes';

import './index.less'

function AnswerEntrance(props) {
  const entCode = getCookie('entCode');

  const [info, setInfo] = useState({ free: {}, pay: {} })
  const [listData, setListData] = useState([])
  const { confirm } = Modal;

  useEffect(() => {
    getVersionInfo({ entCode, entType: 1 }).then(res => {
      setInfo(res.data)
    })
    getRecordInfo(entCode).then(res => {
      setListData(res.data)
    })
  }, [])

  const goSchedule = (item) => {
    if (item.paperStatus === '1') {
      props.history.push(`/report?paperId=${item.paperId}`)
      return;
    }
    const str = JSON.stringify({ versionNo: item.versionNo, paperType: item.paperType, quesNum: item.quesNum });
    props.history.push(`/answerSchedule?paperId=${item.paperId}&body=${str}`)
  }

  const goCreate = (item) => {
   confirm({
      bodyClassName: 'pay-confirm',
      content: '是否创建新答题？',
      okText:'确认',
      onOk () { goSchedule(item) }
    })
  }

  const goIndex = () => props.history.go(-1)

  const goPay = () => {
    if (info.pay.canAnswer) {
      goCreate({ versionNo: info.versionNo, paperType: '2', quesNum: info.pay.quesNum })
      return;
    }
    confirm({
      title: '提示',
      content: '付费版未解锁，请联系客服进行解锁。联系方式：18868888888。',
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
        const data = listData.filter(l => l.paperId !== item.paperId);
        setListData(data);
        deleteEntPaper({ paperId: item.paperId }).then(res => {
          if (res.data) Message.info({ content: '删除成功' })
        })
      }
    })
  }
  const onLookReport = (item) => {
    console.log(item.paperId)
    props.history.push(`/report?paperId=${item.paperId}`)
  }
  return (
    <div className='answerEntrance'>
      <div className="answer-main">
        <div className='answer-perfect'>
          <div>企业信息已完成20%,</div>
          <div className='answer-perfect-div' onClick={() => { props.history.push('/baseInfo') }}>去完善</div><img src={require('@/assets/img/answerEntrance/Vector.png')} style={{ width: '6px', height: '10px' }} alt="" />
        </div>
        <div className="answer-main-list">

          <div className="answer-cards">
            <div className="card-free" onClick={() => { goCreate({ versionNo: info.versionNo, paperType: '1', quesNum: info.free.quesNum })}}>
              <img src={require('@/assets/img/answerEntrance/free.png')} width={38} height={44} fit='fill' />
              <div className="free-tip">
                <div className="free-tip-p">
                  <span>免费版</span>
                </div>
                <span className='tip-span'>{info.free.quesNum}题，普通诊断</span>
              </div>
            </div>
            <div className="card-notfree" onClick={goPay}>
              <img src={require('@/assets/img/answerEntrance/notfree.png')} width={46} height={46} fit='fill' />

              <div className="free-tip">
                <div>
                  <div className="free-tip-p">  <img src={require('@/assets/img/answerEntrance/Vectorunlock.png')} width={13} height={15} style={{ marginRight: '6px' }} fit='fill' />
                    <span>付费版</span>
                  </div>
                </div>
                <span className='tip-span'> {info.pay.quesNum}题，精确诊断</span>
              </div>
            </div>


          </div>
          <div className='answer-tips'> <span>Tips:</span> 请联系当地中控5S店解锁付费版，获得更精准的诊断结果</div>
          <ul className="answer-list">
            {
              listData.map((item, index) => {
                return <li key={index}>
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
                    <div className="list-status">{item.paperStatus === '1' ? '已完成' : '进行中'}</div>
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
                     
                      <div className='list-button-con' onClick={() => {item.paperStatus === '1' ?onLookReport(item): goSchedule(item) }}>
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