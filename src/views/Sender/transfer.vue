<template>
  <div class="transfer-box">
    <div class="top-area">
      <span class="left">Token</span>
      <div class="left-value">
        <token-select
          class="select"
          :datas="tokens()"
          v-model="this.transferData.selectTokenInfo.token"
          @input="getTokenInfo"
        />
      </div>
    </div>
    <div class="from-area">
      <div class="subContent">
        <div class="topItem">
          <div class="left">From</div>
          <div v-if="isLogin" class="right">
            Balance:
            <loading
              v-if="fromBalanceLoading"
              style="left: 0.3rem; top: 0.2rem"
              width="1.2rem"
              height="1.2rem"
            ></loading>
            <span v-else>{{ fromBalance }}</span>
          </div>
        </div>
        <div class="bottomItem">
          <div class="selectChain" @click="changeFromChain">
            <div style="display: flex">
              <svg-icon
                :iconName="showChainIcon(this.transferData.fromChainID)"
                style="width: 2.4rem; height: 2.4rem; margin-right: 0.4rem"
              ></svg-icon>
              <span>{{
                showChainName(
                  this.transferData.fromChainID,
                  $env.localChainID_netChainID[this.transferData.fromChainID]
                )
              }}</span>
            </div>

            <SvgIconThemed v-if="this.fromChainArray.length > 1" />
          </div>
          <input
            type="text"
            v-model="transferValue"
            class="right"
            @input="checkTransferValue()"
            :maxlength="18"
            :placeholder="`${this.userMinPrice}~${this.userMaxPrice}`"
          />
          <el-button @click="fromMax" class="maxBtn" style="">Max</el-button>
        </div>
      </div>
    </div>
    <svg-icon
      v-if="true"
      class="exchange-icon"
      iconName="exchange"
      @click.native="transfer_mid"
    ></svg-icon>
    <div class="to-area">
      <div class="topItem">
        <div class="left">To</div>
        <div v-if="isLogin" class="right">
          Balance:
          <loading
            v-if="toBalanceLoading"
            style="left: 0.3rem; top: 0.2rem"
            width="1.2rem"
            height="1.2rem"
          ></loading>
          <span v-else>{{ toBalance }}</span>
        </div>
      </div>
      <div class="bottomItem">
        <div class="selectChain" @click="changeToChain">
          <div style="display: flex">
            <svg-icon
              :iconName="showChainIcon(this.transferData.toChainID)"
              style="width: 2.4rem; height: 2.4rem; margin-right: 0.4rem"
            ></svg-icon>
            <span>{{
              showChainName(
                this.transferData.toChainID,
                $env.localChainID_netChainID[this.transferData.toChainID]
              )
            }}</span>
          </div>

          <SvgIconThemed v-if="this.fromChainArray.length > 1" />
        </div>
        <div style="display: flex; align-items: center" class="right">
          <comm-tooltip>
            <template v-slot:titleDesc>
              <span v-html="toValueToolTip"></span>
            </template>
            <help-icon style="margin-left: 0.5rem" size="sm" />
          </comm-tooltip>

          <div class="to-value">{{ toValue }}</div>
        </div>
      </div>
    </div>
    <div class="destContent">
      <input
        type="text"
        v-model="destination"
        class="right"
        @input="checkDestination()"
        :maxlength="42"
        :placeholder="`Custom recipient`"
      />
    </div>
    <div
      :class="[
        'send-foot-btn',
        { disabled: sendBtnInfo ? sendBtnInfo.disabled : 'disabled' },
      ]"
      @click="sendTransfer"
    >
      <span class="w700 s16" style="letter-spacing: 0.15rem">{{
        sendBtnInfo && sendBtnInfo.text
      }}</span>
    </div>
    <div class="notice">
      <div v-if="isShowMax" class="item">
        <div class="left showMax">
          <svg-icon class="Icon" iconName="info"></svg-icon>
          <span class="Text showMax">
            Makers provide {{ maxPrice }}
            {{ this.transferData.selectTokenInfo.token }} for liquidity.
          </span>
        </div>
      </div>
      <div v-if="showSaveGas" class="item">
        <div class="left">
          <SvgIconThemed class="Icon" icon="orbiter" size="sm" />
          <span class="Text">Gas Fee Saved</span>
        </div>
        <div class="right">
          Save
          <loading
            v-if="saveGasLoading"
            style="margin: 0 1rem"
            width="1rem"
            loadingColor="red"
            height="1rem"
          ></loading>
          <span class="Text" v-else
            >{{ gasSavingMin }} ~ {{ gasSavingMax }}</span
          >
          <comm-tooltip placement="bottom">
            <template v-slot:titleDesc>
              <span v-html="gasFeeToolTip"></span>
            </template>
            <help-icon style="margin-left: 0.5rem" size="sm" />
          </comm-tooltip>
        </div>
      </div>
      <div class="item">
        <div class="left">
          <SvgIconThemed class="Icon" icon="clock" size="sm" />
          <span class="Text"> Time Spend &lt; {{ timeSpent }}</span>
        </div>
        <div class="right">
          Save
          <loading
            v-if="saveTimeLoading"
            style="margin: 0 1rem"
            width="1rem"
            loadingColor="#FFFFFF"
            height="1rem"
          ></loading>
          <span style="margin-left: 0.4rem" v-else>{{
            transferSavingTime
          }}</span>
          <comm-tooltip placement="bottom">
            <template v-slot:titleDesc>
              <span v-html="timeSpenToolTip"></span>
            </template>
            <help-icon style="margin-left: 0.5rem" size="sm" />
          </comm-tooltip>
        </div>
      </div>
    </div>
    <comm-dialog ref="SelectFromChainPopupRef">
      <div slot="PoperContent" style="width: 100%">
        <chain-select
          :ChainData="fromChainArray"
          :selectData="Number(this.transferData.fromChainID)"
          v-on:closeSelect="closeFromChainPopupClick()"
          v-on:getNetworkInfo="getFromChainInfo"
        />
      </div>
    </comm-dialog>
    <comm-dialog ref="SelectToChainPopupRef">
      <div slot="PoperContent" style="width: 100%">
        <chain-select
          :ChainData="toChainArray"
          :selectData="Number(this.transferData.toChainID)"
          v-on:closeSelect="closeToChainPopupClick()"
          v-on:getNetworkInfo="getToChainInfo"
        />
      </div>
    </comm-dialog>
  </div>
