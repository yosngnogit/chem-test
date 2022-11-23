import React, { Component } from 'react'
import { Menu, Message, Tooltip, Tree } from 'antd';
import { query, getCookie } from '@/utils';
import './index.less'
import { withRouter } from "react-router-dom";
import { getDirectory, getQuestionInfo, markedQuestion, nextMarked, nextNotAnswered, saveQuestion, submitModule } from "@/api/answer";
import { createWebSocket } from '@/utils/socket';
import { decrypt } from '@/utils/aes';
import { report } from '@/api/report'
const { DirectoryTree } = Tree;


class ReportDetails extends Component {
  state = {
    directory: [],
    collapsed: false,
    quesInfo: [],
    checkMap: {},
    markMap: {},
    markAll: 0,
    gData: [],
    fieldNames: {
      title: 'subjectContent',
      key: 'quesNo',
      children: 'childrenList'

    },
    statisObj: {},
    onSelectedKeys: [],
    openKeys: []
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
    // const entCode = getCookie('entCode');
    // this.ws = createWebSocket(`${entCode}/${this.moduleId}`);
    // getDirectory({
    //   paperType: this.paperType,
    //   moduleId: this.moduleId,
    // }).then(res => {
    //   this.setState({ directory: res.data })
    // });
    // this.getInfo(undefined, 'now')

    // // 获取左侧menu
    // getQuestionInfo({
    //   paperType: this.paperType,
    //   moduleId: this.moduleId,
    //   quesId: this.leafId,
    //   "operation": 'now'
    // }).then(res => {
    //   // this.state.markAll=res.data.markedNum
    //   this.setState({ markAll: res.data.markedNum })
    // })
    report(this.paperId).then(res => {
      console.log(res.data.diagnosisPaperTreeList)
      //  this.concatArray(res.data.diagnosisPaperTreeList)
      let innerArray = JSON.parse(JSON.stringify(res.data.diagnosisPaperTreeList));
      // console.log(this.concatArray(innerArray))
      let innerObj = {}
      // let eChildrenlist = []
      innerArray.map((item) => {
        // item.subjectContent =
        // item.quesNo + "、" + decrypt(item.subjectContent);
        item.childrenList.forEach((i) => {
          // i.subjectContent = i.quesNo + "、" + decrypt(i.subjectContent);
          i.totalArray = [];
          i.childrenList.forEach((e) => {
            // e.subjectContent = e.quesNo + "、" + decrypt(e.subjectContent);
            i.totalArray.push(e);
            innerObj[i.quesNo] = i.totalArray;
            // delete i.childrenList;
            // console.log(i.totalArray)
            i.eChildrenlist = JSON.parse(JSON.stringify(i.childrenList));
            // 有四级
            if (e.childrenList) {
              e.eChildrenlist = JSON.parse(JSON.stringify(e.childrenList));
              e.childrenList = []
              // i.totalArray = i.totalArray.push(e.eChildrenlist || []);
            }
            else {
              // i.totalArray = i.totalArray.concat(e.childrenList || []);
            }
          });
        });
      });
      console.log(innerObj)
      this.setState({
        // directory: res.data.diagnosisPaperTreeList,
        gData: innerArray,
        statisObj: innerObj,
        onSelectedKeys: ['1.1.1'],
        openKeys: ['1', '1.1', '1.1.1'],
        quesInfo: innerObj['1.1'].filter(item => item.quesNo == '1.1.1')

      })
    })
  }

