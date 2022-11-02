import React from 'react'

export default function Section2() {
  const list = [
    {
      title: '行动计划制定及执行',
      style: { top: '28%', left: '29%' }
    },
    {
      title: '安全管理体系完善',
      style: { top: '28%', left: '56%' }
    },
    {
      title: '全方位安全管理自测评',
      style: { top: '37%', left: '41%' }
    },
    {
      title: '安全风险源头把控',
      style: { top: '51%', left: '22%' }
    },
    {
      title: '问卷分发难，问卷分发难',
      style: { top: '44%', left: '69%' }
    },
    {
      title: '安全管理措施查缺补漏',
      style: { top: '57%', left: '62%' }
    },
    {
      title: '全员参与',
      style: { top: '69%', left: '64%' }
    },
    {
      title: '安全管理持续改进',
      style: { top: '72%', left: '39%' }
    },
    {
      title: '安全管理认知提升',
      style: { top: '82%', left: '33%' }
    },
    {
      title: '安全管理权威专家咨询',
      style: { top: '78%', left: '56%' }
    },
  ]

  return (
    <div className='section section2'>
      <img className='section2-bg' src={require('@/assets/img/index/section2-bg.png')} 
      alt="" />
      <div className="section2-title">解决问题</div>
      {
        list.map((item, index) => (
          <div className="section2-desc" style={item.style} key={index}>{item.title}</div>
        ))
      }
    </div>
  )
}
