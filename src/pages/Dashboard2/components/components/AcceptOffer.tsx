import Modal from "../../../../component/Modal";
import {Box, Flex, Grid, Icon, Typography} from "../../../../component/Box";
import {CancelButton, ConfirmButton, PopupTitle} from "../../../Marketplace2/NFTPay";
import validIcon from "../../../../assets/images/market/nfts_opensea_valid.svg"
import wethIcon from "../../../../assets/images/market/weth_icon.svg"
import { OfferModal } from "./TableWarehouse";
interface IProps {
  showOffer: OfferModal
  setShowOffer:React.Dispatch<React.SetStateAction<OfferModal>>
}
export default function AcceptOffer(props:IProps) {
  const {showOffer} = props

  

  return <Modal isOpen={showOffer === OfferModal.OFFER}>
    <Box
      minWidth={"8.8rem"}
      background={`#fff`}
      borderRadius={`0.2rem`}
      padding={`0.4rem`}
    >
      <PopupTitle title={"Accept Offec"} canClose={false}/>
      <Grid
        marginTop={`0.3rem`}
        padding={`0.2rem 0.25rem`}
        borderRadius={`0.1rem`}
        border={`0.01rem solid #0000001A`}
        gridTemplateRows={"3.06rem auto"}
        gridTemplateColumns={`3.06rem auto`}
        gridTemplateAreas={`
          "img price"
          "receive receive"
        `}
        gridGap={`0.14rem`}
      >
        <Grid gridArea={`img`} borderRadius={"0.06rem"} background={`#eee`} overflow={"hidden"}>
          <Icon width={"100%"} height={"100%"}></Icon>
        </Grid>
        <Grid gridArea={`price`}>
          {/* Name and price */}
          <Flex flexDirection={`column`} alignItems={`stretch`}>
            <Flex gap={`0.06rem`} alignItems={`center`}>
              <Typography
                color={`#000`}
                fontSize={`0.14rem`}
                fontWeight={500}
              >Doodles</Typography>
              <Icon src={validIcon} width={`0.12rem`} height={`0.12rem`}></Icon>
            </Flex>
            <Typography
              marginTop={`0.06rem`}
              fontWeight={700}
              fontSize={`0.2rem`}
              color={`#000`}
            >Doodle #582</Typography>
            {/* Offer */}
            <Flex
              marginTop={`0.1rem`}
              border={`0.01rem solid #0000001A`}
              flex={1}
              borderRadius={`0.1rem`}
              flexDirection={`column`}
              alignItems={`stretch`}
              background={`#F6F6F6`}
              overflow={`hidden`}
            >
              <Flex flex={1} borderBottom={`0.01rem solid #0000001A`} background={`#fff`}>
                <OfferCell title={`Offer`} titleColor={`#000`} symbolIcon={true} symbolOrVal={`40.7`}/>
              </Flex>
              <OfferCell title={`Vault Debt`} symbolIcon={true} symbolOrVal={`40.7`}/>
              <OfferCell title={`X2Y2 Fee`} symbolIcon={false} symbolOrVal={`0.00%`}/>
              <OfferCell title={`Marker Fee`} symbolIcon={false} symbolOrVal={`0.00%`}/>
              <OfferCell title={`Creator Royalty`} symbolIcon={false} symbolOrVal={`0.00%`}/>
            </Flex>
          </Flex>
        </Grid>
        <Grid gridArea={`receive`}>
          <Flex
            background={`#7BD742`}
            borderRadius={`0.1rem`}
            padding={`0.3rem 0.4rem`}
            alignItems={`center`}
            justifyContent={`space-between`}
            style={{
              cursor: `pointer`,
              userSelect: `none`
            }}
          >
            <Typography
              color={`#000`}
              fontSize={`0.2rem`}
              fontWeight={700}
            >You Receive</Typography>
            <Flex flexDirection={`row`} gap={`0.06rem`} alignItems={`center`}>
              <Icon src={wethIcon}></Icon>
              <Typography
                color={`#000`}
                fontSize={`0.2rem`}
                fontWeight={700}
              >998.12</Typography>
              <Typography
                color={`rgba(0, 0, 0, .5)`}
                fontSize={`0.16rem`}
                fontWeight={500}
                marginLeft={`0.04rem`}
              >($123.123)</Typography>
            </Flex>
          </Flex>
        </Grid>
      </Grid>
      {/* buttons */}
      <Flex alignItems={"center"} justifyContent={"center"} gap={"0.2rem"} marginTop={"0.3rem"}>
        <CancelButton
          onClick={async () => {
            props.setShowOffer(OfferModal.NONE)
          }}>Cancel</CancelButton>
        <ConfirmButton
          onClick={() => {

          }}
        >Accept Offer</ConfirmButton>
      </Flex>
    </Box>
  </Modal>
}

function OfferCell(props: {
  title: string,
  titleColor?: string
  symbolIcon: boolean
  symbolOrVal?: string | number
}) {
  return <Flex
    flex={1}
    alignItems={`center`}
    justifyContent={`space-between`}
    padding={`0 0.3rem`}
  >
    <Typography
      color={props.titleColor ?? `rgba(0, 0, 0, .5)`}
      fontSize={`0.14rem`}
      fontWeight={500}
    >{props.title}</Typography>
    <Flex alignItems={`center`} gap={`0.06rem`}>
      <Icon src={wethIcon} width={`0.1rem`} height={`0.15rem`} hidden={!props.symbolIcon}/>
      <Typography
        fontSize={`0.14rem`}
        color={`#000`}
        fontWeight={500}
      >{props.symbolOrVal ?? `-`}</Typography>
    </Flex>
  </Flex>
}