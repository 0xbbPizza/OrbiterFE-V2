<template>
  <div class="confirm-box">
    <comm-box-header
      :back="closerButton"
      style="margin-bottom: 5rem; margin-left: 0.5rem"
      >Confirm</comm-box-header
    >
    <div
      v-for="item in getConfirmData"
      :key="item.title"
      class="confirm-item"
      :style="{ marginBottom: '2rem' }"
    >
      <div class="item-left">
        <SvgIconThemed :icon="item.icon" />
        <span class="left-txt">{{ item.title }}</span>
        <comm-tooltip placement="topLeft">
          <template v-slot:titleDesc>
            <span>{{ item.notice }}</span>
          </template>
          <HelpIcon v-if="item.notice" size="sm" />
        </comm-tooltip>
      </div>
      <div class="item-right">
        <span v-if="item.desc">{{ item.desc }}</span>
      </div>
      <div v-if="item.descInfo && item.descInfo.length > 0" class="descBottom">
        <div
          v-for="desc in item.descInfo"
          :key="desc.no"
          style="margin-bottom: 1rem"
        >
          Send
          <span
            style="margin-left: 0.7rem; margin-right: 1.1rem; color: #df2e2d"
            >{{ desc.amount }}{{ desc.coin }}</span
          >
          To
          <span style="margin-left: 0.7rem; color: #df2e2d">{{
            desc.toAddress
          }}</span>
        </div>
      </div>
      <div
        v-if="item.haveSep"
        style="border-bottom: 0.2rem dashed rgba(0, 0, 0, 0.2); height: 4.3rem"
      ></div>
    </div>
    <CommBtn @click="RealTransfer" class="select-wallet-dialog">
      <span
        v-if="!transferLoading"
        class="wbold s16"
        style="letter-spacing: 0.1rem"
        >CONFIRM AND SEND</span
      >
      <CommLoading v-else width="3rem" height="3rem" />
    </CommBtn>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import getProceeding from '../../util/proceeding/getProceeding'
