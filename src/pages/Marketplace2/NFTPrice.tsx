import {Box, Button2, Flex, Grid, Icon, Typography} from "../../component/Box";
import styled from "styled-components";
import tipsIcon from "../../assets/images/market/exclamation_point.png"
import {CollectionDetail, CollectionItems} from "../../model/user";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import BigNumber from "bignumber.js";
import {numberFormat, thousandFormat} from "../../utils/urls";
import {useEffect, useState} from "react";
import {fetchUser, updateARP} from "../../store/app";
import {percentageFormat} from "./utils";
import http from "../../utils/http";
import {deserializeArray} from "class-transformer";
import {Npics} from "../../abis/Npics";
import {ethers} from "ethers";
import Modal from "../../component/Modal";
import NFTPay from "./NFTPay";
import {message, notification, Popover} from "antd";
import {globalConstant} from "utils/globalConstant";
import {useNavigate} from 'react-router-dom';
import {useWeb3React} from "@web3-react/core";
import {connectors} from "../../utils/connectors";
import {getNFTStatusInOpensea} from "../../utils/opensea";
import {listedPricePop, VaultAprPop, DownPaymentPop} from "utils/popover";
import ethIcon from "../../assets/images/market/eth_icon.svg"
import {SessionStorageKey} from "utils/enums";
import {simpleRpcProvider} from "../../utils/rpcUrl";
import {useAsync} from "react-use";
import {injected} from "../../connectors/hooks";
import {TextPlaceholder} from "../../component/styled";
import NFTPayProgressing from "./NFTPayProgressing";
import NFTPayCongratulations from "./NFTPayCongratulations";
import NFTPayWrong from "./NFTPayWrong";
import { Pop, Pop20 } from "component/Popover/Popover";

const Shadow = styled(Flex)`
  background: #fff;
  box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.1);
  border-radius: 0.1rem;
  width: 0;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.13rem;
  position: relative;
`

const TipsIcon = styled(Icon)`
  position: absolute;
  top: 0.14rem;
  right: 0.14rem;
`

const BuyBox = styled(Flex)`
  box-sizing: border-box;
  background: #00000008;
  border: 0.01rem solid #00000033;
  border-radius: 0.1rem;
  padding: 0.2rem 0 0 0.4rem;
  position: relative;
`

const BuyButton = styled(Button2)`
  cursor: pointer;
  font-weight: 700;
  font-size: 0.2rem;
  min-width: 3.9rem;
  height: 0.82rem;
  margin-top: 0.21rem;
`

const OtherNFT = styled.img`
  display: block;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  border-radius: 0.1rem;
  border: 0.01rem solid #eee;
  position: relative;
  background: transparent;
`

function MoreNFT(props: {
  img: string,
  total?: number,
  tap?(): void
}) {
  return <Pop20 content="View All"><Box position={"relative"}
              borderRadius={"0.1rem"}
              overflow={"hidden"}
              width={"1rem"}
              style={{
                "cursor": "pointer"
              }}
              onClick={props.tap}
  >
    <OtherNFT src={props.img}/>
    <Flex
      background={"#000000CC"}
      position={"absolute"} top={0} left={0} bottom={0} right={0}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Typography
        lineHeight={"1.5"}
        color={"#fff"}
        fontWeight={500}
        fontSize={"0.16rem"}
      >
        {props.total}<br/>Items
      </Typography>
    </Flex>
  </Box></Pop20>
}

