import React from 'react'

export default function Section2() {
  const list = [
    { title: '行动计划制定及执行', style: { top: '-22vh', left: '-25vw' } },
    { title: '安全管理体系完善', style: { top: '-22vh', left: '8vw' } },
    { title: '全方位安全管理自测评', style: { top: '-13vh', left: '-10vw' } },
    { title: '安全风险源头把控', style: { top: '1vh', left: '-25vw' } },
    { title: '问卷分发难，问卷分发难', style: { top: '-8vh', left: '15vw' } },
    { title: '安全管理措施查缺补漏', style: { top: '5vh', left: '8vw' } },
    { title: '全员参与', style: { top: '18vh', left: '12vw' } },
    { title: '安全管理持续改进', style: { top: '20vh', left: '-15vw' } },
    { title: '安全管理认知提升', style: { top: '32vh', left: '-22vw' } },
    { title: '安全管理权威专家咨询', style: { top: '30vh', left: '1vw' } },
  ]

  return (
    <div className='section section2'>
      <img className='section2-bg' src={require('@/assets/img/index/section2-bg.png')} 
      alt="" />
      <div className="section2-title">解决问题</div>
      <div className='section2-content'>
        {
          list.map((item, index) => (
            <div className="section2-content-item" style={item.style} key={index}>{item.title}</div>
          ))
        }
      </div>
    </div>
  )
}
