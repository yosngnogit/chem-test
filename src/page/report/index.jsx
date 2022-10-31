import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts';
import { report } from '@/api/report'
import { withRouter } from 'react-router-dom';
import { query, getCookie } from '@/utils'
import './index.less'

 function Report(props) {
  const entCode = getCookie('entCode');
  // const [data, setData] = useState('1584433852406697985')
  const [common, setCommon] = useState({})
  const [chartData, setChartData] = useState([])  /* 图数据 */
  const [valueList, setValueList] = useState([]) /*  echart value数据 */
  const [maxAll, setMaxAll] = useState(0)  /* 满分 */
  const [percent,setPercent]=useState([]) /* 百分数 */


  useEffect(() => {
    const params=query()
    console.log(params)
    report(params.paperId).then(res => {
      setCommon(res.data)
      setChartData(res.data.diagnosisPaperModuleTotalList.map((item) => {
        return { name: item.moduleName, max: item.maxTotal }
      }))
      setValueList(res.data.diagnosisPaperModuleTotalList.map((item) => {
        return item.total
      }))
      let newArr = res.data.diagnosisPaperModuleTotalList.reduce((sum, current) => sum + current.maxTotal, 0)
      setMaxAll(newArr)
      setPercent(res.data.diagnosisPaperModuleTotalList.map((item) => {
        return item.percentTotal
      }))
    })
  }, [])

  useEffect(() => {
    if (chartData && chartData.length === 0) return
    initRendarChart()
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
       formatter:  function (params) {
        let relVal = params.name;
        // console.log(params)
        let typeList =chartData
        // console.log(typeList)
        let myMax=percent
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
        radius: ["0%", "75%"],
        axisName: {
          color: "rgba(85, 85, 85, 1)",
          fontSize: 12
        },
        // shape: 'circle',
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
  return (
    <div className='report'>
      <div className='header-top'>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <div className='title'>{common.entName ? common.entName : '某某公司'}安全自诊断报告</div>
        <div className='score'>{common.score?common.score:0}</div>
        <div className='totle'>综合得分</div>
        <div className='progress'>
          <div className='progress-icon' style={{ right: common.score?`${common.score / maxAll * 275}px`:0, top: '-150%' }}></div>
        </div>
        <div className='judge'>
          <span>优秀</span><span>良好</span><span>需改进</span>
          <span>危险</span>
        </div>
      </div>
      <div id='rendar-echart' className='img-style' style={{ width: '368px', height: '252px' ,margin:'auto'}}>
      </div>
    </div>
  )
}
export default withRouter(Report)