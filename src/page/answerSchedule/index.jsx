import React, { useState, useEffect } from "react";
import { Progress, Image, Message } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import './index.less'
import { query, getCookie } from '@/utils'
import { decrypt } from '@/utils/aes';
import { withRouter } from "react-router-dom";
import { checkLockQuestion, createAnswer, getAnswer, submitPaper } from "../../api/answer";

function AnswerSchedule(props) {
  const params = query()
  const [data, setData] = useState([])
  const [paperId, setPaperId] = useState(params.paperId)
  const [answerModule, setAnswerModule] = useState(null)
  const entCode = getCookie('entCode');

  useEffect(() => {
    if (paperId !== 'undefined') {
      getAnswer(paperId).then(res => {
        setAnswerModule(res.data.moduleDetail)
        setData(res.data)
      })
    } else {
      const data = JSON.parse(params.body)
      createAnswer({ ...data, entCode }).then(res => {
        setPaperId(res.data)
        getAnswer(res.data).then(res => {
          setAnswerModule(res.data.moduleDetail)
          setData(res.data)
        })
      })
    }
  }, [])



  const back = () => props.history.go(-1);

  const goDetail = (item) => {
    checkLockQuestion({ entCode, moduleId: item.moduleId }).then((res) => {
      if (res) props.history.replace(`/answerDetail?paperId=${paperId}&paperType=${item.paperType}&moduleId=${item.moduleId}`)
    }).catch(err => console.log(err))
  }

  return (
    <div className='answer-schedule'>
      <div className='header-top'>
      </div>
      <div className="answer-main">
        <div className="answer-main-list">
          <div className="answer-cards">
            <div className="answer-top">
              <div>还有{data.incompleteModule}个板块未完成</div>
              <div>开始时间：{data.beginTime}</div>
            </div>
            <div className="answer-progracess">
              <div>总体回答进度：</div>
              <div className="pro-num">{data.overallProgress}%</div>
              <Progress
                percent={data.overallProgress}
                showInfo={false}
                width='1249px'
                strokeColor='#4074FF'
              />
            </div>

          </div>
          <div className="answer-space"></div>
          <ul className="answer-list">
            {
              answerModule ? answerModule.map((item, index) => {
                return <li key={index} onClick={() => goDetail(item)}>
                  <div style={{ height: '48px', padding: '3px 0' }}>
                    <Image src={require('@/assets/img/answerSchedule/Commissaryanswertip.png')} width={42} height={42} fit='fill' />
                  </div>
                  <div className="answer-title">
                    <div className="answer-title-name">{decrypt(item.moduleName)}</div>
                    <span>题数：{item.quesNum} <span className="ml-14">回答部门：{item.proposeAnswerDepart}</span></span>
                  </div>
                  <div className="answer-pro">
                    <div>
                      <Progress
                        percent={item.moduleProgress}
                        showInfo={false}
                        width='212px'
                        strokeColor='#4074FF'
                        height='6px'
                        style={{ marginRight: '8px' }}
                      />
                      {item.moduleProgress}%</div>
                    <div>
                      {item.canAnswer ? <RightOutlined color='#DCDCDC' /> : <span className="status">答题中</span>}
                    </div>
                    {/* {
                      !item.canAnswer && <span className="status">答题中</span>
                    }
                    <div> {item.canAnswer && <RightOutlined color='#DCDCDC' />}</div> */}
                  </div>
                </li>
              }) : ''
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default withRouter(AnswerSchedule)
