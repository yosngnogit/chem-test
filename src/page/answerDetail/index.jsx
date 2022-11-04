import React, { Component } from 'react'
import { Menu, Message } from 'antd';
import { query, getCookie } from '@/utils';
import './index.less'
import { withRouter } from "react-router-dom";
import { getDirectory, getQuestionInfo, markedQuestion, nextMarked, nextNotAnswered, saveQuestion, submitModule } from "../../api/answer";
import { createWebSocket } from '@/utils/socket';
import { decrypt } from '@/utils/aes';



class AnswerDetail extends Component {

  state = {
    directory: [],
    collapsed: false,
    quesInfo: {},
    checkMap: {},
    markMap: {}
  }

  urlObj = query()

  paperType = this.urlObj.paperType;

  moduleId = this.urlObj.moduleId;

  paperId = this.urlObj.paperId;
  scoreMap = {
    '完全满足': "allSatisfyScore", //全部满足得分
    '部分满足': "partSatisfyScore", //部分满足得分
    '不满足': "dissatisfyScore", //不满足得分
    '不适用': "notSuitScore", //不适用得分
  }

  componentDidMount() {
    const entCode = getCookie('entCode');
    this.ws = createWebSocket(`${entCode}/${this.moduleId}`);

    // 获取左侧menu
    getDirectory({
      paperType: this.paperType,
      moduleId: this.moduleId,
    }).then(res => {
      this.setState({ directory: res.data })
    });
    this.getInfo(undefined, 'now');

  }
  // 点击右侧选项时触发
  getDirInfo = () => {
    getDirectory({
      paperType: this.paperType,
      moduleId: this.moduleId,
    }).then(res => {
      this.setState({ directory: res.data })
    });
  }
 
  nextNotAnswered = () => {
    nextNotAnswered({ paperType: this.paperType, moduleId: this.moduleId, quesId: this.leafId }).then(res => {
      if (!res.data.answerPage) {
        Message.info('已答完所有题目')
        return;
      }
      this.setState({ quesInfo: res.data.answerPage })
    })
  }
  nextMarked = () => {
    if (!this.nMarked) { this.nextMarkedId = this.leafId }
    nextMarked({ paperType: this.paperType, moduleId: this.moduleId, quesId: this.nextMarkedId }).then(res => {
      if (!res.data.answerPage) {
        Message.info('没有标记的题目')
        return
      }
      this.nMarked = true;
      this.nextMarkedId = res.data.quesId;
      this.setState({ quesInfo: res.data.answerPage })
    })
  }
  submit = () => {
    submitModule({ moduleId: this.moduleId }).then(res => {
      if (res.code === 0) this.goSchedule()
    })
  }

   
  goSchedule = () => this.props.history.replace(`/answerSchedule?paperId=${this.paperId}`)

  onChange = (item, v) => {
    const { checkMap } = this.state;
    this.setState({ checkMap: { ...checkMap, [item.quesNo]: v } })
    const oldChoice = (this.state.checkMap[item.quesNo] || item.check)
    saveQuestion({
      paperId: this.paperId,
      moduleId: this.moduleId,
      quesId: item.quesId,
      oldChoice,
      oldScore: item[this.scoreMap[oldChoice]],
      newChoice: v,
      newScore: item[this.scoreMap[v]]
    }).then(res => {
      if (res.data) console.log(1);
      else console.log(0);
    })
    console.log(this.paperId, this.moduleId)
  }
  marked = (item) => {
    const { quesId, marked } = item;
    const { markMap } = this.state;
    const newMark = (markMap[item.quesNo] !== undefined ? markMap[item.quesNo] : marked) ? 0 : 1
    this.setState({ markMap: { ...markMap, [item.quesNo]: newMark } })
    markedQuestion({ marked: newMark, quesId }).then(res => {
      if (res.code === 0) Message.info({ content: `${newMark ? '' : '取消'}标记成功` })
    })
  }
  goPrev = () => this.getInfo(this.quesId, 'up')

  goNext = () => this.getInfo(this.quesId, 'down')

  save = () => {
    Message.info({ content: '保存成功' })
    this.getInfo(this.quesId, 'now');
  }
  getInfo = (quesId, status) => {
    getQuestionInfo({
      paperType: this.paperType,
      moduleId: this.moduleId,
      quesId,
      "operation": status
    }).then(res => {
      console.log(res.data)
      if (!res.data.factorInfo) {
        Message.info({ content: `已经是${status === 'up' ? '第' : '最后'}一页了` })
        return;
      }
      const { data: { factorInfo = [] } } = res;
      this.setState({
        quesInfo: res.data || {},
        activeKey: factorInfo[0].factorNo
      })
    })
    console.log(this.quesInfo)
  }
  chooseOrder = (quesId) => {
    this.getInfo(quesId, 'now');
  }
  renderItem = (item, index) => {
    const { markMap } = this.state;
    return <div key={index} className='question'>
      <p className='second-title'>{item.quesNo}&nbsp;&nbsp;{decrypt(item.subjectContent)}</p>
      <div className='result'>
        <p onClick={() => {this.marked(item) }}>
          <img
            src={(markMap[item.quesNo] !== undefined ? markMap[item.quesNo] : item.marked)
              ? require('@/assets/img/answerDetail/star.png')
              : require('@/assets/img/answerDetail/unStar.png')}
            alt=''
          />
        </p>
        <div className='options' onClick={()=>this.getDirInfo()}>
          {['完全满足', '部分满足', '不满足', '不适用'].map(v =>
            <span
              key={v}
              className={v === (this.state.checkMap[item.quesNo] || item.check) ? 'active' : ''}
              onClick={() => this.onChange(item, v)}
            >{v}</span>
          )}
        </div>
      </div>
    </div>
  }

