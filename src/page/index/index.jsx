import React, { useState } from 'react'
import { Carousel } from 'antd';

import './index.less'

// import Header from '@/components/header'
import Section1 from './components/section1';
import Section2 from './components/section2';
import Section3 from './components/section3';
import Section4 from './components/section4';

export default function Index() {
  const [ active, setActive ] = useState(0)

  const onCarouselChange = (from, to) => {
    setActive(to)
  }

  return (
    <div className='index'>
      {/* <Header transparent={active=== 0}/> */}
      <Carousel className="index-carousel" dotPosition="right" beforeChange={onCarouselChange}>
        <Section1/>
        <Section2/>
        <Section3/>
        <Section4/>
      </Carousel>
      <img className="index-arrow" src={require('@/assets/img/index/arrow.png')}/>
    </div>
  )
}
