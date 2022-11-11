import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts';
import { report } from '@/api/report'
import { withRouter } from 'react-router-dom';
import { query, getCookie } from '@/utils'
import './index.less'
import { decrypt } from '@/utils/aes';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';



function Report(props) {
  // const entCode = getCookie('entCode');
  // const [data, setData] = useState('1584433852406697985')
  const [common, setCommon] = useState({})
  const [chartData, setChartData] = useState([])  /* 图数据 */
  const [valueList, setValueList] = useState([]) /*  echart value数据 */
  const [maxAll, setMaxAll] = useState(0)  /* 满分 */
  const [percent, setPercent] = useState([]) /* 百分数 */
  useEffect(() => {
    const params = query()
    // console.log(params)
    report(params.paperId).then(res => {
      // console.log(res.data)
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
    initActive()

  }, [chartData, maxAll, valueList])

  const back = () => {
    props.history.go(-1)
  }

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
      // radar: {
      //   center: ['49%', '50%'], //图的位置
      //   radius: ["0%", "75%"],
      //   axisName: {
      //     color: "rgba(85, 85, 85, 1)",
      //     fontSize: 12
      //   },
      //   // shape: 'circle',
      //   indicator: chartData
      // },
      radar: {
        center: ['49%', '50%'], //图的位置
        radius: ["0%", "70%"],
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
          }
        },
        splitArea: {
          areaStyle: {
            color: ["rgba(255,255,255,0)", '#E3ECF8'],
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
        trigger: "axis",

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
          name: "百分之",
          type: "bar",
          barWidth: 45,
          data: common.columnarMap.y,
          itemStyle: {
            color: "rgba(2, 99, 255, 0.7)"
          }
        },
        {
          name: "标杆",
          type: "line",
          itemStyle: {
            color: "#f60"
          },
          symbolSize: 0,
          // yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用        
          data: [19, 2, 39, 19, 4, 1, 4, 2, 5, 1, 4]
        },
      ]
    }
    myTopChart.setOption(topOption);
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
      <div className="active-echart" id='active-echart' style={{ width: '600px', height: '300px', margin: 'auto' }}>
      </div>

    </div>
  )
}
export default withRouter(Report)