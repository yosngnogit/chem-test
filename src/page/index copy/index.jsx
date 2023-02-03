import React, { useState, useRef } from 'react'
import { Carousel } from 'antd';

import './index.less'

import Header from '@/components/header'
import Section1 from './components/section1';
import Section2 from './components/section2';
import Section3 from './components/section3';
import Section4 from './components/section4';

export default function Index() {
  const carouselEl = useRef();
  const [ starTime, setStarTime ] = useState(0)
  const [ active, setActive ] = useState(0)

  const onCarouselChange = (from, to) => {
    setActive(to)
  }

  const mousewheel = (e) => {
    const { deltaY } = e
    let now = +new Date()
    if(now - starTime < 40) return setStarTime(now)
    if(deltaY > 0){
      if(active !== 3)
      carouselEl.current.next()
    } else {
      if(active !== 0)
      carouselEl.current.prev()
    }
    setStarTime(now)
  }

  const onArrowClick = () => {
    carouselEl.current.next()
  }



  return (
    <div className='index' onWheel={mousewheel}>
      <Header transparent={active === 0} fixed={true}/>
      <Carousel ref={carouselEl} className="index-carousel" dotPosition="right" beforeChange={onCarouselChange}>
        <Section1/>
        <Section2/>
        <Section3/>
        <Section4/>
      </Carousel>
      { active !== 3 &&
        <img className="index-arrow" src={require('@/assets/img/index/arrow.png')} alt="" onClick={onArrowClick}/>
      }
    </div>
  )
}