import {
  getTransferContract,
  getSourceContract,
} from '../../util/constants/contract/getContract.js'
import orbiterCore from '../../orbiterCore'
import {
  CommLoading,
  CommBoxHeader,
  SvgIconThemed,
  HelpIcon,
  CommBtn,
  CommTooltip,
} from '../../components'
import util from '../../util/util'
import Middle from '../../util/middle/middle'
import { ethers } from 'ethers'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Confirm',
  props: {},
  components: {
    CommBoxHeader,
    SvgIconThemed,
    HelpIcon,
    CommLoading,
    CommBtn,
    CommTooltip,
  },
  data() {
    return {
      transferLoading: false,
    }
  },
  asyncComputed: {},
  computed: {
    ...mapState(['transferData', 'confirmData', 'web3']),
    ...mapGetters(['isLogin', 'realSelectMakerInfo']),
    getConfirmData() {
      // 0.000120000000009022 to 0.000120...09022
      let realTransferAmount = new BigNumber(
        this.transferData.transferValue
      ).plus(new BigNumber(this.realSelectMakerInfo.tradingFee))

      return [
        {
          icon: 'withholding',
          title: 'Withholding Fee',
          notice:
            'Maker will charge Sender a fixed fee to cover the fluctuant gas fee incurred on the destination network.',
          desc:
            (this.realSelectMakerInfo
              ? this.realSelectMakerInfo.tradingFee
              : 0) +
            ' ' +
            this.realSelectMakerInfo.tName,
        },
        {
          icon: 'security',
          title: 'Security Code',
          notice:
            'In Orbiter, each transaction will have a security code. The code is attached to the end of the transfer amount in the form of a four-digit number to specify the necessary information for the transfer. If a Maker is dishonest, the security code will become the necessary evidence for you to claim money from margin contracts.',
          desc: '0',
          haveSep: true,
        },
        {
          icon: 'send',
          title: 'Total Send',
          notice:
            'Include the amount transferred by Sender and withholding gas fee.',
          desc: realTransferAmount + ' ' + this.realSelectMakerInfo.tName,
          textBold: true,
        },
        {
          icon: 'received',
          title: 'Received',
          desc:
            orbiterCore.getToAmountFromUserAmount(
              new BigNumber(this.transferData.transferValue).plus(
                new BigNumber(this.realSelectMakerInfo.tradingFee)
              ),
              this.realSelectMakerInfo,
              false
            ) +
            ' ' +
            this.realSelectMakerInfo.tName,
          textBold: true,
        },
        {
          icon: 'exchange',
          title: 'Maker Routes',
          notice:
            "After a sender submits a transfer application, the asset is transferred to the Maker's address and the Maker will provide liquidity. Orbiter's staking agreement ensures the security of the asset.",
          descInfo: this.confirmData.routeDescInfo,
        },
      ]
    },
  },
  watch: {},
  mounted() {},
  methods: {
    addChainNetWork() {
      var that = this
      var chain = util.getChainInfo(
        this.$env.localChainID_netChainID[this.transferData.fromChainID]
      )
      const switchParams = {
        chainId: util.toHex(chain.chainId),
      }
      window.ethereum
        .request({
          method: 'wallet_switchEthereumChain',
          params: [switchParams],
        })
        .then(() => {
          // switch success
          that.$store.commit('updateConfirmRouteDescInfo', [
            {
              no: 1,
              amount: new BigNumber(
                that.$store.state.transferData.transferValue
              ).plus(
                new BigNumber(
                  that.$store.getters.realSelectMakerInfo.tradingFee
                )
              ),
              coin: that.$store.state.transferData.selectTokenInfo.token,
              toAddress: util.shortAddress(
                that.$store.getters.realSelectMakerInfo.makerAddress
              ),
            },
          ])
          this.RealTransfer()
        })
        .catch((error) => {
          console.log(error)
          if (error.code === 4902) {
            // need add net
            const params = {
              chainId: util.toHex(chain.chainId), // A 0x-prefixed hexadecimal string
              chainName: chain.name,
              nativeCurrency: {
                name: chain.nativeCurrency.name,
                symbol: chain.nativeCurrency.symbol, // 2-6 characters long
                decimals: chain.nativeCurrency.decimals,
              },
              rpcUrls: chain.rpc,
              blockExplorerUrls: [
                chain.explorers &&
                chain.explorers.length > 0 &&
                chain.explorers[0].url
                  ? chain.explorers[0].url
                  : chain.infoURL,
              ],
            }
            window.ethereum
              .request({
                method: 'wallet_addEthereumChain',
                params: [params, that.$store.state.web3.coinbase],
              })
              .then(() => {})
              .catch((error) => {
                console.log(error)
                util.showMessage(error.message, 'error')
              })
          } else {
            util.showMessage(error.message, 'error')
          }
        })
    },
    async RealTransfer() {
      if (!this.isLogin) {
        Middle.$emit('connectWallet', true)
        return
      }

      if (
        this.web3.networkId.toString() !==
        this.$env.localChainID_netChainID[this.transferData.fromChainID]
      ) {
        this.addChainNetWork()
        return
      }

      // Only one
      if (this.transferLoading) {
        return
      }
      // sendTransfer
      this.transferLoading = true
      var fromChainID = this.transferData.fromChainID
      var selectMakerInfo = this.realSelectMakerInfo
      var amount = new BigNumber(this.transferData.amount).toFixed()
      var dest = this.transferData.destAddress
        ? this.transferData.destAddress
        : this.web3.coinbase

      const transferContract = getTransferContract(fromChainID, selectMakerInfo)
      console.log('transferContract: ', transferContract)
      const sourceContract = getSourceContract(
        this.transferData.fromChainID,
        selectMakerInfo
      )
      console.log('sourceContract: ', sourceContract)
      if (!sourceContract) {
        this.$notify.error({
          title: `Failed to obtain contract information, please refresh and try again`,
          duration: 3000,
        })
        this.transferLoading = false
        return
      }
      if (!transferContract) {
        this.$notify.error({
          title: `Failed to obtain contract information, please refresh and try again`,
          duration: 3000,
        })
        this.transferLoading = false
        return
      }
      const account = this.web3.coinbase

      try {
        if (
          this.transferData.selectMakerInfo.t1Address ==
          ethers.constants.AddressZero
        ) {
          // ETH
          const objOption = { from: account, gasLimit: 1000000, value: amount }
          if (dest) {
            sourceContract.methods
              .transferWithDest(
                Number(this.transferData.toChainID),
                dest,
                amount,
                0
              )
              .send(objOption, (error, transactionHash) => {
                this.transferLoading = false
                if (!error) {
                  console.warn('dest_transactionHash =', transactionHash)
                  this.onTransferSucceed(
                    account,
                    selectMakerInfo,
                    amount,
                    fromChainID,
                    transactionHash,
                    dest
                  )
                } else {
                  this.$notify.error({
                    title: error.message,
                    duration: 3000,
                  })
                }
              })
          } else {
            sourceContract.methods
              .transfer(Number(this.transferData.fromChainID), amount, 0)
              .send(objOption, (error, transactionHash) => {
                this.transferLoading = false
                if (!error) {
                  console.warn('transactionHash =', transactionHash)
                  this.onTransferSucceed(
                    account,
                    selectMakerInfo,
                    amount,
                    fromChainID,
                    transactionHash,
                    dest
                  )
                } else {
                  this.$notify.error({
                    title: error.message,
                    duration: 3000,
                  })
                }
              })
          }
        } else {
          // ERC20
          const objOption = { from: account, gasLimit: 1000000 }
          const allowance = await transferContract.methods
            .allowance(
              account,
              this.$env.sourceAddress[this.transferData.selectTokenInfo.token][
                this.transferData.fromChainID
              ]
            )
            .call()
          console.warn('transferContract allowance: ', allowance)
          if (ethers.BigNumber.from(allowance).lt(amount)) {
            const approveTransactionHash = await transferContract.methods
              .approve(
                this.$env.sourceAddress[
                  this.transferData.selectTokenInfo.token
                ][this.transferData.fromChainID],
                ethers.constants.MaxUint256
              )
              .send(objOption)
            console.warn('approveTransactionHash =', approveTransactionHash)
          }
          if (dest) {
            sourceContract.methods
              .transferWithDest(
                Number(this.transferData.toChainID),
                dest,
                amount,
                0
              )
              .send(objOption, (error, transactionHash) => {
                this.transferLoading = false
                if (!error) {
                  console.warn('dest_transactionHash =', transactionHash)
                  this.onTransferSucceed(
                    account,
                    selectMakerInfo,
                    amount,
                    fromChainID,
                    transactionHash,
                    dest
                  )
                } else {
                  this.$notify.error({
                    title: error.message,
                    duration: 3000,
                  })
                }
              })
          } else {
            sourceContract.methods
              .transfer(Number(this.transferData.fromChainID), amount, 0)
              .send(objOption, (error, transactionHash) => {
                this.transferLoading = false
                if (!error) {
                  console.warn('transactionHash =', transactionHash)
                  this.onTransferSucceed(
                    account,
                    selectMakerInfo,
                    amount,
                    fromChainID,
                    transactionHash,
                    dest
                  )
                } else {
                  this.$notify.error({
                    title: error.message,
                    duration: 3000,
                  })
                }
              })
          }
        }
      } catch (error) {
        this.transferLoading = false
        this.$notify.error({
          title: error.message,
          duration: 3000,
        })
      }
    },
    onTransferSucceed(
      from,
      selectMakerInfo,
      amount,
      fromChainID,
      transactionHash,
      dest
    ) {
      getProceeding.UserTransferReady(
        from,
        selectMakerInfo.makerAddress,
        amount,
        fromChainID,
        selectMakerInfo,
        transactionHash,
        dest
      )
      this.$notify.success({
        title: transactionHash,
        duration: 3000,
      })
      this.$emit('stateChanged', '3')
    },
    closerButton() {
      this.$emit('stateChanged', '1')
    },
    gasCost() {
      if (
        this.transferData.fromChainID === 3 ||
        this.transferData.fromChainID === 33
      ) {
        if (this.transferData.selectTokenInfo.token !== 'ETH') {
          return Number(this.transferData.gasFee).toFixed(4) + 'USD'
        }
      }
      return (
        (this.transferData.gasFee * this.transferData.ethPrice).toFixed(4) +
        'USD'
      )
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.confirm-box {
  font-family: 'Inter Regular';
  border-radius: 2rem;
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 2rem;
  .confirm-item {
    overflow: hidden;
    padding: 0 1rem;
    .item-left {
      float: left;
      display: flex;
      align-items: center;
      .left-txt {
        margin: 0 1rem 0 0.8rem;
      }
    }
    .item-right {
      float: right;
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 2.4rem;
      text-align: right;
      .textBold {
        font-weight: 600;
      }
    }

    .descBottom {
      max-height: 9.2rem;
      text-align: center;
      clear: both;
      padding-top: 2rem;
    }
  }
  .select-wallet-dialog {
    span {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 2rem;
      line-height: 2rem;
    }
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
    height: 5rem;
    width: 100%;
    background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
    box-shadow: inset 0rem -0.8rem 0rem rgba(0, 0, 0, 0.16);
    border-radius: 4rem;
  }
}
</style>
