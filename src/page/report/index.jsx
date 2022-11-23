import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts';
import { report } from '@/api/report'
import { withRouter } from 'react-router-dom';
import { query, getCookie } from '@/utils'
import './index.less'
import { decrypt } from '@/utils/aes';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import ReportDetail from './components/reportDetail'



function Report(props) {
  // const entCode = getCookie('entCode');
  // const [data, setData] = useState('1584433852406697985')
  const [common, setCommon] = useState({})
  const [chartData, setChartData] = useState([])  /* 图数据 */
  const [valueList, setValueList] = useState([]) /*  echart value数据 */
  const [maxAll, setMaxAll] = useState(0)  /* 满分 */
  const [percent, setPercent] = useState([]) /* 百分数 */
  const [free, setFree] = useState('')/* 答题类型 */

  useEffect(() => {
    const params = query()
    setFree(params.paperType)
    report(params.paperId).then(res => {
      setCommon(res.data)
      setChartData(res.data.diagnosisPaperModuleTotalList.map((item) => {
        return { name: decrypt(item.moduleName), max: item.fullTotalCount }
      }))
      setValueList(res.data.diagnosisPaperModuleTotalList.map((item) => {
        return item.checkScoreCount
      }))
      let newArr = res.data.diagnosisPaperModuleTotalList.reduce((sum, current) => sum + current.fullTotalCount, 0)
      setMaxAll(newArr)
      setPercent(res.data.diagnosisPaperModuleTotalList.map((item) => {
        return item.percentTotal
      }))
    })
  }, [])


  useEffect(() => {
    if (chartData && chartData.length === 0) return
    initRendarChart()
    if (free === '2') initActive()
  }, [chartData, maxAll, valueList])

  const initRendarChart = () => {
    const chartTopDom = document.getElementById('rendar-echart');
    const myTopChart = echarts.init(chartTopDom);
    let topOption = {
      title: {
        // text: '基础雷达图'
      },
      tooltip: {
        formatter: function (params) {
          let relVal = params.name;
          let typeList = chartData
          let myMax = percent
          for (let i = 0; i < params.data.value.length; i++) {
            relVal += '<br/>' + typeList[i]['name'] + ' : '
              + myMax[i] + '%';
          }
          return relVal;
        }
      },
      legend: {
        show: false,
      },
      radar: {
        center: ['49%', '50%'], //图的位置
        radius: ["0%", "70%"],
        splitNumber: 4,
        axisName: {
          color: "#5C6E7C",
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#C9CFD8'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#C9CFD8'
            /*    ['#8543E0','#F52126','#2FC25B','#FACC14'] */
          }
        },
        splitArea: {
          areaStyle: {
            color: ["rgba(255,255,255,0)", '#E3ECF8'], /* ['#FDD3D4', '#D5F3DE', '#FEF5D0', '#E7D9F9'],
            shadowColor: 'rgba(255,255,255,0)', */
          }
        },
        indicator: chartData
      },
      series: [{
        name: '总分 vs 得分（Budget vs spending）',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: valueList,
            name: '最高分',
            symbolSize: 4,
            lineStyle: {
              color: "#0263FF",
            },
            itemStyle: {
              color: "#fff",
              borderColor: "#0263FF",
              borderWidth: 2,
            },
            areaStyle: {
              color: "rgba(2, 99, 255, 0.3)"
            }
          },
        ]
      }]
    };
    myTopChart.setOption(topOption);
  }

  const initActive = () => {
    // console.log(common.columnarMap.y)
    const chartTopDom = document.getElementById('active-echart');
    const myTopChart = echarts.init(chartTopDom);
    let topOption = {
      tooltip: {
        show: true,
        trigger: "axis",
        formatter: (parmas) => {
          return `
          <div style=" width: 150px; height: 80px;border-radius:4px;border:1px;border-color:#888;margin:auto;color:rgb(102,102,102)">
        <div style='margin-bottom:8px'>${parmas[0].axisValueLabel}</div>
        <div style='display:flex;justify-content:space-between;margin-bottom:5px'>
          <div style='display:flex'>
            <div style='width:10px;height:10px;background-color:rgba(2, 99, 255, 0.7);border-radius:5px;margin-top:6px;margin-right:5px'></div>得分占比</div>
          <div> ${parmas[0].data}%</div>
        </div>
        <div style='display:flex;justify-content:space-between'>         
          <div style='display: flex'>
          <div style='width:10px;height:10px;background-color:#f60;border-radius:5px;margin-top:6px;margin-right:5px'></div>标杆占比</div>
          <div> ${parmas[1].data}%</div>
        </div>
      </div>
        `
        },
      },
      title: {
        text: "模块得分占比与对标",
        left: "center",
        top: "10px",
        subtext: '',
        textStyle: {
          fontSize: 18
        },

      },
      xAxis: {
        data: common.columnarMap.x.map((item) => {
          return decrypt(item)
        }),
        axisLine: {
          show: true, //隐藏X轴轴线
          lineStyle: {
            color: '#888',
            width: 2
          }
        },
        axisTick: {
          show: false //隐藏X轴刻度
        },
        axisLabel: {
          color: "#888",
          rotate: 60
        },
      },
      yAxis: [
        {
          type: "value",
          // name: '课程：个',
          nameTextStyle: {
            color: "#888",
          },
          splitLine: {
            lineStyle: {
              color: "#306269",
              width: 0.2
            }
          },
          axisLabel: {
            color: "#888",
            formatter: function (value, index) {
              return value + '%';
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#306269",
              width: 0.2
            }
          }
        },
        {
          type: "value",
          position: "right",
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: "#888",
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#888",
              width: 0.2
            }
          }
        }

      ],

      series: [
        {
          name: "得分占比",
          type: "bar",
          barWidth: 45,
          data: common.columnarMap.y,
          itemStyle: {
            color: "rgba(2, 99, 255, 0.7)"
          },
        },
        {
          name: "标杆占比",
          type: "line",
          itemStyle: {
            color: "#f60"
          },
          symbolSize: 0,
          data: [19, 2, 19, 4, 1, 4, 2, 5, 1, 4, 39]
        },
      ]
    }
    myTopChart.setOption(topOption)
  }
  const goBack = () => {
    // 用路由定义type
    props.history.go(-1)
  }
  return (
    <div className='report'>
      <div className='header-top'>
      </div>

      <div style={{ textAlign: 'center', position: 'relative' }}>
        <Button type="link" className='back' onClick={() => goBack()}><LeftOutlined /></Button>
        <div className='title'>{common.entName ? common.entName : '某某公司'}安全自诊断报告</div>
        <div className='score'>{common.score ? common.score : 0}</div>
        <div className='totle'>综合得分</div>
        <div className='progress'>
          <div className='progress-icon' style={{ left: common.score ? `${common.score / maxAll * 275}px` : 0, top: '-150%' }}></div>
        </div>
      </div>
      <div id='rendar-echart' className='img-style' style={{ width: '368px', height: '252px', margin: 'auto' }}>
      </div>
      {free === '2' ? <div className="active-echart" id='active-echart' style={{ width: '600px', height: '300px', margin: 'auto' }}>
      </div> : ''}
      <ReportDetail />

    </div>
  )
}
export default withRouter(Report)