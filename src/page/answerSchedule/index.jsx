import React, { useState, useEffect } from "react";
import { Progress, Image, Message,Dropdown, Menu ,Spin} from 'antd'
import { RightOutlined, DownOutlined } from '@ant-design/icons'
import './index.less'
import { query, getCookie } from '@/utils'
import { decrypt } from '@/utils/aes';
import { withRouter } from "react-router-dom";
import { checkLockQuestion, createAnswer, getAnswer, submitPaper } from "../../api/answer";
import { logOut } from '@/api/login'

function AnswerSchedule(props) {
  const params = query()
  const [data, setData] = useState([])
  const [paperId, setPaperId] = useState(params.paperId)
  const [answerModule, setAnswerModule] = useState(null)
  const [loading, setLoading] = useState(true)

  const entCode = getCookie('entCode');
  const entName = getCookie('entName')
  const { transparent = false, fixed = false } = props

  useEffect(() => {
    if (paperId !== 'undefined') {
      getAnswer(paperId).then(res => {
        setLoading(false)
        setAnswerModule(res.data.moduleDetail)
        setData(res.data)
      })
    } else {
      const data = JSON.parse(params.body)
      createAnswer({ ...data, entCode }).then(res => {
        setLoading(false)
        setPaperId(res.data)
        getAnswer(res.data).then(res => {
          setAnswerModule(res.data.moduleDetail)
          setData(res.data)
        })
      })
    }
  }, [])

  const submit = () => {
    if (data.incompleteModule) {
      Message.info({ content: '还有板块未回答完成' })
      return
    }
    submitPaper({ paperId }).then(res => {
      if (res.code === 0) {
        props.history.push(`/report?paperId=${paperId}`);
      }
    })
  }

  const back = () => props.history.go(-1);

  const goDetail = (item) => {
    checkLockQuestion({ entCode, moduleId: item.moduleId }).then((res) => {
      if (res) props.history.replace(`/answerDetail?paperId=${paperId}&paperType=${item.paperType}&moduleId=${item.moduleId}`)
    }).catch(err => console.log(err))
  }
  const onMenuClick = ({ key }) => {
    if(key === 'logout'){
      logOut()
    } else {
      props.history.push('/personalCenter')
    }
  }
  
  const menu = (
    <Menu
      onClick={onMenuClick}
      items={[
        { label: '个人中心', key: 'user' },
        { label: '退出登录', key: 'logout' }
      ]}
    />
  )
  return (loading? <Spin className='answer-loading' tip="Loading..."/>:
    <div className='answer-schedule'>
      <div className='header-top'>
      <div className={`${transparent ? 'header_transparent' : 'header'} ${fixed?'header-fixde': ''}`}>
      <div className="header-left">
        <div className="header-title">企业安全自诊断平台</div>
      </div>
      <div className="header-right">
       
          <div className="header-user">
            <img className='header-user-avatar' src={require('@/assets/img/index/avatar.png')} alt="" />
            <Dropdown overlay={menu}>
              <div className='header-user-name'>
                {entName}<DownOutlined className='header-user-name-arrow'/>
              </div>
            </Dropdown>
            
            <div className="header-user-btn"  onClick={submit}>提交</div>
          </div>
      </div>
    </div>
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
                strokeWidth={10}
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
                        strokeWidth={6}
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
