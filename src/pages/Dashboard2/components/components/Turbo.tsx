import { Typography } from 'component/Box';
import { memo } from 'react';
import styled from 'styled-components';
import { imgurl } from "../../../../utils/globalimport";
import TurboItem from './TurboItem';
import whiteList from "../../../../config/constants/whiteList";
interface ITurbo {
  id: number;
  img: string;
  title: string;
  price: number;
  endTime: number;
  isSale: boolean;
  url: string;
}
const TurboBox = styled.div`
  .describe_box{
    display: flex;
    box-shadow: 0px 0px 0.3rem rgba(0, 0, 0, 0.05);
    border-radius: 0.1rem;
    padding: 0.4rem;
    .describe_text{
      margin-left: 0.4rem;
      line-height: 26px;
    }
  }
  .campaigns_box{
    margin-top: 0.4rem;
  }
`
const Turbo = memo(
  () => {
    const turboList: ITurbo[] = [
      {
        id: 1,
        img: "",
        title: "TURBO - NPics‘ OG NFT 1st Raffle",
        price: 0,
        endTime: 1662811200, //2022-08-09 04:20:05
        isSale: false,
        url: "https://www.premint.xyz/npics/"
      }
    ]
    return (
      <TurboBox>
        <div className='describe_box'>
          <div className='describe_img'>
            <img style={{ borderRadius: '10px' }} src={imgurl.dashboard.airdropTurboDescribe} alt="" />
          </div>
          <div className='describe_text'>
            Turbos is a unique collection of digital collectibles issued by NPics on the ethereum blockchain, bringing together multiple elements of NFT spiritual attributes and randomly generated by algorithms.
            Turbos mainly represents the spiritual trust of non-homogenous digital asset investors to the development of NFT ecology, but also a way to spread crypto digital culture, hoping to build a bridge between culture and value.
          </div>
        </div>
        <div className='campaigns_box'>
          <Typography fontSize={"0.2rem"} fontWeight={700} color={'#000'} marginBottom="0.08rem">Campaigns</Typography>
          <Typography fontSize={"0.14rem"} fontWeight={500} color={'rgba(0,0,0,0.5)'} marginBottom="0.2rem">Current Active：1</Typography>
          <div className='campaigns_list'>
            {
              turboList && turboList.map((item: ITurbo) => {
                return <TurboItem item={item} whiteList={whiteList.OGWhiteList} />
              })
            }
          </div>
        </div>
      </TurboBox>
    )
  }
)

export default Turbo