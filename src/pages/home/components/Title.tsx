import React, { useState } from 'react'
import styled from 'styled-components';
import { Swiper as SwiperProvider, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Swiper from "swiper/types/swiper-class"
import { Autoplay } from "swiper";
import { Link } from 'react-router-dom';
import ButtonDefault from 'component/ButtonDefault';

const TitleBox = styled.div`
  width: 7.03rem;
  .mySwiper{
    width: 100%;
  }
  .title_item{
    color: #fff;
      font-weight: 900;
      font-size: 0.38rem;
      line-height: 0.49rem;
      text-transform: uppercase;
      color: #FFFFFF;
      width: 7.03rem;
      margin-bottom: 0.1rem;
      font-style: italic;
  }
  .title_text{
    font-style: normal;
    font-weight: 300;
    font-size: 0.16rem;
    line-height: 0.32rem;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.5);
    width: 5.41rem;
    margin-top:0.2rem;
    margin-bottom: 0.72rem;
  }
  .title_point{
    height: 0.1rem;
    margin-bottom: 0.27rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .title_point_item{
      width: 0.7rem;
      height: 0.04rem;
      border-radius: 99.99rem;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.4);
      margin-left: 0.1rem;
    }
  }
  .title_btn{
    display: flex;
    button {
        margin-right: 0.2rem;
      }
  }
`
export default function Title() {
  const [swiper, setSwiper] = useState<Swiper>();
  const [selected, setSelected] = useState<number>(0);
  const changSwiper = (e: any) => {
    setSelected(e.activeIndex);
  }
  const getSwiper = (swiper: Swiper) => {
    setSwiper(swiper);
  }
  const changePoint = (index: number) => {
    if (swiper) {
      setSelected(index);
      swiper.slideTo(index);
    }
  }
  return (
    <TitleBox>
      <div className='title_box'>
        <SwiperProvider
          spaceBetween={30}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: true,
          }}
          modules={[Autoplay]}
          className="mySwiper"
          onSlideChange={changSwiper}
          onSwiper={getSwiper}
        >
          <SwiperSlide>
            <div className='title_item'>Pay as Low as 60% to own your favorite NFT</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='title_item'>GET 100% RIGHTS OF NFT AND POSITIVE REWARDS OF VAULT</div>
          </SwiperSlide>
        </SwiperProvider>
      </div>
      <div className='title_text'>The First NFT Leveraged Trading Platform for Web3</div>
      {/* <div className='title_point'>
        <div className='title_point_item' onClick={() => changePoint(3)} style={{ background: selected === 3 || selected === 1 ? '#fff' : 'rgba(255, 255, 255, 0.4)' }}></div>
        <div className='title_point_item' onClick={() => changePoint(2)} style={{ background: selected === 2 || selected === 0 ? '#fff' : 'rgba(255, 255, 255, 0.4)' }}></div>
      </div> */}
      <div className='title_btn'>
        <Link to={'/marketPlace'}><ButtonDefault types='three'>Marketplace</ButtonDefault></Link>
        <Link to={'/dashboard/rewards'}><ButtonDefault types='second' color={'#000'}>Rewards</ButtonDefault></Link>
      </div>
    </TitleBox>
  )
}
