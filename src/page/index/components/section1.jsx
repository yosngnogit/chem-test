import React from 'react'
import { Carousel } from 'antd'

export default function Section1() {
  const list = [
    {
      url: require('@/assets/img/index/section1-test1.png'),
      title: '企业安全自我评测',
      desc: '基于国内安全管理法律法规要求，融入先进跨国公司最佳安全管理实践，运用先进模型推导，科学高效地帮助企业实现安全管理自我评测，并帮助企业找出自身差距，针对性、科学性的去改进现有的安全健康环保管理体系。'
    },
    {
      url: require('@/assets/img/index/section1-test1.png'),
      title: '企业风险等级评估',
      desc: '综合企业安全自评结果及企业基本信息填报，通过知识库及专家分析评估，挖掘企业风险及隐患，评估企业风险等级。'
    },
    {
      url: require('@/assets/img/index/section1-test1.png'),
      title: '企业安全管理专家咨询服务',
      desc: '提供国际一流安全专家团队咨询服务，针对安全自诊中的问题，提供针对性的安全问诊服务及科学性的解决方案。'
    },
  ]

  return (
    <div className='section section1'>
      <div className="section1-top">
        <div className="section1-top-title">专业性</div>
        <div className="section1-top-desc">具有非常鲜明的专业、需要学习很多有一定深度的专业知识</div>
        <div className="section1-top-btn">开始诊断</div>
      </div>
      <div className="section1-bottom">
        <div className="section1-bottom-title">中控安全自诊断服务内容及服务延伸</div>
        <Carousel className="section1-carousel">
          <div className='section1-carousel-item'>
            {list.map((item,index) => (
              <div className="section1-carousel-card" key={index}>
                <img className="section1-carousel-card-img" src={item.url}/>
                <div className="section1-carousel-card-title">{item.title}</div>
                <div className="section1-carousel-card-desc">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className='section1-carousel-item'>
            {list.map((item, index) => (
              <div className="section1-carousel-card" key={index}>
                <img className="section1-carousel-card-img" src={item.url}/>
                <div className="section1-carousel-card-title">{item.title}</div>
                <div className="section1-carousel-card-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </Carousel>
      </div>
    </div>
  )
}
