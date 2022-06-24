import {Box, Flex, Grid, Icon, Typography} from "../../component/Box";
import PopIcon from "../../assets/images/market/one_nft_pop.png"
import {imgurl} from "../../utils/globalimport";
import styled from "styled-components";
import NFTInfo from "./NFTInfo";
import NFTProperties from "./NFTProperties";
import NFTActivities from "./NFTActivities";
import NFTShare from "./NFTShare";
import NFTPrice from "./NFTPrice";
import {useEffect, useState} from "react";
import http from "../../utils/http";
import {CollectionDetail} from "../../model/user";
import {deserialize} from "class-transformer";

function Label(props: {
    icon: string,
    num: number
}) {
    return <Flex
        gap={".06rem"}
        alignItems={"center"}
        padding={"0 .1rem"}
        height={".24rem"}
        borderRadius={".14rem"}
        border={"1px sold #FFFFFF4D"}
        background={"#FFFFFF33"}
        style={{
            "cursor": "pointer"
        }}
        onClick={() => {
            // TODO: to rank
        }}
    >
        <Icon width={".2rem"} src={props.icon}/>
        <Typography
            fontSize={".14rem"}
            fontWeight={500}
            color={"#fff"}
            lineHeight={"100%"}
        >{props.num}</Typography>
    </Flex>
}

const NFTMain = styled.div`
  margin-top: .24rem;
  background: #fff;
  border-radius: .1rem;
  padding: .3rem;
  display: grid;
  grid-template-columns: 4.8rem 6.5rem auto;
  //grid-template-rows: 4.8rem auto auto;
  grid-template-rows: 4.8rem auto auto;
  grid-gap: .26rem;
  grid-template-areas: 
          "cover price share"
          "info activities activities"
          "props activities activities";
`

const Cover = styled.img`
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: .1rem;
`

export default function OneNFT() {
    const [detailData, setDetailData] = useState<CollectionDetail | undefined>(undefined)

    useEffect(() => {
        const inner = async () => {
            // prams from level up
            const resp: any = await http.myPost(`/npics-nft/app-api/v2/nft/getCollectionItemsDetail`, {
                address: "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b",
                tokenId: "16876"
            })
            if (resp.code === 200 && resp.data) {
                setDetailData(deserialize(CollectionDetail, JSON.stringify(resp.data)))
            } else {
            }
        }
        inner().finally()
    }, [])

    return <Box
        margin={"160px auto"}
        width={"16rem"}
    >
        {/* nav */}
        <Flex flexDirection={"row"} gap={".15rem"} alignItems={"start"}>
            <Icon height={".36rem"} width={".36rem"} src={PopIcon}/>
            <Flex flexDirection={"column"} gap={".05rem"}>
                <Typography fontSize={".16rem"} color={"#fff"} fontWeight={500}
                            fontFamily={"Montserrat"}>{detailData?.collectionName}</Typography>
                <Typography fontSize={".3rem"} color={"#fff"} fontWeight={800}
                            fontFamily={"Montserrat"}>{`${detailData?.collectionName} #${detailData?.tokenId}`}</Typography>
                <Flex flexDirection={"row"} gap={".15rem"}>
                    <Label
                        icon={imgurl.market.collect2}
                        num={detailData?.rarityScore ?? 0}
                    />
                </Flex>
            </Flex>
        </Flex>
        {/* main */}
        <NFTMain>
            <Grid gridArea={"cover"}><Cover src={detailData?.imageUrl}/></Grid>
            <Grid gridArea={"price"}><NFTPrice item={detailData}/></Grid>
            <Grid gridArea={"info"}><NFTInfo item={detailData}/></Grid>
            <Grid gridArea={"props"}><NFTProperties item={detailData}/></Grid>
            <Grid gridArea={"activities"}><NFTActivities/></Grid>
            <Grid gridArea={"share"}><NFTShare/></Grid>
        </NFTMain>
    </Box>
}