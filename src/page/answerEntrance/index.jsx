import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Progress } from 'antd'
import { getVersionInfo, getRecordInfo } from "../../api/answer";
import { getCookie } from '@/utils'
import './index.less'

function AnswerEntrance(props) {
  const entCode = getCookie('entCode');

  const [info, setInfo] = useState({ free: {}, pay: {} })
  const [listData, setListData] = useState([])

  useEffect(() => {
    getVersionInfo(entCode).then(res => {
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

  const goInfo = () => {
    if (!getCookie('access_token')) {
      return Modal.alert({
        bodyClassName: 'pay-confirm',
        closeOnMaskClick: true,
        showCloseButton: true,
        content: '请先登录企业账号',
        confirmText: '去登录',
        onConfirm: async () => {
          props.history.push('/login')
        },
      })
    }
    props.history.push('/info')
  }

  const goIndex = () => props.history.go(-1)

  const goPay = () => {
    Modal.alert({
      bodyClassName: 'pay-confirm',
      closeOnMaskClick: true,
      confirmText: '确定',
      content: '付费版未解锁，请联系客服进行解锁。联系方式：18868888888。',
    })
  }

  return (
    <div className='answerEntrance'>
      <div className="header">
        头部
      </div>
      <div className="answer-main">
        <div className='answer-perfect'>企业信息已完成20% 去完善</div>
        <div className="answer-main-list">

          <div className="answer-cards">
            <div className="card-free" onClick={() => { goSchedule({ versionNo: info.versionNo, paperType: '1', quesNum: info.free.quesNum }) }}>
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
                return <li key={index} onClick={() => { goSchedule(item) }}>
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
                    <div>
                      <Progress percent={item.overallProgress} strokeWidth={6} />
                    </div>
                    <div className="evaluate">
                      {
                        item.paperStatus === '1' ? <div className="list-level">
                          <div className="list-sorce">{item.score || 0}分,</div>
                          <div className='list-price'>{item.scoreLevel ? item.scoreLevel : '暂无'}</div>
                        </div> :
                          <span className="list-pro">
                          </span>
                      }
                    </div>
                    <div className='list-button'>
                      {item.paperStatus === '1' ? <div className='list-button-look'>查看报告</div> :<div style={{width:'84px',height:'32px'}}></div>}
                      <div className='list-button-con'>{item.paperStatus === '1' ? '重启答题' : '继续答题'}</div>
                      <div className='list-button-del'>删除记录</div>
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