</template>

<script>
import {
  TokenSelect,
  ChainSelect,
  CommDialog,
  SvgIconThemed,
  Loading,
  HelpIcon,
  CommTooltip,
} from '../../components'
import makerInfo from '../../core/routes/makerInfo'
import util from '../../util/util'
import check from '../../util/check/check'
import transferCalculate from '../../util/transfer/transferCalculate'
import Middle from '../../util/middle/middle'
import orbiterCore from '../../orbiterCore'
import BigNumber from 'bignumber.js'
import config from '../../config'
import { exchangeToUsd } from '../../util/coinbase'
import { mapGetters, mapState, mapMutations } from 'vuex'
export default {
  name: 'Transfer',
  props: {},
  components: {
    Loading,
    TokenSelect,
    ChainSelect,
    CommDialog,
    SvgIconThemed,
    HelpIcon,
    CommTooltip,
  },
  data() {
    return {
      form: {
        name: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      destination: '',

      gasCostLoading: false,
      originGasLoading: false,

      saveTimeLoading: false,

      c1Balance: 0,
      c2Balance: 0,
      originGasCost: 0,

      makerInfoList: '',
      fromChainArray: [],
      toChainArray: [],
      tokenInfoArray: [],

      transferValue: '',

      exchangeToUsdPrice: 0,
    }
  },
  asyncComputed: {
    async userMaxPrice() {
      if (!this.isLogin) {
        return this.$store.getters.realSelectMakerInfo.maxPrice
      }
      // check selectMakerInfo
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      if (selectMakerInfo.precision === undefined) {
        return '0'
      }

      // check fromBalance
      if (!this.fromBalance) {
        return '0'
      }

      const transferGasFee =
        (await transferCalculate.getTransferGasLimit(
          this.transferData.fromChainID,
          selectMakerInfo.makerAddress,
          selectMakerInfo.t1Address
        )) || 0

      let avalibleDigit = orbiterCore.getDigitByPrecision(
        selectMakerInfo.precision
      )
      let opBalance = 10 ** -avalibleDigit
      let useBalanle = new BigNumber(this.fromBalance)
        .minus(new BigNumber(selectMakerInfo.tradingFee))
        .minus(new BigNumber(opBalance))
        .minus(new BigNumber(transferGasFee))
      let userMax =
        useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN) > 0
          ? useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
          : new BigNumber(0)
      let max =
        userMax.comparedTo(new BigNumber(selectMakerInfo.maxPrice)) > 0
          ? new BigNumber(selectMakerInfo.maxPrice)
          : userMax
      return max.toString()
    },

    async makerMaxBalance() {
      const selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let makerMaxBalance = 0
      try {
        const _balance = await this.getBalance(
          selectMakerInfo.makerAddress,
          selectMakerInfo.c2ID,
          selectMakerInfo.t2Address,
          selectMakerInfo.tName,
          selectMakerInfo.precision
        )
        if (_balance > 0) {
          // Max use maker balance's 95%, because it transfer need gasfee(also zksync need changePubKey fee)
          makerMaxBalance = _balance * 0.95
        }
      } catch (err) {
        console.error('Get maker balance error:', err.message)
      }
      return makerMaxBalance
    },
  },
  computed: {
    ...mapState(['transferData', 'web3']),
    ...mapGetters(['isLogin']),
    queryParams() {
      const { query } = this.$route
      const { referer } = query
      let { token, tokens, amount, fixed } = query
      amount = new BigNumber(amount)
      tokens = !tokens ? [] : tokens.split(',')

      const getMapChainId = (chainName) => {
        if (!chainName) {
          return 0
        }

        for (const key in this.$env.localChainMap) {
          if (util.equalsIgnoreCase(key, chainName)) {
            return this.$env.localChainMap[key]
          }
        }
        return 0
      }
      let source = getMapChainId(query.source)
      let dest = getMapChainId(query.dest)

      const getMapChainIds = (chainNames) => {
        const chainIds = []

        if (!chainNames) {
          return chainIds
        }

        for (const chainName of chainNames.split(',')) {
          const chainId = getMapChainId(chainName)
          if (chainId) {
            chainIds.push(chainId)
          }
        }

        return chainIds
      }
      let sources = getMapChainIds(query.sources)
      let dests = getMapChainIds(query.dests)

      // Tidy source(s) and dest(s)
      const tidyChains = (chainIds) => {
        const newChains = []
        const allChains = []
        if (this.makerInfoList) {
          for (const makerInfo of this.makerInfoList) {
            if (allChains.indexOf(makerInfo.c1ID) == -1) {
              allChains.push(makerInfo.c1ID)
            }
            if (allChains.indexOf(makerInfo.c2ID) == -1) {
              allChains.push(makerInfo.c2ID)
            }
          }

          for (const item of chainIds) {
            if (allChains.indexOf(item) > -1 && newChains.indexOf(item) == -1) {
              newChains.push(item)
            }
          }
        }

        // If newChains empty, return allChains
        if (newChains.length == 0) {
          return allChains
        }

        return newChains
      }
      sources = tidyChains(sources)
      dests = tidyChains(dests)
      if (sources.length == 1 && dests.length == 1 && sources[0] == dests[0]) {
        // Example: sources=[1], dests=[1], invalid, reset them!
        sources = []
        dests = []
      }

      if (source > 0 && sources.length > 0 && sources.indexOf(source) == -1) {
        source = 0
      }
      if (dest > 0 && dests.length > 0 && dests.indexOf(dest) == -1) {
        dest = 0
      }
      if (source <= 0 && sources.length > 0) {
        source = sources[0]
      }
      if (dest <= 0 && dests.length > 0) {
        dest = dests[0]
      }
      if (dests.length == 1 && sources.length > 1) {
        // When dests only 1 item: A, remove sources A item
        const _index = sources.indexOf(dests[0])
        if (_index > -1) {
          sources.splice(_index, 1)

          // When source same as dests[0], set source=sources[0]
          if (source == dests[0]) {
            source = sources[0]
          }
        }
      }
      if (dests.length > 0 && dests[0] == source) {
        source = 0
      }
      if (source == dest) {
        dest = 0
      }

      // Tidy tokens
      const tidyTokens = []
      if (this.makerInfoList) {
        for (const _token of tokens) {
          if (
            this.makerInfoList.findIndex((makerInfo) =>
              util.equalsIgnoreCase(makerInfo.tName, _token)
            ) > -1
          ) {
            tidyTokens.push(_token)
          }
        }
      }

      // Tidy
      if (!token) {
        token = tokens?.[0] || ''
      }
      if (amount.comparedTo(0) == 1) {
        amount = amount.toFixed()
      } else {
        amount = ''
      }
      fixed = fixed == 1 // To boolean

      return {
        referer,
        source,
        dest,
        token,
        tokens: tidyTokens,
        amount,
        fixed,
        sources,
        dests,
      }
    },
    sendBtnInfo() {
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let avalibleDigit = orbiterCore.getDigitByPrecision(
        selectMakerInfo.precision
      )
      let opBalance = 10 ** -avalibleDigit
      let useBalanle = new BigNumber(this.fromBalance)
        .minus(new BigNumber(selectMakerInfo.tradingFee))
        .minus(new BigNumber(opBalance))
      let userMax =
        useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN) > 0
          ? useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
          : new BigNumber(0)
      let makerMax = new BigNumber(this.maxPrice)
      let makerMin = new BigNumber(this.userMinPrice)
      let transferValue = new BigNumber(this.transferValue)

      const info = {
        text: 'CONNECT A WALLET',
        disabled: null,
      }
      if (this.isLogin) {
        info.text = 'SEND'

        if (transferValue.comparedTo(0) < 0) {
          info.disabled = 'disabled'
        } else if (transferValue.comparedTo(this.userMaxPrice) > 0) {
          info.disabled = 'disabled'
        }
        if (transferValue.comparedTo(userMax) > 0) {
          info.text = 'INSUFFICIENT FUNDS'
        } else if (transferValue.comparedTo(makerMax) > 0) {
          info.text = 'INSUFFICIENT LIQUIDITY'
        } else if (transferValue.comparedTo(makerMin) < 0) {
          info.text = 'INSUFFICIENT FUNDS'
          info.disabled = 'disabled'
        } else if (transferValue.comparedTo(0) > 0 && this.toValue <= 0) {
          info.text = 'INSUFFICIENT FUNDS'
          info.disabled = 'disabled'
        }
      }

      return info
    },
    maxPrice() {
      return this.$store.getters.realSelectMakerInfo.maxPrice
    },
    isShowMax() {
      return new BigNumber(this.transferValue).comparedTo(
        new BigNumber(this.$store.getters.realSelectMakerInfo.maxPrice)
      ) > 0
        ? true
        : false
    },

    userMinPrice() {
      return this.$store.getters.realSelectMakerInfo.minPrice
    },
    realTransferValue() {
      return transferCalculate.realTransferOPID()
    },
    realPtext() {
      let ptextResult = orbiterCore.getPTextFromTAmount(
        this.transferData.fromChainID,
        this.realTransferValue
      )
      if (ptextResult.state) {
        return ptextResult.pText
      } else {
        return '0'
      }
    },
    toValueToolTip() {
      let value = this.$store.getters.realSelectMakerInfo?.gasFee || 0
      value = parseFloat((value / 10).toFixed(2))
      return `Sender will pay a ${value}% trading fee for each transfer.`
    },
    securityToolTip() {
      return `In Orbiter, each transaction will have a security code. The code is attached to the end of the transfer amount in the form of a four-digit number to specify the necessary information when you transfer. If a Maker is dishonest, the security code will become the necessary evidence for you to claim money from margin contracts.`
    },
    timeSpenToolTip() {
      return `It will take about ${
        this.originTimeSpent
          ? this.originTimeSpent.replace('~', '')
          : this.originTimeSpent
      } by traditional way, but only take about ${
        this.timeSpent ? this.timeSpent.replace('~', '') : this.timeSpent
      } with Orbiter.`
    },
    gasFeeToolTip() {
      const gasFee = `<b>The cost before using Orbiter</b><br />Gas Fee: $${this.originGasCost.toFixed(
        2
      )}<br />`
      const tradingFee = ` <br /><b>The cost after using Orbiter</b><br />Trading Fee: $${(
        this.orbiterTradingFee * this.exchangeToUsdPrice
      ).toFixed(2)}`
      const withholdingGasFee = `<br />Withholding Fee: $${
        this.$store.getters.realSelectMakerInfo
          ? (
              this.$store.getters.realSelectMakerInfo.tradingFee *
              this.exchangeToUsdPrice
            ).toFixed(2)
          : 0
      }`
      const total = `<br /><br /><b>Total: $${(
        this.gasTradingTotal * this.exchangeToUsdPrice
      ).toFixed(2)}</b>`

      return gasFee + tradingFee + withholdingGasFee + total
    },
    toValue() {
      if (
        this.transferValue === '' ||
        this.$store.getters.realSelectMakerInfo === ''
      ) {
        return '0'
      }
      return orbiterCore.getToAmountFromUserAmount(
        new BigNumber(this.transferValue).plus(
          new BigNumber(this.$store.getters.realSelectMakerInfo.tradingFee)
        ),
        this.$store.getters.realSelectMakerInfo,
        false
      )
    },
    fromBalanceLoading() {
      if (this.fromBalance === null) {
        return true
      }
      return false
    },
    toBalanceLoading() {
      if (this.toBalance === null) {
        return true
      }
      return false
    },
    fromBalance() {
      if (
        this.transferData.selectMakerInfo.c1ID === this.transferData.fromChainID
      ) {
        console.log('this.c1Balance: ', this.c1Balance)
        return this.c1Balance
      } else {
        console.log('this.c2Balance', this.c2Balance)
        return this.c2Balance
      }
    },
    toBalance() {
      if (
        this.transferData.selectMakerInfo.c1ID === this.transferData.fromChainID
      ) {
        return this.c2Balance
      } else {
        return this.c1Balance
      }
    },
    gasCost() {
      if (
        this.transferData.fromChainID === 3 ||
        this.transferData.fromChainID === 33
      ) {
        if (this.transferData.selectTokenInfo.token !== 'ETH') {
          return (
            Math.ceil(Number(this.transferData.gasFee * 10)) / 10
          ).toFixed(2)
        }
      }

      return (
        Math.ceil(this.transferData.gasFee * this.transferData.ethPrice * 10) /
        10
      ).toFixed(2)
    },
    timeSpent() {
      return transferCalculate.transferSpentTime(
        this.transferData.fromChainID,
        this.transferData.toChainID
      )
    },
    originTimeSpent() {
      return transferCalculate.transferOrginTime(
        this.transferData.fromChainID,
        this.transferData.toChainID
      )
    },
    orbiterTradingFee() {
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let tradingFee = new BigNumber(
        this.transferValue ? this.transferValue : 0
      )
        .multipliedBy(new BigNumber(selectMakerInfo.gasFee))
        .dividedBy(new BigNumber(1000))
      let digit = orbiterCore.getDigitByPrecision(selectMakerInfo.precision)
      let tradingFee_fix = tradingFee.decimalPlaces(digit, BigNumber.ROUND_UP)
      return tradingFee_fix
    },
    gasTradingTotal() {
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let gasFee = new BigNumber(selectMakerInfo.tradingFee)
      return gasFee.plus(this.orbiterTradingFee).toFixed(6)
    },
    gasSavingMax() {
      let savingValue =
        this.originGasCost - this.gasTradingTotal * this.exchangeToUsdPrice
      if (savingValue < 0) {
        savingValue = 0
      }
      let savingTokenName = '$'
      return savingTokenName + savingValue.toFixed(2).toString()
    },
    showSaveGas() {
      let savingValue =
        this.originGasCost - this.gasTradingTotal * this.exchangeToUsdPrice
      if (savingValue > 0) {
        return true
      }
      return false
    },
    gasSavingMin() {
      let savingValue =
        this.originGasCost -
        this.gasTradingTotal * this.exchangeToUsdPrice -
        this.gasCost.toString()
      if (savingValue < 0) {
        savingValue = 0
      }
      let savingTokenName = '$'
      return savingTokenName + savingValue.toFixed(2).toString()
    },
    saveGasLoading() {
      return this.originGasLoading
    },
    transferSavingTime() {
      return transferCalculate.transferSavingTime(
        this.transferData.fromChainID,
        this.transferData.toChainID
      )
    },
  },
  watch: {
    queryParams: function (nv) {
      // When transferValue is empty, set it = nv.amount
      if (this.transferValue <= 0) {
        this.transferValue = nv.amount
      }
      this.initChainArray()
    },
    makerInfoList: function (newValue, oldValue) {
      if (oldValue === '' && newValue !== '') {
        this.initChainArray()
      }
    },
    '$store.state.web3.coinbase': function (newValue, oldValue) {
      if (!newValue || newValue === '0x') {
        this.c1Balance = 0
        this.c2Balance = 0
      }
      if (oldValue !== newValue && newValue !== '0x') {
        this.c1Balance = null
        this.c2Balance = null
        let selectMakerInfo = this.transferData.selectMakerInfo
        transferCalculate
          .getTransferBalance(
            selectMakerInfo.c1ID,
            selectMakerInfo.t1Address,
            selectMakerInfo.tName,
            this.web3.coinbase
          )
          .then((response) => {
            this.c1Balance = (
              response /
              10 ** selectMakerInfo.precision
            ).toFixed(6)
          })
          .catch((error) => {
            console.log(error)
            return
          })
        transferCalculate
          .getTransferBalance(
            selectMakerInfo.c2ID,
            selectMakerInfo.t2Address,
            selectMakerInfo.tName,
            this.web3.coinbase
          )
          .then((response) => {
            this.c2Balance = (
              response /
              10 ** selectMakerInfo.precision
            ).toFixed(6)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        this.c1Balance = 0
        this.c2Balance = 0
      }
    },
    'transferData.selectMakerInfo': function (newValue, oldValue) {
      this.updateExchangeToUsdPrice()

      if (this.isLogin && oldValue !== newValue) {
        this.c1Balance = null
        this.c2Balance = null
        transferCalculate
          .getTransferBalance(
            newValue.c1ID,
            newValue.t1Address,
            newValue.tName,
            this.$store.state.web3.coinbase
          )
          .then((response) => {
            this.c1Balance = (response / 10 ** newValue.precision).toFixed(6)
          })
          .catch((error) => {
            console.log(error)
          })
        transferCalculate
          .getTransferBalance(
            newValue.c2ID,
            newValue.t2Address,
            newValue.tName,
            this.$store.state.web3.coinbase
          )
          .then((response) => {
            this.c2Balance = (response / 10 ** newValue.precision).toFixed(6)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    'transferData.fromChainID': function (newValue) {
      this.toChainArray = []
      this.makerInfoList.filter((makerInfo) => {
        if (
          makerInfo.c1ID === newValue &&
          this.toChainArray.indexOf(makerInfo.c2ID) === -1
        ) {
          // dests fiter
          if (
            this.queryParams.dests.length <= 0 ||
            this.queryParams.dests.indexOf(makerInfo.c2ID) > -1
          ) {
            this.toChainArray.push(makerInfo.c2ID)
          }
        }
        if (
          makerInfo.c2ID === newValue &&
          this.toChainArray.indexOf(makerInfo.c1ID) === -1
        ) {
          if (
            this.queryParams.dests.length <= 0 ||
            this.queryParams.dests.indexOf(makerInfo.c1ID) > -1
          ) {
            this.toChainArray.push(makerInfo.c1ID)
          }
        }
      })
      if (this.toChainArray.indexOf(this.transferData.toChainID) === -1) {
        let _toChainID = this.toChainArray[0]
        if (
          this.queryParams.dest > 0 &&
          this.toChainArray.indexOf(this.queryParams.dest) > -1
        ) {
          // When dest > 0 and query params dest at this.toChainArray
          _toChainID = this.queryParams.dest
        }
        this.$store.commit('updateTransferToChainID', _toChainID)
      } else {
        this.tokenInfoArray = []
        this.makerInfoList.filter((makerInfo) => {
          const { fromChainID, toChainID } = this.transferData
          const pushToken = (_fromChainID, _toChainID) => {
            if (_fromChainID !== fromChainID || _toChainID !== toChainID) {
              return
            }

            const { tokens } = this.queryParams
            if (
              tokens.length > 0 &&
              tokens.findIndex((_token) =>
                util.equalsIgnoreCase(_token, makerInfo.tName)
              ) == -1
            ) {
              return
            }

            if (
              this.tokenInfoArray.findIndex(
                (tokenInfo) => tokenInfo.token === makerInfo.tName
              ) == -1
            ) {
              this.tokenInfoArray.push({
                icon: config.getTokenIcon(makerInfo.tName),
                token: makerInfo.tName,
                amount: 0,
              })
            }
          }
          pushToken(makerInfo.c1ID, makerInfo.c2ID)
          pushToken(makerInfo.c2ID, makerInfo.c1ID)
        })

        // if can's find, use first; else find same name token's makerInfo
        if (
          this.tokenInfoArray.findIndex(
            (item) => item.token == this.transferData.selectTokenInfo.token
          ) === -1
        ) {
          let defaultIndex = this.tokenInfoArray.findIndex((item) =>
            util.equalsIgnoreCase(item.token, this.queryParams.token)
          )
          if (defaultIndex < 0) {
            defaultIndex = 0
          }

          this.$store.commit(
            'updateTransferTokenInfo',
            this.tokenInfoArray[defaultIndex]
          )
        } else {
          this.makerInfoList.filter((makerInfo) => {
            if (
              (makerInfo.c1ID === this.transferData.fromChainID &&
                makerInfo.c2ID === this.transferData.toChainID &&
                makerInfo.tName === this.transferData.selectTokenInfo.token) ||
              (makerInfo.c2ID === this.transferData.fromChainID &&
                makerInfo.c1ID === this.transferData.toChainID &&
                makerInfo.tName === this.transferData.selectTokenInfo.token)
            ) {
              this.$store.commit('updateTransferMakerInfo', makerInfo)
            }
          })
        }
        if (newValue) {
          this.updateOriginGasCost()
        }
      }
      if (newValue) {
        let that = this
        this.gasCostLoading = true
        transferCalculate
          .transferSpentGas(this.transferData.fromChainID)
          .then((response) => {
            this.$store.commit('updateTransferGasFee', response)
            that.gasCostLoading = false
          })
          .catch((error) => {
            that.gasCostLoading = false
            console.log('GetGasFeeError =', error)
          })
      }
    },
    'transferData.toChainID': function (newValue) {
      this.tokenInfoArray = []
      this.makerInfoList.filter((makerInfo) => {
        const { fromChainID, toChainID } = this.transferData
        const pushToken = (_fromChainID, _toChainID) => {
          if (_fromChainID !== fromChainID || _toChainID !== toChainID) {
            return
          }

          const { tokens } = this.queryParams
          if (
            tokens.length > 0 &&
            tokens.findIndex((_token) =>
              util.equalsIgnoreCase(_token, makerInfo.tName)
            ) == -1
          ) {
            return
          }

          if (
            this.tokenInfoArray.findIndex(
              (tokenInfo) => tokenInfo.token === makerInfo.tName
            ) == -1
          ) {
            this.tokenInfoArray.push({
              icon: config.getTokenIcon(makerInfo.tName),
              token: makerInfo.tName,
              amount: 0,
            })
          }
        }
        pushToken(makerInfo.c1ID, makerInfo.c2ID)
        pushToken(makerInfo.c2ID, makerInfo.c1ID)
      })

      if (
        this.tokenInfoArray.findIndex(
          (item) => item.token == this.transferData.selectTokenInfo.token
        ) === -1
      ) {
        let defaultIndex = this.tokenInfoArray.findIndex((item) =>
          util.equalsIgnoreCase(item.token, this.queryParams.token)
        )
        if (defaultIndex < 0) {
          defaultIndex = 0
        }

        this.$store.commit(
          'updateTransferTokenInfo',
          this.tokenInfoArray[defaultIndex]
        )
      } else {
        this.makerInfoList.filter((makerInfo) => {
          if (
            (makerInfo.c1ID === this.transferData.fromChainID &&
              makerInfo.c2ID === this.transferData.toChainID &&
              makerInfo.tName === this.transferData.selectTokenInfo.token) ||
            (makerInfo.c2ID === this.transferData.fromChainID &&
              makerInfo.c1ID === this.transferData.toChainID &&
              makerInfo.tName === this.transferData.selectTokenInfo.token)
          ) {
            this.$store.commit('updateTransferMakerInfo', makerInfo)
          }
        })
      }

      if (newValue) {
        this.updateOriginGasCost()
      }
    },
    'transferData.selectTokenInfo': function (newValue) {
      this.makerInfoList.filter((makerInfo) => {
        if (
          (makerInfo.c1ID === this.transferData.fromChainID &&
            makerInfo.c2ID === this.transferData.toChainID &&
            makerInfo.tName === newValue.token) ||
          (makerInfo.c2ID === this.transferData.fromChainID &&
            makerInfo.c1ID === this.transferData.toChainID &&
            makerInfo.tName === newValue.token)
        ) {
          this.$store.commit('updateTransferMakerInfo', makerInfo)
        }
      })

      this.updateOriginGasCost()
    },
    transferValue: function (newValue) {
      if (this.transferData.transferValue !== newValue) {
        this.$store.commit('updateTransferValue', newValue)
      }
    },
  },
  mounted() {
    const updateETHPrice = async () => {
      transferCalculate
        .getTokenConvertUsd('ETH')
        .then((response) => {
          this.$store.commit('updateETHPrice', response)
        })
        .catch((error) => {
          console.log('GetETHPriceError =', error)
        })
    }
    updateETHPrice()

    setInterval(() => {
      let selectMakerInfo = this.transferData.selectMakerInfo
      if (selectMakerInfo && this.isLogin) {
        this.getBalance(
          this.$store.state.web3.coinbase,
          selectMakerInfo.c1ID,
          selectMakerInfo.t1Address,
          selectMakerInfo.tName,
          selectMakerInfo.precision
        ).then((v) => {
          if (v) {
            this.c1Balance = v
          }
        })

        this.getBalance(
          this.$store.state.web3.coinbase,
          selectMakerInfo.c2ID,
          selectMakerInfo.t2Address,
          selectMakerInfo.tName,
          selectMakerInfo.precision
        ).then((v) => {
          if (v) {
            this.c2Balance = v
          }
        })
      }

      updateETHPrice()

      this.updateExchangeToUsdPrice()
    }, 10 * 1000)

    this.transferValue = this.queryParams.amount

    const getMakerInfoFromGraphReq = {
      maker: '0',
    }
    makerInfo
      .getMakerInfoFromGraph(getMakerInfoFromGraphReq, true)
      .then((response) => {
        if (response.code === 0) {
          this.makerInfoList = response.data
        }
      })
      .catch((error) => {
        console.log('error =', error)
      })
  },
  methods: {
    ...mapMutations(['updateTransferTokenInfo']),
    initChainArray() {
      this.fromChainArray = []
      this.makerInfoList.filter((makerInfo) => {
        if (this.fromChainArray.indexOf(makerInfo.c1ID) === -1) {
          // sources fiter
          if (
            this.queryParams.sources.length <= 0 ||
            this.queryParams.sources.indexOf(makerInfo.c1ID) > -1
          ) {
            this.fromChainArray.push(makerInfo.c1ID)
          }
        }
        if (this.fromChainArray.indexOf(makerInfo.c2ID) === -1) {
          if (
            this.queryParams.sources.length <= 0 ||
            this.queryParams.sources.indexOf(makerInfo.c2ID) > -1
          ) {
            this.fromChainArray.push(makerInfo.c2ID)
          }
        }
      })

      // default from chain id
      let fromChainID = this.fromChainArray[0]
      if (this.queryParams.source) {
        for (const item of this.fromChainArray) {
          if (item == this.queryParams.source) {
            fromChainID = item
            break
          }
        }
      }

      this.$store.commit('updateTransferFromChainID', fromChainID)
    },
    tokens() {
      return this.tokenInfoArray.map((v) => {
        return {
          ...v,
          icon: v.icon || 'tokenLogo',
          label: v.token,
          value: v.token,
          iconType: 'img',
        }
      })
    },
    fromMax() {
      if (!this.isLogin) {
        this.transferValue = '0'
        return
      }
      let selectMakerInfo = this.$store.getters.realSelectMakerInfo
      let avalibleDigit = orbiterCore.getDigitByPrecision(
        selectMakerInfo.precision
      )
      let opBalance = 10 ** -avalibleDigit
      let useBalanle = new BigNumber(this.fromBalance)
        .minus(new BigNumber(selectMakerInfo.tradingFee))
        .minus(new BigNumber(opBalance))
      let userMax =
        useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN) > 0
          ? useBalanle.decimalPlaces(avalibleDigit, BigNumber.ROUND_DOWN)
          : new BigNumber(0)
      let max =
        userMax.comparedTo(new BigNumber(this.userMaxPrice)) > 0
          ? new BigNumber(this.userMaxPrice)
          : userMax
      this.transferValue = max.toString()
    },
    showChainName(localChainID, netChainID) {
      return util.chainName(localChainID, netChainID)
    },
    showChainIcon(localChainID) {
      return util.chainIcon(localChainID)
    },
    transfer_mid() {
      const { fromChainID, toChainID, selectTokenInfo } = this.transferData
      this.$store.commit('updateTransferFromChainID', toChainID)
      this.$store.commit('updateTransferTokenInfo', selectTokenInfo)

      // Wait toChainArray updated
      this.$nextTick(() => {
        let _toChainID = fromChainID
        if (this.toChainArray.indexOf(_toChainID) == -1) {
          _toChainID = this.toChainArray[0]
        }
        this.$store.commit('updateTransferToChainID', _toChainID)
      })

      // Transfer query params
      const { path, query } = this.$route
      let { source, dest, sources, dests } = query
      if (source || dest || sources || dests) {
        // When only one is noempty, do it
        //  - Change query params, will trigger queryParams computed
        //  - If query no change, don't replace
        const newQuery = {
          ...query,
          source: dest || '',
          dest: source || '',
          sources: dests || '',
          dests: sources || '',
        }
        const isSame = (v1, v2) => {
          if ((v1 == '' || v1 == undefined) && (v2 == '' || v2 == undefined)) {
            return true
          }
          return v1 == v2
        }
        if (
          !isSame(newQuery.source, query.source) ||
          !isSame(newQuery.dest, query.dest) ||
          !isSame(newQuery.sources, query.sources) ||
          !isSame(newQuery.dests, query.dests)
        ) {
          this.$router.replace({ path, query: newQuery })
        }
      }
    },
    selectToken() {
      if (this.tokenInfoArray.length <= 1) {
        return
      }

      this.showCustomPopupClick()
    },
    getTokenInfo(e) {
      let newTokenInfo = this.tokenInfoArray.find((item) => item.token === e)
      this.updateTransferTokenInfo(newTokenInfo)
    },
    // open pop
    showCustomPopupClick() {
      this.$refs.SelectTokenPopupRef.showCustom()
    },
    // close pop
    closeSelectPopupClick() {
      this.$refs.SelectTokenPopupRef.maskClick()
    },
    changeFromChain() {
      if (this.queryParams.sources.length <= 1) {
        return
      }

      this.showFromChainPopupClick()
    },
    getFromChainInfo(e) {
      this.$store.commit('updateTransferFromChainID', e.localID)

      // Change query params's source
      const { path, query } = this.$route
      for (const key in this.$env.localChainMap) {
        if (this.$env.localChainMap[key] == e.localID) {
          if (!util.equalsIgnoreCase(query.source, key)) {
            this.$router.replace({ path, query: { ...query, source: key } })
            break
          }
        }
      }
    },
    // open selectChain
    showFromChainPopupClick() {
      this.$refs.SelectFromChainPopupRef.showCustom()
    },
    // close selectChain
    closeFromChainPopupClick() {
      this.$refs.SelectFromChainPopupRef.maskClick()
    },
    changeToChain() {
      if (this.queryParams.dests.length <= 1) {
        return
      }

      this.showToChainPopupClick()
    },
    getToChainInfo(e) {
      this.$store.commit('updateTransferToChainID', e.localID)

      // Change query params's source
      const { path, query } = this.$route
      for (const key in this.$env.localChainMap) {
        if (this.$env.localChainMap[key] == e.localID) {
          if (!util.equalsIgnoreCase(query.dest, key)) {
            this.$router.replace({ path, query: { ...query, dest: key } })
            break
          }
        }
      }
    },
    // open selectChain
    showToChainPopupClick() {
      this.$refs.SelectToChainPopupRef.showCustom()
    },
    // close selectChain
    closeToChainPopupClick() {
      this.$refs.SelectToChainPopupRef.maskClick()
    },
    checkTransferValue() {
      this.transferValue =
        this.$store.getters.realSelectMakerInfo.precision === 18
          ? this.transferValue.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g, '$1')
          : this.transferValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
    },
    checkDestination() {
      console.log('this.destination =', this.destination)
    },
    async sendTransfer() {
      // if unlogin  login first
      if (!this.isLogin) {
        Middle.$emit('connectWallet', true)
      } else {
        if (!check.checkPrice(this.transferValue)) {
          this.$notify.error({
            title: `The format of input amount is incorrect`,
            duration: 3000,
          })
          return
        }
        if (this.fromBalance === null) {
          this.$notify.error({
            title: `Waiting for account balance to be obtained`,
            duration: 3000,
          })
          return
        }
        // let selectMakerInfo = this.$store.getters.realSelectMakerInfo
        if (
          !this.transferValue ||
          new BigNumber(this.transferValue).comparedTo(
            new BigNumber(this.userMaxPrice)
          ) > 0 ||
          new BigNumber(this.transferValue).comparedTo(
            new BigNumber(this.userMinPrice)
          ) < 0
        ) {
          this.$notify.error({
            title: `As an alpha release, Orbiter can only support ${this.userMinPrice} ~ ${this.maxPrice} ${this.transferData.selectTokenInfo.token} for each transfer.`,
            duration: 3000,
          })
          return
        }
        let destination = this.destination
        console.log('destination =', destination)
        console.log('value2 =', util.isETHAddress(destination))
        if (destination === '') {
          //do nothing
        } else if (!util.isETHAddress(destination)) {
          util.showMessage('invaild address', 'error')
          return
        }
        if (
          this.$store.state.web3.networkId.toString() !==
          this.$env.localChainID_netChainID[this.transferData.fromChainID]
        ) {
          this.addChainNetWork()
        } else {
          const selectMakerInfo = this.$store.getters.realSelectMakerInfo
          const amount = String(
            new BigNumber(this.transferValue * 10 ** selectMakerInfo.precision)
          )
          this.$store.commit('updateTransferDestAddress', this.destination)
          this.$store.commit('updateTransferAmount', amount)

          // sendTransfer
          this.$store.commit('updateConfirmRouteDescInfo', [
            {
              no: 1,
              amount: new BigNumber(this.transferData.transferValue).plus(
                new BigNumber(
                  this.$store.getters.realSelectMakerInfo.tradingFee
                )
              ),
              coin: this.transferData.selectTokenInfo.token,
              toAddress: util.shortAddress(selectMakerInfo.makerAddress),
            },
          ])
          this.$emit('stateChanged', '2')
        }
      }
    },
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
        .then(() => {})
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

    async updateOriginGasCost() {
      this.originGasLoading = true
      const { fromChainID, toChainID } = this.transferData

      if (!fromChainID || !toChainID) {
        return
      }

      try {
        const response = await transferCalculate.transferOrginGasUsd(
          this.transferData.fromChainID,
          this.transferData.toChainID,
          this.transferData.selectTokenInfo.token !== 'ETH'
        )

        this.originGasCost = response
      } catch (error) {
        this.$notify.error({
          title: `GetOrginGasFeeError`,
          desc: error,
          duration: 3000,
        })
      }
      this.originGasLoading = false
    },

    async updateExchangeToUsdPrice() {
      const selectMakerInfo = this.$store.getters.realSelectMakerInfo

      const price = (await exchangeToUsd(1, selectMakerInfo.tName)).toNumber()

      if (price > 0) {
        this.exchangeToUsdPrice = price
      }
    },

    async getBalance(
      makerAddress,
      chainId,
      tokenAddress,
      tokenName,
      precision
    ) {
      try {
        if (!makerAddress) {
          return ''
        }
        const response = await transferCalculate.getTransferBalance(
          chainId,
          tokenAddress,
          tokenName,
          makerAddress
        )
        return (response / 10 ** precision).toFixed(6)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.transfer-box {
  .top-area {
    display: flex;
    align-items: center;
    margin-left: 2rem;
    .left {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-size: 2rem;
      line-height: 2rem;
      color: #333333;
      letter-spacing: -0.01em;
    }
    .left-value {
      margin-left: 1rem;
      width: 12rem;
      .select {
        padding: 1rem;
      }
    }
  }
  .from-area,
  .to-area {
    margin-top: 2rem;
    height: 9.6rem;
    border-radius: 2rem;
    position: relative;
    padding: 2rem;
    font-weight: 400;
    font-size: 1.2rem;
    line-height: 2rem;

    .topItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Inter Regular';
      .right {
        display: flex;
      }
    }

    .bottomItem {
      display: flex;
      justify-content: space-between;
      margin-top: 0.8rem;
      align-items: center;

      .selectChain {
        display: flex;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 1.6rem;
        line-height: 2.4rem;
        color: #333333;
        align-items: center;
        width: 35%;
        justify-content: space-between;
        border-radius: 1.2rem;
        height: 4rem;
      }

      .right {
        text-align: right;
        border: 0;
        outline: 0rem;
        appearance: none;
        background-color: transparent;
        transition: all 0.2s ease 0s;
        flex-direction: row-reverse;
        .to-value {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 700;
          font-size: 16px;
          line-height: 24px;
          color: #df2e2d;
        }
      }
      .right-value {
        font-weight: 700;
        font-size: 1.6rem;
        line-height: 2.4rem;
      }

      input {
        font-weight: 700;
        font-size: 1.6rem;
        line-height: 2.4rem;
      }

      input::placeholder {
        color: rgba(51, 51, 51, 0.2);
        font-weight: 700;
        font-size: 1.6rem;
      }

      .maxBtn {
        font-weight: 400;
        font-size: 1.4rem;
        line-height: 2rem;
        cursor: pointer;
        border: none;
        background: transparent;
        text-align: right;
        padding: 0;
        margin-left: 0.8rem;
        font-family: 'Inter Regular';
      }
    }
  }
  .from-area {
    margin-bottom: 0.8rem;
  }
  .to-area {
    margin-top: 0rem;
  }
  .exchange-icon {
    width: 2.8rem;
    height: 2.8rem;
    cursor: pointer;
  }
  .btn {
    margin-top: 3.2rem;
    height: 5rem;
    display: inline-block;
    line-height: 3.4rem;
    margin-bottom: 2rem;
    background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
  }
  .info-box {
    font-family: 'Inter Regular';
    margin-left: 2rem;
    .info-item {
      font-weight: 400;
      font-size: 1.2rem;
      line-height: 2rem;
      display: flex;
      align-items: center;
      margin-bottom: 1.2rem;
      .border {
        margin-right: 0.8rem;
        padding-right: 0.8rem;
      }
    }
    .info-icon {
      width: 1.6rem;
      height: 1.6rem;
      margin-right: 0.6rem;
    }
  }
  .red {
    color: #df2e2d;
  }
  .destContent {
    margin-top: 2rem;
    position: relative;
    height: 4rem;
    border-radius: 4rem;
    text-align: left;
    font-weight: 400;
    background: #f5f5f5;
    font-size: 1.2rem;
    .right {
      width: 100%;
      height: 100%;
      color: var(--primary-color);
      text-align: center;
      border: 0;
      outline: 0rem;
      appearance: none;
      background-color: transparent;
      transition: all 0.2s ease 0s;
      flex-direction: row-reverse;
    }
    input {
      font-weight: 600;
    }
    input::placeholder {
      color: #adadb0;
      font-size: 1.4rem;
      font-weight: 400;
    }
  }
  .send-foot-btn {
    height: 5rem;
    box-shadow: inset 0rem -0.8rem 0rem rgba(0, 0, 0, 0.16);
    border-radius: 3rem;
    font-weight: 700;
    font-size: 2rem;
    line-height: 2rem;
    color: #fff;
    margin-top: 1rem;
    text-align: center;
    line-height: 5rem;
    font-family: 'Inter Bold';
    background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
    box-shadow: inset 0rem -0.8rem 0rem rgba(0, 0, 0, 0.16);
    border-radius: 4rem;
    &:hover {
      background: #ca2221;
    }
    &:active {
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
      box-shadow: inset 0rem -0.8rem 0rem rgba(0, 0, 0, 0.16);
    }
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  .notice {
    margin: 2.2rem 4.2rem;
    .item {
      margin-top: 0.8rem;
      display: flex;
      .left {
        display: flex;
        .Icon {
          width: 2rem;
          height: 2rem;
        }
        .Text {
          margin: 0 0.8rem 0 0.6rem;
          padding-right: 0.8rem;
          font-family: 'Inter';
          font-style: normal;
          font-weight: 400;
          font-size: 1.2rem;
          line-height: 2rem;
          border-right: 0.1rem solid #ccc;
          &.showMax {
            border-right: none;
          }
        }
        &.showMax {
          color: red;
        }
      }
      .right {
        align-items: center;
        display: flex;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 1.2rem;
        line-height: 2rem;
        color: #df2e2d;
        .Text {
          margin-left: 0.8rem;
        }
      }
    }
  }
}
</style>
