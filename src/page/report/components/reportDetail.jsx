import React, { Component } from 'react'
import {  Tooltip, Tree } from 'antd';
import { query } from '@/utils';
import './index.less'
import { withRouter } from "react-router-dom";
import { decrypt } from '@/utils/aes';
import { report, nextMark } from '@/api/report'
const { DirectoryTree } = Tree;
class ReportDetails extends Component {
  state = {
    quesInfo: [],
    treeData: [],
    fieldNames: {
      title: 'subjectContent',
      key: 'quesNo',
      children: 'childrenList'

    },
    statisObj: {},
    nameObj: {},
    firstName: '',
    secondName: '',
    onSelectedKeys: [],
    openKeys: [],
    markParentNo: '',
    markQuestNo: ''
  }
  urlObj = query()
  paperType = this.urlObj.paperType;
  paperId = this.urlObj.paperId;
  markParentNo = '';
  markQuestNo = '';

  activeKey = ''
  scoreMap = {
    '完全满足': "allSatisfyScore", //全部满足得分
    '部分满足': "partSatisfyScore", //部分满足得分
    '不满足': "dissatisfyScore", //不满足得分
    '不适用': "notSuitScore", //不适用得分
  }

  componentDidMount() {
    if (this.paperType === '1') {
      this.markParentNo = '';
      this.markQuestNo = '1.1.1';
    } else {
      this.markParentNo = '1.1.1';
      this.markQuestNo = '1.1.1.1';
    }
    report(this.paperId).then(res => {
      let innerArray = JSON.parse(JSON.stringify(res.data.diagnosisPaperTreeList));
      let innerObj = {}
      let innerNameObj = {}
      let nameArray = []
      innerArray.forEach((item) => {
        nameArray.push(item)
        item.childrenList.forEach((i) => {
          i.totalArray = [];
          nameArray.push(i)
          i.childrenList.forEach((e) => {
            i.totalArray.push(e);
            innerObj[i.quesNo] = i.totalArray;
            i.eChildrenlist = JSON.parse(JSON.stringify(i.childrenList));
            // 有四级
            if (e.childrenList) {
              e.eChildrenlist = JSON.parse(JSON.stringify(e.childrenList));
              e.childrenList = []
            }
          });
        });
      });
      nameArray.forEach(v => {
        innerNameObj[v.quesNo] = decrypt(v.subjectContent)
      })
      this.setState({
        treeData: innerArray,
        statisObj: innerObj,
        nameObj: innerNameObj,
        onSelectedKeys: ['1.1.1'],
        openKeys: ['1', '1.1', '1.1.1'],
        quesInfo: innerObj['1.1'].filter(item => item.quesNo === '1.1.1'),
        firstName: innerNameObj['1'],
        secondName: innerNameObj['1.1']
      })
    })
  }

  nextMarked = () => {
    nextMark(
      {
        paperId: this.paperId,
        parentNo: this.markParentNo,
        quesNo: this.markQuestNo
      }
    ).then(({ data: res }) => {
      // console.log(res)
      this.activeKey = res.quesNo

      // 免费
      if (this.paperType === '1') {
        let nextArray = this.state.statisObj[res.factorNo].filter(item => item.quesNo === res.quesNo)
        let nextOpen = []
        for (let key in res) {
          if (res[key]) nextOpen.push(res[key])
        }
        this.markQuestNo = res.quesNo;
        this.setState({
          quesInfo: nextArray,
          onSelectedKeys: [res.quesNo],
          openKeys: nextOpen
        })
      } else {
        this.markParentNo = res.parentNo;
        this.markQuestNo = res.quesNo;
        let nextArray = []
        if (res.factorNo) {
          nextArray = this.state.statisObj[res.factorNo].filter(item => item.quesNo === res.parentNo)
          let nextOpen = []
          for (let key in res) {
            if (res[key]) nextOpen.push(res[key])
          }
          this.setState({
            quesInfo: nextArray,
            onSelectedKeys: [res.parentNo],
            openKeys: nextOpen
          })
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
    let selectStr = ''
    let fisrtNameKey = ''
    let firstName = ''
    let secondName = ''
    this.activeKey = ''
    if (selectedKeys[0].split('.').length === 3) {
      // console.log('lalall', selectedKeys[0].split('.')[0])
      // 免费版
      if (this.paperType === '1') {
        this.markQuestNo = selectedKeys[0]
      } else {
        // 父级
        this.markParentNo = selectedKeys[0]
        // 当前
        this.markQuestNo = selectedKeys[0] + '.1'
      }
      selectStr = selectedKeys[0].split('.')[0] + '.' + selectedKeys[0].split('.')[1]
      selectArray = this.state.statisObj[selectStr]
      fisrtNameKey = selectedKeys[0].split('.')[0]
      firstName = this.state.nameObj[fisrtNameKey]
      secondName = this.state.nameObj[selectStr]
      this.setState({
        quesInfo: selectArray.filter(item => item.quesNo === selectedKeys[0]),
        onSelectedKeys: selectedKeys,
        firstName: firstName,
        secondName: secondName,
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
    return <div key={index} className='question' id={this.activeKey === item.quesNo ? 'activeShadow' : ''}>
      <p className='second-title'>{item.quesNo}&nbsp;&nbsp;{decrypt(item.subjectContent)}</p>
      <div className='result'>
        <p>
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
    const { quesInfo, firstName, secondName, fieldNames, treeData, onSelectedKeys, openKeys } = this.state;
    return (
      <div className='answer-detail' >
        <div className='content'>
          <div className='tips'>答题情况</div>
          <div className='bottom'>
            <div className='bottom-left'>
              <DirectoryTree
                blockNode
                fieldNames={fieldNames}
                expandedKeys={openKeys}
                selectedKeys={onSelectedKeys}
                defaultExpandParent
                treeData={treeData}
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
              <div className='bottom-title'>
                <p>{firstName} / <span>{secondName}</span></p>
                <div className='nextMark' onClick={this.nextMarked}>下一标记</div>
              </div>
              <div className='bottom-right-content'>
                <div>
                  {/* 免费版本 */}
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
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
export default withRouter(ReportDetails)