import React from 'react'
import { Carousel } from 'antd'

export default function Section3() {
  const list = [
    {
      content: '“拥有30多年化学品制造业大型投资项目管理、质量管理、SHE 管理经验。先后在巴斯夫、帝斯曼、杜邦等世界领先的化学品和科学公司担任大中华区、亚太区高级经理、部门总监、大型投资项目经理等职，在麦当劳负责整个中国区的 EHSS 业务。擅长 EHSS 体系的战略性规划、EHSS 组织设计和构建、EHSS 在线平台和数值化实施、行业标准体系的制定和贯彻执行。 ”',
      avatar: require('@/assets/img/index/section3-avatar1.png'),
      info: '雷平妹， 化工行业资深安全专家'
    },
    {
      content: '“29 年石化和化工企业工作经验，在中国石化、BP英国石油、杜邦、伯克希尔哈撒韦集团等国际一流企业负责安全管理、技术和项目管理工作，并担任安全总监和 EHS 总监多年。',
      avatar: require('@/assets/img/index/section3-avatar2.png'),
      info: '孙彦东， 资深工艺安全和设备完整性管理专家'
    },
  ]
  return (
    <div className='section section3'>
      <div className="section3-title">入驻专家</div>
      {/* <div className="section3-desc">他们都在使用</div> */}
      <Carousel className="section3-carousel" autoplay>
        {
          list.map((item, index) => (
            <div className='section3-carousel-item' key={index}>
              <div className="section3-carousel-item-content">{item.content}</div>
              <img className='section3-carousel-item-avatar' src={item.avatar} alt="" />
              <div className="section3-carousel-item-info">{item.info}</div>
            </div>
          ))
        }
      </Carousel>
    </div>
  )
}