  componentWillUnmount() {
    // this.ws.close()
  }
  nextNotAnswered = () => {
    nextNotAnswered({ paperType: this.paperType, moduleId: this.moduleId, quesId: this.leafId }).then(res => {
      if (!res.data.answerPage) {
        Message.info('已答完所有题目')
        this.getDirInfo()
        return;
      }
      // console.log(' res.data', res.data)
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

  marked = (item) => {
    const { quesId, marked } = item;
    let { markMap, markAll, quesInfo } = this.state;
    const newMark = (markMap[item.quesNo] !== undefined ? markMap[item.quesNo] : marked) ? 0 : 1
    this.setState({ markMap: { ...markMap, [item.quesNo]: newMark } }, () => {
      console.log(2222, this.state.markMap)
    })
    // console.log(first)
    markedQuestion({ marked: newMark, quesId }).then(res => {
      if (res.code === 0) {
        Message.info({ content: `${newMark ? '' : '取消'}标记成功` })
        if (newMark) {
          this.setState({ markAll: ++markAll })
        }
        else {
          this.setState({ markAll: markAll === 0 ? 0 : --markAll })
        }
      }
    })
  }


  titleRender = (nodeData) => {
    const text = <div className='inner-title'> <span>{nodeData.quesNo}、</span> {decrypt(nodeData.subjectContent)}</div>
    return <div className='tree-title-div'>
      <Tooltip title={
        text
      }>
        <div className='inner-title'>
          <span>{nodeData.quesNo}、</span> {decrypt(nodeData.subjectContent)}
        </div>
      </Tooltip>

    </div>
  }
  onTreeSelect = (selectedKeys, e) => {
    let selectArray = []
    // console.log(selectedKeys, e)
    let selectStr = ''
    if (selectedKeys[0].split('.').length === 3) {
      selectStr = selectedKeys[0].split('.')[0] + '.' + selectedKeys[0].split('.')[1]
      selectArray = this.state.statisObj[selectStr]
      this.setState({
        quesInfo: selectArray.filter(item => item.quesNo == selectedKeys),
        onSelectedKeys: selectedKeys
      })
    }
  }
  onTreeExpand = (selectedKeys, e) => {
    this.setState(
      {
        openKeys: selectedKeys
      }
    )
  }
  renderItem = (item, index) => {
    // console.log(1111111, item)
    const { markMap } = this.state;
    return <div key={index} className='question'>
      <p className='second-title'>{item.quesNo}&nbsp;&nbsp;{decrypt(item.subjectContent)}</p>
      <div className='result'>
        <p onClick={() => {
          this.marked(item)
        }}>
          <img
            style={{ width: '24px', height: '24px' }}
            src={(item.marked === 1)
              ? require('@/assets/img/answerDetail/star.png')
              : require('@/assets/img/answerDetail/unStar.png')}
            alt=''
          />
        </p>
        <div className='options'>
          {['完全满足', '部分满足', '不满足', '不适用'].map(v =>
            <span
              key={v}
              className={v === item.option ? 'active' : ''}
            >{v}</span>
          )}
        </div>
      </div>
    </div>
  }

  render() {
    const { quesInfo, directory, collapsed, activeKey, markAll, loading, fieldNames, gData, onSelectedKeys, openKeys } = this.state;
    return (
      <div className='answer-detail' >
        <div className='content'>
          <div className='bottom'>
            <div className='bottom-left'>
              <DirectoryTree
                blockNode
                fieldNames={fieldNames}
                expandedKeys={openKeys}
                selectedKeys={onSelectedKeys}
                treeData={gData}
                rootClassName='tree-div'
                onSelect={this.onTreeSelect}
                onExpand={
                  this.onTreeExpand
                }
                titleRender={
                  this.titleRender
                }
              />
            </div>
            <div className='bottom-right'>
              <div className='bottom-right-content'>
                {/* {quesInfo.map((info,index) => {
                  return <div key={info.quesNo}>
                    {
                       return  this.renderItem(info, index)
                    }
                  </div>
                })} */}
                {

                  <div>
                    {this.paperType === '1' ? quesInfo.map((item, index) => {
                      // this.quesId = item.quesId;
                      // this.leafId = item.quesId;

                      return this.renderItem(item, index)

                    }) :
                      quesInfo.map(prop => {
                        this.quesId = prop.quesId;
                        return <div className='nofree-bottom' key={prop.quesNo}>
                          <p className='first-title'>{prop.quesNo}&nbsp;&nbsp;{decrypt(prop.subjectContent)}</p>
                          {(prop.eChildrenlist || []).map((child, index) => {
                            // this.leafId = prop.eChildrenlist[0].quesId;
                            return this.renderItem(child, index)
                          })}
                        </div>
                      })}
                  </div>
                }


              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
export default withRouter(ReportDetails)