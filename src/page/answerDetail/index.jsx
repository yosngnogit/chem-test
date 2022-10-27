import React, { Component } from 'react'
import './index.less'
import { withRouter } from "react-router-dom";


class AnswerDetail extends Component {

  scoreMap = {
    '完全满足': "allSatisfyScore", //全部满足得分
    '部分满足': "partSatisfyScore", //部分满足得分
    '不满足': "dissatisfyScore", //不满足得分
    '不适用': "notSuitScore", //不适用得分
  }


  render() {
    // const {  quesInfo } = this.state;
    return (
      <div className='answer-detail' >
        <div>header</div>
        <div className='content'>
          <div className='top'>
            <div className="card-free" onClick={() => { }}>
              <img src={require('@/assets/img/answerEntrance/free.png')} width={38} height={44} fit='fill' />
              <div className="free-tip">
                <div className="free-tip-p">
                  <span>产品监督产品监督</span>
                </div>
                <span className='tip-span'>题数：78</span>
              </div>
              <div className='top-botton'>提交</div>
            </div>
            <div className='top-right'>
              <div onClick={this.nextNotAnswered} className='top-botton'>下一未回答</div>
              <div onClick={this.nextMarked} className='top-botton'>下一已标记</div>
              <div className='right-totle'>
                <div className='right-item'>
                  <div className='right-div-null' style={{ width: '15px', height: '15px', borderRadius: '2px', border: '1px solid #ccc' }}></div>
                  <div className='right-font'>未回答  <div className='right-num'>40</div></div>

                </div>
                <div className='right-item'>
                  <div className='right-div-blue'></div>
                  <div className='right-font'>已回答<div className='right-num'>8</div>
                  </div>

                </div>
                <div className='right-item' style={{borderRight:'0',paddingRight:'0'}}>
                  <div className='right-div-star'>
                  <img src={require('@/assets/img/answerDetail/star.png')} width={18} height={18} style={{marginRight:'12px'}} fit='fill' />
                  </div>
                  <div className='right-font'>已标记  <div className='right-num'>3</div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className='bottom'></div>
          {/* {(quesInfo.factorInfo || []).map(info => {
          return <div key={info.factorNo}>
            <div className='center'>
              <p>{info.factorNo}&nbsp;&nbsp;{info.factorContent}</p>
              <span className='order'><b>{info.answeredQuesNum}</b>/{info.quesNum}</span>
            </div>
            {this.paperType === '1' ? (info.quesInfo || []).map((item, index) => {
              this.quesId = item.quesId;
              this.leafId = item.quesId;
              return this.renderItem(item, index)
            }) :
              (info.quesInfo || []).map(prop => {
                this.quesId = prop.quesId;
                return <div className='bottom' key={prop.quesNo}>
                  <p className='first-title'>{prop.quesNo}&nbsp;&nbsp;{prop.subjectContent}</p>
                  {(prop.childQues || []).map((child, index) => {
                    this.leafId = prop.childQues[0].quesId;
                    return this.renderItem(child, index)
                  })}
                </div>
              })}
          </div>
        })} */}
        </div>
      </div>
    )
  }
}
export default withRouter(AnswerDetail)