export default function NFTPrice(props: {
  item?: CollectionDetail,
  refreshBlock?(): void
}) {
  const action = useAppDispatch()
  const ethRate = useAppSelector(state => new BigNumber(state.app.data.EthPrice))
  const vaultAPR = useAppSelector(state => (state.app.rewardsAPR ?? 0) - (state.app.interestAPR ?? 0) / 100)
  // const updater = useAppSelector(updater => updater.app)
  const rewardsAPR = useAppSelector(state => state.app.rewardsAPR)
  const interestAPR = useAppSelector(state => state.app.interestAPR)
  const [recommendNFTs, setRecommendNFTs] = useState<CollectionItems[]>([]) // max is 6
  const [recommendNFTTotal, setRecommendNFTTotal] = useState<number | undefined>(undefined)
  const [availableBorrow, setAvailableBorrow] = useState<BigNumber | undefined>(undefined)
  const [actualAmount, setActualAmount] = useState<BigNumber>()
  const navigate = useNavigate()
  const {account, provider, connector} = useWeb3React()
  // progressing popup
  const [progressingPopupOpen, setProgressingPopupOpen] = useState(false)
  // success popup
  const [successPopupOpen, setSuccessPopupOpen] = useState(false)
  // failed popup
  const [failedPopupOpen, setFailedPopupOpen] = useState(false)
  const [hash, setHash] = useState<string>()

  const [buyPopOpen, setBuyPopOpen] = useState<boolean>(false)

  useEffect(() => {
    action(updateARP())
  }, [props.item])

  useAsync(async () => {
    if (props.item) {
      // get recommends
      let resp: any = await http.myPost(`/npics-nft/app-api/v2/nft/getCollectionItems`, {
        address: props.item.address,
        direction: "asc",
        pageIndex: 1,
        pageSize: 10,
        search: null,
        showNftx: globalConstant.showNftx
      })
      if (resp.code === 200 && resp.data.records) {
        let listData = deserializeArray(CollectionItems, JSON.stringify(resp.data.records))
          .filter(it => it.tokenId != props.item?.tokenId)
        listData.splice(0, listData.length - 6) ///< max 6
        setRecommendNFTs(listData)
        setRecommendNFTTotal(resp.data.total)
      } else {
      }
    }
  }, [props.item])

  useAsync(async () => {
    if (props.item?.address && provider) {
      let contract = new Npics(provider)
      const availableBorrow = await contract.getAvailableBorrowsln(props.item.address)
      setAvailableBorrow(availableBorrow)
    }
  }, [props.item, provider])

  useEffect(() => {
    let _item = props.item
    if (_item && availableBorrow) {
      setActualAmount(_item.currentBasePrice.minus(availableBorrow))
    }
  }, [props.item, availableBorrow])

  useAsync(async () => {
    if (hash && props.item && account) {
      await http.myPost(`/npics-nft/app-api/v2/neo/commitNeo`, {
        hash: hash,
        nftAddress: props.item.address,
        tokenId: props.item.tokenId,
        userAddress: account
      })
    }
  }, [hash])

  async function buyClick() {
    try {
      if (!account) {
        await injected.activate(1)
      }
      // refresh detail data
      props.refreshBlock?.()

      if (props.item && availableBorrow) {
        setBuyPopOpen(true)
      }
    } catch (e: any) {
      message.error(`${e.message}`)
    }
  }

  return <Grid gridTemplateRows={"1.1rem 1rem auto"} gridRowGap={"0.12rem"}>
    <Modal isOpen={buyPopOpen} onRequestClose={() => setBuyPopOpen(false)}>
      <NFTPay
        /// line 150: require value
        nft={props.item!}
        availableBorrow={availableBorrow!}
        actualAmount={actualAmount!}
        progressBlock={() => {
          setProgressingPopupOpen(true)
          setBuyPopOpen(false)
        }}
        resultBlock={(success, hash) => {
          setProgressingPopupOpen(false)
          if (success) {
            setSuccessPopupOpen(true)
            setHash(hash)
          } else {
            setFailedPopupOpen(true)
          }
        }}
        cancelBlock={() => {
          setBuyPopOpen(false)
        }}
      />
    </Modal>

    {/* popup loading */}
    <Modal isOpen={progressingPopupOpen}>
      {props.item && <NFTPayProgressing nft={props.item}/>}
    </Modal>

    {/* popup success ✅ */}
    <Modal isOpen={successPopupOpen} onRequestClose={() => {
      setSuccessPopupOpen(false)
    }}>
      {props.item && hash ? <NFTPayCongratulations hash={hash} nft={props.item!} dismiss={() => {
        setSuccessPopupOpen(false)
      }}/> : null}
    </Modal>

    {/* popup failed ❌ */}
    <Modal isOpen={failedPopupOpen}>
      <NFTPayWrong back={() => {
        setFailedPopupOpen(false)
      }}/>
    </Modal>

    <Flex gap={"0.1rem"}>
      {/* origin price */}
      <Shadow>
        <Pop20
          content={listedPricePop}>
          <TipsIcon width={"0.14rem"} src={tipsIcon}/>
        </Pop20>

        <Flex flexDirection={"row"} alignItems={"end"}>
          <Flex alignSelf={"center"}><Icon width={"0.22rem"} height={"0.22rem"} src={ethIcon}/></Flex>
          <Typography
            fontSize={"0.24rem"}
            fontWeight={700}
            color={"rgba(0,0,0,1)"}
            lineHeight={"100%"}
            // verticalAlign={"middle"}
            // height={"auto"}
            marginLeft={"0.02rem"}
          >{props.item?.basePriceFormat() ?? TextPlaceholder}</Typography>
          <Typography
            fontSize={"0.14rem"}
            fontWeight={500}
            color={"rgba(0,0,0,.5)"}
            marginLeft={"0.02rem"}
            lineHeight={"100%"}
            marginBottom={"0.03rem"}
            style={{alignSelf: 'end'}}
          >
            {
              `（${
                props.item && thousandFormat(props.item.currentBasePrice
                  .times(ethRate)
                  .div(10 ** 18)
                  .toNumber())
              }）`
            }
          </Typography>
        </Flex>
        <Flex style={{cursor: 'pointer'}} alignItems={"center"} gap={"0.1rem"}
              onClick={() => window.open(`${props.item?.marketUrl}`)}>
          <Box
            borderRadius={"0.11rem"}
            overflow={"hidden"}
          >
            <Icon width={"0.22rem"} height={"0.22rem"} src={props.item?.marketIcon()}/>
          </Box>

          <Typography
            fontSize={"0.14rem"}
            fontWeight={500}
            color={"rgba(0,0,0,.5)"}
          >Listed Price</Typography>
        </Flex>
      </Shadow>
      {/* Vault Apr */}
      <Shadow>
        {/* <Popover content={vaultApr({rewardAPR:123,interestAPR:321})}>     */}
        <Pop
                 content={VaultAprPop({rewardAPR: (rewardsAPR ?? 0), interestAPR: ((interestAPR ?? 0) / 100)})}>
          <TipsIcon width={"0.14rem"} src={tipsIcon}/>
        </Pop>
        <Typography
          color={"#FF490F"}
          fontSize={"0.24rem"}
          lineHeight={"100%"}
          fontWeight={700}
        >{percentageFormat(vaultAPR)}</Typography>
        <Typography
          fontSize={"0.14rem"}
          fontWeight={500}
          color={"rgba(0,0,0,.5)"}
        >Vault APR</Typography>
      </Shadow>
    </Flex>
    {/* Other NFTs */}
    <Grid
      gridTemplateColumns={"repeat(6, auto)"}
      gridGap={"0.1rem"}
      overflow={"hidden"}
      justifyContent={"start"}
    >
      {
        recommendNFTs.map((nft, idx) => {
          if (recommendNFTs.length === idx + 1) {
            return <MoreNFT
              tap={() => {
                navigate(`/marketplace/collections/${nft?.address}`)
              }}
              img={nft.imageUrl}
              total={recommendNFTTotal}
              key={nft.tokenId}
            />
          } else {
            return <Pop20
              key={nft.tokenId}
              content={`${nft && `${nft.nftName() ?? ""}${nft.isNoName() ? "" : " #"}${nft.tokenId}`}`}
            ><OtherNFT
              src={nft.imageUrl}
              onClick={() => {
                navigate(`/nft/${nft.address}/${nft.tokenId}`, {replace: true})
              }}
              key={nft.tokenId}
            /></Pop20>
          }
        })
      }
    </Grid>
    {/* Buy handler */}
    <BuyBox
      flexDirection={"column"}
      alignItems={"start"}
    >
      <Pop
        content={DownPaymentPop({listedPrice: props.item?.currentBasePrice, loanAmount: availableBorrow})}>
        <TipsIcon width={"0.14rem"} src={tipsIcon}/>
      </Pop>
      <Typography
        fontSize={"0.14rem"}
        fontWeight={500}
        color={"#000"}
      >Down Payment</Typography>
      <Flex alignItems={"end"} marginTop={"0.22rem"}>
        <Flex gap={"0.02rem"} alignItems={"center"}>
          <Icon width={"0.4rem"} height={"0.4rem"} src={ethIcon}/>
          <Typography
            fontSize={"0.4rem"}
            fontWeight={700}
            color={"#000"}
            lineHeight={"100%"}
            // verticalAlign={"bottom"}
            style={{
              "whiteSpace": "nowrap"
            }}
          >{
            (actualAmount && numberFormat(actualAmount.div(10 ** 18).toNumber())) ?? TextPlaceholder
          }</Typography>
        </Flex>
        <Typography
          fontSize={"0.14rem"}
          fontWeight={500}
          lineHeight={"2"}
          padding={0}
        >
          {
            actualAmount && `（${
              actualAmount && thousandFormat(actualAmount
                .times(ethRate)
                .div(10 ** 18)
                .toFixed())
            }）`
          }
        </Typography>
      </Flex>
      <BuyButton
        disabled={actualAmount == null}
        onClick={buyClick}
      >Buy Now</BuyButton>
    </BuyBox>
  </Grid>
}