  render() {
    const { quesInfo, directory, collapsed } = this.state;
    return (
      <div className='answer-detail' >
        <div className='content'>
          <div className='top'>
            <div className="card-free">
              <img src={require('@/assets/img/answerEntrance/free.png')} width={38} height={44} fit='fill' />
              <div className="free-tip">
                <div className="free-tip-p">
                  <span>{decrypt(quesInfo.moduleName)}</span>
                </div>
                <span className='tip-span'>题数：{quesInfo.quesNum}</span>
              </div>
              <div className='top-botton' onClick={this.submit}>提交</div>
            </div>
            <div className='top-right'>
              <div onClick={this.nextNotAnswered} className='top-botton'>下一未回答</div>
              <div onClick={this.nextMarked} className='top-botton'>下一已标记</div>
              <div className='right-totle'>
                <div className='right-item'>
                  <div className='right-div-null' style={{ width: '15px', height: '15px', borderRadius: '2px', border: '1px solid #ccc' }}></div>
                  <div className='right-font'>未回答 <div className='right-num'>
                    {quesInfo.quesNum?quesInfo.quesNum-quesInfo.answeredQuesNum:''}
                    </div>
                    </div>
                </div>
                <div className='right-item'>
                  <div className='right-div-blue'></div>
                  <div className='right-font'>已回答<div className='right-num'>{quesInfo.answeredQuesNum}</div>
                  </div>

                </div>
                <div className='right-item' style={{ borderRight: '0', paddingRight: '0' }}>
                  <div className='right-div-star'>
                    <img src={require('@/assets/img/answerDetail/star.png')} width={18} height={18} style={{ marginRight: '12px' }} fit='fill' />
                  </div>
                  <div className='right-font'>已标记 <div className='right-num'>{quesInfo.markedNum}</div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className='bottom'>
            <div className='bottom-left'>

              {directory?directory.map((dir, index) => {
                return (
                  <Menu
                    mode="inline"
                    inlineCollapsed={collapsed}
                    key={index}
                  >
                    <Menu.SubMenu
                    key={dir.factorNo}
                      title={
                        <div className="item" style={{ display:'flex',justifyContent:'space-between' }}>
                          <span className='item-content'>{dir.factorNo}&nbsp;&nbsp;{decrypt(dir.factorContent)}</span>
                          <span className='item-order'><b>{dir.answeredQuesNum}</b>/{dir.quesNum}</span>
                        </div>
                      }
                    >
                      {dir.entCatalogueQuesVos ?
                        dir.entCatalogueQuesVos.map((v, i) => (
                          <Menu.Item
                            key={i}
                            style={{ paddingLeft: '7px' }}
                          >
                            <div className={v.check ? 'active' : ''} style={{ paddingLeft: '7px',display:'flex',justifyContent:'space-between' }} onClick={() => { this.chooseOrder(v.quesId) }} >
                              <div>{v.quesNo} </div>
                              <div style={{marginRight:'18px'}}>
                                <b>{v.answeredQuesNum ? `${v.answeredQuesNum}/` : ''}</b>{v.quesNum ? v.quesNum : ''}
                                </div>
                              </div>
                          </Menu.Item>
                        ))
                        : ""}
                    </Menu.SubMenu>
                  </Menu>
                )
              }):''}

            </div>
            <div className='bottom-right'>
              <div className='bottom-right-content'>
                {(quesInfo.factorInfo || []).map(info => {
                  return <div key={info.factorNo}>
                    {this.paperType === '1' ? (info.quesInfo || []).map((item, index) => {
                      this.quesId = item.quesId;
                      this.leafId = item.quesId;

                      return this.renderItem(item, index)

                    }) :
                      (info.quesInfo || []).map(prop => {
                        console.log(info.quesInfo)
                        this.quesId = prop.quesId;
                        return <div className='nofree-bottom' key={prop.quesNo}>
                          <p className='first-title'>{prop.quesNo}&nbsp;&nbsp;{prop.subjectContent}</p>
                          {(prop.childQues || []).map((child, index) => {
                            this.leafId = prop.childQues[0].quesId;
                            return this.renderItem(child, index)
                          })}
                        </div>
                      })}
                  </div>
                })}

              </div>
              <div className='bottom-right-footer'>
                <div className='footer'>
                  <div><div className='btn' onClick={this.goPrev} >上一页</div></div>
                  <div><div className='btn two' onClick={this.save}>保存</div></div>
                  <div><div className='btn' onClick={this.goNext}>下一页</div></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
export default withRouter(AnswerDetail)