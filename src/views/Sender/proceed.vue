<template>
  <div class="proceed-box">
    <CommBoxHeader :back="closerButton">Processing</CommBoxHeader>
    <div class="ProceedContent">
      <div v-for="item in proceedData" :key="item.title" class="contentItem">
        <span class="item-title" style="width: 100px; text-align: left">{{
          item.title
        }}</span>
        <span class="item-value right" v-if="item.desc || item.descInfo">{{
          item.desc
        }}</span>
        <CommLoading v-else class="right" width="1.2rem" height="1.2rem" />
      </div>
      <div class="chainDataContent">
        <div class="item left" style="z-index: 3">
          <div class="chain-name from">
            <span>{{ FromChainName }}</span>
          </div>
          <div class="chain">
            <svg-icon
              :iconName="showChainIcon()"
              style="width: 56px; height: 56px"
            ></svg-icon>
          </div>
          <div class="tx from-tx" @click="goToExplorFrom">
            <svg-icon
              v-if="$store.state.proceedState === 1"
              class="status-icon"
              color="#df2e2d"
              iconName="history_2"
            ></svg-icon>
            <svg-icon
              v-else-if="$store.state.proceedState === 2"
              class="status-icon"
              color="#df2e2d"
              iconName="history_3"
            ></svg-icon>
            <svg-icon
              v-else
              class="status-icon"
              color="#df2e2d"
              iconName="status-success"
            ></svg-icon>
            <span>{{ FromTx }}</span>
          </div>
          <div class="switch-btn" @click="() => switchNetWork()">
            Switch Network
          </div>
        </div>
        <div class="middle-icon">
          <div class="rocket-box">
            <SvgIconThemed
              :icon="isProcee ? 'rocket' : 'satellite'"
              size="xs"
            />
            <!-- <SvgIconThemed v-if="!isProcee && detailData" iconName="succeed" style="width:24px;height:24px;" /> -->
          </div>
          <div class="rocket-line-box">
            <SvgIconThemed
              icon="rocket-line"
              style="width: 161px; height: 14px; margin-top: 10px"
            />
          </div>
        </div>
        <div class="item right" style="z-index: 3">
          <div class="chain-name to">
            <span>{{ toChainName }}</span>
          </div>
          <div class="chain">
            <svg-icon
              :iconName="showChainIcon(false)"
              style="width: 56px; height: 56px"
            ></svg-icon>
          </div>
          <div class="tx to-tx" @click="goToExplorTo">
            <svg-icon
              v-if="$store.state.proceedState === 4"
              class="status-icon"
              color="#df2e2d"
              iconName="history_3"
            ></svg-icon>
            <svg-icon
              v-else-if="$store.state.proceedState === 5"
              class="status-icon"
              color="#df2e2d"
              iconName="status-success"
            ></svg-icon>
            <svg-icon
              v-else
              class="status-icon"
              color="#df2e2d"
              iconName="history_1"
            ></svg-icon>
            <span>{{ ToTx }}</span>
          </div>
          <div class="switch-btn" @click="() => switchNetWork(false)">
            Switch Network
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../util/util'
import { CommLoading, CommBoxHeader, SvgIconThemed } from '../../components'
export default {
  name: 'Proceeding',
  props: {},
  components: {
    CommBoxHeader,
    CommLoading,
    SvgIconThemed,
  },
  data() {
    return {}
  },
  computed: {
    FromChainName() {
      return (
        'From ' +
        util.chainName(
          this.$store.state.transferData.fromChainID,
          this.$env.localChainID_netChainID[
            this.$store.state.transferData.fromChainID
          ]
        )
      )
    },
    toChainName() {
      return (
        'To ' +
        util.chainName(
          this.$store.state.transferData.toChainID,
          this.$env.localChainID_netChainID[
            this.$store.state.transferData.toChainID
          ]
        )
      )
    },
    FromTx() {
      if (this.$store.state.proceedState === 1) {
        return 'View on Explore'
      } else {
        return `Tx:${util.shortAddress(
          this.$store.state.proceeding.userTransfer.txid
        )}`
      }
    },
    ToTx() {
      if (this.$store.state.proceedState < 4) {
        return 'View on Explore'
      } else {
        return `Tx:${util.shortAddress(
          this.$store.state.proceeding.makerTransfer.txid
        )}`
      }
    },
    isProcee() {
      return this.$store.state.proceedState !== 5
    },
    proceedData() {
      return [
        {
          title: 'Timestamp',
          desc: util.transferTimeStampToTime(
            this.$store.state.proceeding.userTransfer.timeStamp
          ),
        },
        {
          title: 'Value',
          desc:
            (
              this.$store.state.proceeding.userTransfer.amount /
              10 ** this.$store.getters.realSelectMakerInfo.precision
            ).toFixed(6) +
            ' ' +
            this.$store.state.transferData.selectTokenInfo.token,
        },
      ]
    },
  },
  watch: {},
  mounted() {},
  methods: {
    showChainIcon(isFrom = true) {
      return util.chainIcon(
        this.$store.state.transferData[`${isFrom ? 'from' : 'to'}ChainID`]
      )
    },
    switchNetWork(e) {
      let chainID
      if (e === 'from') {
        chainID = this.$store.state.transferData.fromChainID
      } else {
        chainID = this.$store.state.transferData.toChainID
      }
      this.addChainNetWork(chainID)
    },
    goToExplorFrom() {
      if (this.$store.state.proceedState === 1) {
        let url =
          this.$env.accountExploreUrl[
            this.$store.state.transferData.fromChainID
          ] + this.$store.state.web3.coinbase
        window.open(url, '_blank')
      } else {
        let txid = this.$store.state.proceeding.userTransfer.txid
        let url =
          this.$env.txExploreUrl[this.$store.state.transferData.fromChainID] +
          txid
        window.open(url, '_blank')
      }
    },
    goToExplorTo() {
      if (this.$store.state.proceedState < 4) {
        let url =
          this.$env.accountExploreUrl[
            this.$store.state.transferData.toChainID
          ] + this.$store.state.web3.coinbase
        window.open(url, '_blank')
      } else {
        let txid = this.$store.state.proceeding.makerTransfer.txid
        let url =
          this.$env.txExploreUrl[this.$store.state.transferData.toChainID] +
          txid
        window.open(url, '_blank')
      }
    },
    closerButton() {
      this.$store.commit('updateProceedTxID', null)
      this.$emit('stateChanged', '1')
    },
    reportError() {
      console.log('reportError')
    },
    addChainNetWork(useChainID) {
      var that = this
      var chain = util.getChainInfo(
        this.$env.localChainID_netChainID[useChainID]
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
          util.showMessage('switch success', 'success')
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
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.proceed-box {
  font-family: 'Inter Regular';
  border-radius: 20px;
  max-height: calc(
    100vh - 8.4rem - var(--top-nav-height) - var(--bottom-nav-height)
  );
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  .ProceedContent {
    position: relative;
    margin: 2.6rem 2rem 0 2rem;
    .contentItem {
      width: 100%;
      display: flex;
      margin-bottom: 12px;
    }
    .chainDataContent {
      height: 28rem;
      padding: 2rem 4rem;
      border-radius: 2rem;
      position: relative;
      display: flex;
      flex-direction: row;
      text-align: center;

      .item {
        width: 128px;
        height: 100%;
        z-index: 3;
        .chain-name {
          font-family: 'Inter Bold';
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          margin-bottom: 20px;
          white-space: nowrap;
          .label {
            font-weight: 400;
            font-size: 12px;
            line-height: 24px;
            margin-right: 12px;
          }
        }
        .chain {
          width: 100px;
          height: 100px;
          border: 1px solid #1dfff1;
          border-radius: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 14px;
        }
        .tx {
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          cursor: pointer;
          margin-top: 22px;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          text-decoration: underline;
          .status-icon {
            width: 24px;
            height: 24px;
            margin-right: 4px;
          }
        }
        .tx:hover {
          text-decoration: underline;
          color: red;
        }
        .switch-btn {
          width: 128px;
          height: 28px;
          border-radius: 20px;
          font-weight: 400;
          font-size: 14px;
          line-height: 28px;
          cursor: pointer;
        }
      }
      .middle-icon {
        flex: 1;
        .rocket-box {
          height: 60px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background-repeat: no-repeat;
        }
      }
    }
  }
}
</style>
