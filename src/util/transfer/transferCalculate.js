import axios from 'axios'
import BigNumber from 'bignumber.js'
import * as zksync from 'zksync'
import env from '../../../env'
import thirdapi from '../../core/actions/thirdapi'
import orbiterCore from '../../orbiterCore'
import { store } from '../../store'
import { exchangeToUsd } from '../coinbase'
import { getLocalCoinContract } from '../constants/contract/getContract'
import { localWeb3 } from '../constants/contract/localWeb3'
import { getContractFactory, predeploys } from '@eth-optimism/contracts'
import { ethers } from 'ethers'

import util from '../util'

// zk deposit
const ZK_ERC20_DEPOSIT_APPROVEL_ONL1 = 45135
const ZK_ERC20_DEPOSIT_DEPOSIT_ONL1 = 103937
const ZK_ETH_DEPOSIT_DEPOSIT_ONL1 = 62599

// ar deposit
const AR_ERC20_DEPOSIT_DEPOSIT_ONL1 = 218291
const AR_ETH_DEPOSIT_DEPOSIT_ONL1 = 92000

// ar withdraw
const AR_ERC20_WITHDRAW_ONAR = 801420
const AR_ERC20_WITHDRAW_ONL1 = 234552
const AR_ETH_WITHDRAW_ONAR = 666721
const AR_ETH_WITHDRAW_ONL1 = 161063

// polygon deposit
const PG_ERC20_DEPOSIT_DEPOSIT_ONL1 = 77257

// polygon withdraw
const PG_ERC20_WITHDRAW_ONPG = 32000
const PG_ERC20_WITHDRAW_ONL1 = 480000

//optimistic deposit
const OP_ETH_DEPOSIT_DEPOSIT_ONL1 = 151000

// optimistic withdraw
const OP_ETH_WITHDRAW_ONOP_L2 = 137000
const OP_ETH_WITHDRAW_ONL1 = 820000

const LocalNetWorks = env.supportLocalNetWorksIDs
export default {
  async getTransferGasLimit(fromChainID, makerAddress, fromTokenAddress) {
    if (fromChainID === 3 || fromChainID === 33) {
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet'
      )
      let selectMakerInfo = store.getters.realSelectMakerInfo
      if (!makerAddress) {
        return null
      }
      let zkTokenList =
        fromChainID === 3
          ? store.state.zktokenList.mainnet
          : store.state.zktokenList.rinkeby
      let tokenAddress =
        fromChainID === selectMakerInfo.c1ID
          ? selectMakerInfo.t1Address
          : selectMakerInfo.t2Address
      var tokenList = zkTokenList.filter(
        (item) => item.address === tokenAddress
      )
      let resultToken = tokenList.length > 0 ? tokenList[0] : null
      if (!resultToken) {
        return null
      }
      const fee = await syncHttpProvider.getTransactionFee(
        'Transfer',
        makerAddress,
        resultToken.id
      )
      let totalFee = fee.totalFee

      // When account's nonce is zero(0), add ChangePubKey fee
      try {
        const addressState = await syncHttpProvider.getState(
          store.state.web3.coinbase
        )
        if (!addressState.committed || addressState.committed?.nonce == 0) {
          const changePubKeyFee = await syncHttpProvider.getTransactionFee(
            { ChangePubKey: { onchainPubkeyAuth: false } },
            store.state.web3.coinbase,
            resultToken.id
          )
          totalFee = totalFee.add(changePubKeyFee.totalFee)
        }
      } catch (err) {
        console.error('Get ChangePubKey fee failed: ', err.message)
      }

      return totalFee / 10 ** resultToken.decimals
    } else if (util.isEthTokenAddress(fromTokenAddress)) {
      const web3 = localWeb3(fromChainID)
      if (web3) {
        const estimateGas = await web3.eth.estimateGas({
          from: store.state.web3.coinbase,
          to: makerAddress,
        })
        const gasPrice = await web3.eth.getGasPrice()
        return new BigNumber(estimateGas)
          .multipliedBy(gasPrice)
          .dividedBy(10 ** 18)
          .toNumber()
      }
    }
    return 0
  },

  async transferSpentGas(fromChainID) {
    const GasPriceMap = {
      1: 100,
      2: 1.9,
      3: 100,
      4: 1,
      5: 1,
      6: 60,
      7: 0.001,
      22: 0.02,
      33: 100,
      66: 60,
      77: 0.001,
    }
    const GasLimitMap = {
      1: 35000,
      2: 810000,
      3: 100,
      4: 35000,
      5: 35000,
      6: 1500,
      7: 21000,
      22: 810000,
      33: 100,
      66: 1500,
      77: 21000,
    }
    const GasTokenMap = {
      1: 'ETH',
      2: 'AETH',
      3: 'ETH',
      4: 'ETH',
      5: 'ETH',
      6: 'MATIC',
      7: 'ETH',
      22: 'AETH',
      33: 'ETH',
      66: 'MATIC',
      77: 'ETH',
    }
    if (fromChainID === 3 || fromChainID === 33) {
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet'
      )
      let selectMakerInfo = store.getters.realSelectMakerInfo
      let transferAddress = selectMakerInfo.makerAddress
        ? selectMakerInfo.makerAddress
        : null
      if (!transferAddress) {
        return null
      }
      let zkTokenList =
        fromChainID === 3
          ? store.state.zktokenList.mainnet
          : store.state.zktokenList.rinkeby
      let tokenAddress =
        fromChainID === selectMakerInfo.c1ID
          ? selectMakerInfo.t1Address
          : selectMakerInfo.t2Address
      var tokenList = zkTokenList.filter(
        (item) => item.address === tokenAddress
      )
      let resultToken = tokenList.length > 0 ? tokenList[0] : null
      if (!resultToken) {
        return null
      }
      const fee = await syncHttpProvider.getTransactionFee(
        'Transfer',
        transferAddress,
        resultToken.id
      )
      return (fee.totalFee / 10 ** resultToken.decimals).toFixed(6)
    }
    if (
      GasPriceMap[fromChainID.toString()] &&
      GasLimitMap[fromChainID.toString()] &&
      GasTokenMap[fromChainID.toString()]
    ) {
      let gasPrice = await this.getGasPrice(fromChainID.toString())
      if (!gasPrice) {
        let gas =
          (GasPriceMap[fromChainID.toString()] *
            GasLimitMap[fromChainID.toString()]) /
          10 ** 9
        return gas.toFixed(6).toString()
      } else {
        let gas = gasPrice * GasLimitMap[fromChainID.toString()]
        if (fromChainID === 7 || fromChainID === 77) {
          let l1GasFee = await this.getOPFee(fromChainID)
          gas += l1GasFee
        }
        gas = gas / 10 ** 18
        return gas.toFixed(6).toString()
      }
    } else {
      return null
    }
  },
  transferSpentTime(fromChainID, toChainID) {
    let timeSpent = 0
    if (fromChainID === 1 || fromChainID === 4 || fromChainID === 5) {
      timeSpent = 30
    }
    if (fromChainID === 2 || fromChainID === 22) {
      timeSpent = 15
    }
    if (fromChainID === 3 || fromChainID === 33) {
      timeSpent = 5
    }
    if (fromChainID === 6 || fromChainID === 66) {
      timeSpent = 15
    }
    if (fromChainID === 7 || fromChainID === 77) {
      timeSpent = 15
    }
    if (toChainID === 1 || toChainID === 4 || toChainID === 5) {
      timeSpent += 30
    }
    if (toChainID === 2 || toChainID === 22) {
      timeSpent += 15
    }
    if (toChainID === 3 || toChainID === 33) {
      timeSpent += 5
    }
    if (toChainID === 6 || toChainID === 66) {
      timeSpent += 15
    }
    if (toChainID === 7 || toChainID === 77) {
      timeSpent += 15
    }
    let timeSpentStr = timeSpent + 's'
    return timeSpentStr
  },
  transferOrginTime(fromChainID, toChainID) {
    if (fromChainID === 2 || fromChainID === 22) {
      return '~7 days'
    }
    if (fromChainID === 3 || fromChainID === 33) {
      return '~4 hours'
    }
    // https://docs.polygon.technology/docs/develop/ethereum-polygon/getting-started/
    if (fromChainID === 6 || fromChainID === 66) {
      return '~3 hours'
    }
    if (fromChainID === 7 || fromChainID === 77) {
      return '~7 days'
    }
    if (fromChainID === 1 || fromChainID === 4 || fromChainID === 5) {
      if (toChainID === 2 || toChainID === 22) {
        //  eth ->  ar
        return '~10min'
      }
      if (toChainID === 3 || toChainID === 33) {
        // eth -> zk
        return '~10min'
      }
      if (toChainID === 6 || toChainID === 66) {
        // eth -> polygon
        return '~5min'
      }
      if (toChainID === 7 || toChainID === 77) {
        // eth -> optimistic
        return '~5min'
      }
    }
  },
  transferSavingTime(fromChainID, toChainID) {
    if (fromChainID === 2 || fromChainID === 22) {
      return ' 7 days'
    }
    if (fromChainID === 3 || fromChainID === 33) {
      return ' 4 hours'
    }
    if (fromChainID === 6 || fromChainID === 66) {
      return ' 3 hours'
    }
    if (fromChainID === 7 || fromChainID === 77) {
      return ' 7 days'
    }
    if (fromChainID === 1 || fromChainID === 4 || fromChainID === 5) {
      if (toChainID === 2 || toChainID === 22) {
        //  eth ->  ar
        return ' 9.25min'
      }
      if (toChainID === 3 || toChainID === 33) {
        // eth -> zk
        return ' 9.5min'
      }
      if (toChainID === 6 || toChainID === 66) {
        // eth -> polygon
        return ' 4.25min'
      }
      if (toChainID === 7 || toChainID === 77) {
        // eth -> optimistic
        return ' 9.25min'
      }
    }
  },
  /**
   * @deprecated Move to transferOrginGasUsd
   */
  async transferOrginGas(fromChainID, toChainID, isErc20 = true) {
    let resultGas = 0
    let selectMakerInfo = store.getters.realSelectMakerInfo
    if (fromChainID === 2 || fromChainID === 22) {
      // Ar get
      let fromGasPrice = await this.getGasPrice(fromChainID)
      // AR WithDraw
      let ARWithDrawARGas =
        fromGasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONAR : AR_ETH_WITHDRAW_ONAR)

      let L1ChainID = fromChainID === 2 ? 1 : 5
      let L1GasPrice = await this.getGasPrice(L1ChainID)
      let ARWithDrawL1Gas =
        L1GasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONL1 : AR_ETH_WITHDRAW_ONL1)
      resultGas = ARWithDrawARGas + ARWithDrawL1Gas
    }
    if (fromChainID === 3 || fromChainID === 33) {
      // zk withdraw
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet'
      )
      let transferAddress = selectMakerInfo.makerAddress
        ? selectMakerInfo.makerAddress
        : null
      if (transferAddress) {
        const zkWithDrawFee = await syncHttpProvider.getTransactionFee(
          'Withdraw',
          transferAddress,
          0
        )
        resultGas += Number(zkWithDrawFee.totalFee)
      }
    }
    if (toChainID === 2 || toChainID === 22) {
      // Ar deposit
      let toGasPrice = await this.getGasPrice(toChainID === 2 ? 1 : 5)
      let arDepositGas =
        toGasPrice *
        (isErc20 ? AR_ERC20_DEPOSIT_DEPOSIT_ONL1 : AR_ETH_DEPOSIT_DEPOSIT_ONL1)
      resultGas += arDepositGas
    }
    if (toChainID === 3 || toChainID === 33) {
      // zk deposit
      let toGasPrice = await this.getGasPrice(toChainID === 3 ? 1 : 5)
      let zkDepositGas =
        toGasPrice *
        (isErc20
          ? ZK_ERC20_DEPOSIT_APPROVEL_ONL1 + ZK_ERC20_DEPOSIT_DEPOSIT_ONL1
          : ZK_ETH_DEPOSIT_DEPOSIT_ONL1)
      resultGas += zkDepositGas
    }
    return resultGas / 10 ** 18
  },

  async transferOrginGasUsd(fromChainID, toChainID, isErc20 = true) {
    let ethGas = 0
    let maticGas = 0

    const selectMakerInfo = store.getters.realSelectMakerInfo

    // withdraw
    if (fromChainID === 2 || fromChainID === 22) {
      // Ar get
      let fromGasPrice = await this.getGasPrice(fromChainID)
      // AR WithDraw
      let ARWithDrawARGas =
        fromGasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONAR : AR_ETH_WITHDRAW_ONAR)

      let L1ChainID = fromChainID === 2 ? 1 : 5
      let L1GasPrice = await this.getGasPrice(L1ChainID)
      let ARWithDrawL1Gas =
        L1GasPrice * (isErc20 ? AR_ERC20_WITHDRAW_ONL1 : AR_ETH_WITHDRAW_ONL1)
      ethGas = ARWithDrawARGas + ARWithDrawL1Gas
    }
    if (fromChainID === 3 || fromChainID === 33) {
      // zk withdraw
      const syncHttpProvider = await zksync.getDefaultProvider(
        fromChainID === 33 ? 'rinkeby' : 'mainnet'
      )
      let transferAddress = selectMakerInfo.makerAddress
        ? selectMakerInfo.makerAddress
        : null
      if (transferAddress) {
        const zkWithDrawFee = await syncHttpProvider.getTransactionFee(
          'Withdraw',
          transferAddress,
          0
        )
        ethGas += Number(zkWithDrawFee.totalFee)
      }
    }
    if (fromChainID === 6 || fromChainID === 66) {
      const fromGasPrice = await this.getGasPrice(fromChainID)

      // Polygon WithDraw
      const PGWithDrawARGas = fromGasPrice * PG_ERC20_WITHDRAW_ONPG
      maticGas += PGWithDrawARGas

      const L1ChainID = fromChainID === 6 ? 1 : 5
      const L1GasPrice = await this.getGasPrice(L1ChainID)
      const PGWithDrawL1Gas = L1GasPrice * PG_ERC20_WITHDRAW_ONL1
      ethGas += PGWithDrawL1Gas
    }
    if (fromChainID === 7 || fromChainID === 77) {
      // OP get
      let fromGasPrice = await this.getGasPrice(fromChainID)
      // op WithDraw
      let OPWithDrawOPGas = fromGasPrice * OP_ETH_WITHDRAW_ONOP_L2

      let L1ChainID = fromChainID === 7 ? 1 : 5

      let L1GasPrice = await this.getGasPrice(L1ChainID)

      let OPWithDrawL1Gas = L1GasPrice * OP_ETH_WITHDRAW_ONL1

      let OPWithDrawOP_L1 = await this.getOPFee(fromChainID)

      ethGas = OPWithDrawOPGas + OPWithDrawL1Gas + Number(OPWithDrawOP_L1)

      //  let gas = gasPrice * GasLimitMap[fromChainID.toString()]
      //  if (fromChainID === 7 || fromChainID === 77) {
      //    let l1GasFee = await this.getOPFee(fromChainID)
      //    gas += l1GasFee
      //  }
      //  gas = gas / 10 ** 18
      //  return gas.toFixed(6).toString()
    }
    // deposit
    if (toChainID === 2 || toChainID === 22) {
      // Ar deposit
      const toGasPrice = await this.getGasPrice(toChainID === 2 ? 1 : 5)
      const arDepositGas =
        toGasPrice *
        (isErc20 ? AR_ERC20_DEPOSIT_DEPOSIT_ONL1 : AR_ETH_DEPOSIT_DEPOSIT_ONL1)
      ethGas += arDepositGas
    }
    if (toChainID === 3 || toChainID === 33) {
      // zk deposit
      const toGasPrice = await this.getGasPrice(toChainID === 3 ? 1 : 5)
      const zkDepositGas =
        toGasPrice *
        (isErc20
          ? ZK_ERC20_DEPOSIT_APPROVEL_ONL1 + ZK_ERC20_DEPOSIT_DEPOSIT_ONL1
          : ZK_ETH_DEPOSIT_DEPOSIT_ONL1)
      ethGas += zkDepositGas
    }
    if (toChainID === 6 || toChainID === 66) {
      // Polygon deposit
      const toGasPrice = await this.getGasPrice(toChainID === 6 ? 1 : 5)
      const pgDepositGas = toGasPrice * PG_ERC20_DEPOSIT_DEPOSIT_ONL1
      ethGas += pgDepositGas
    }
    if (toChainID === 7 || toChainID === 77) {
      // op deposit
      let toGasPrice = await this.getGasPrice(toChainID === 7 ? 1 : 5)
      let opDepositGas = toGasPrice * OP_ETH_DEPOSIT_DEPOSIT_ONL1
      ethGas += opDepositGas
    }

    let usd = new BigNumber(0)
    if (ethGas > 0) {
      usd = usd.plus(
        await exchangeToUsd(new BigNumber(ethGas).dividedBy(10 ** 18))
      )
    }
    if (maticGas > 0) {
      usd = usd.plus(
        await exchangeToUsd(
          new BigNumber(maticGas).dividedBy(10 ** 18),
          'MATIC'
        )
      )
    }

    return usd.toNumber()
  },

  async getTransferBalance(localChainID, tokenAddress, tokenName, userAddress) {
    if (localChainID === 3 || localChainID === 33) {
      var req = {
        account: userAddress,
        localChainID: localChainID,
        stateType: 'committed',
      }
      try {
        let balanceInfo = await thirdapi.getZKBalance(req)
        if (
          !balanceInfo ||
          !balanceInfo.result ||
          !balanceInfo.result.balances
        ) {
          return 0
        }
        const balances = balanceInfo.result.balances
        return balances[tokenName] ? balances[tokenName] : 0
      } catch (error) {
        console.log('error =', error)
        throw 'getZKBalanceError'
      }
    } else {
      let balance = 0

      if (util.isEthTokenAddress(tokenAddress)) {
        // When is ETH
        const web3 = localWeb3(localChainID)
        balance = Number(await web3.eth.getBalance(userAddress)) || 0
      } else {
        // When is ERC20
        var tokenContract = getLocalCoinContract(localChainID, tokenAddress, 0)
        if (!tokenContract) {
          throw 'getBalance_tokenContractError'
        }

        balance = await tokenContract.methods.balanceOf(userAddress).call()
      }

      return balance
    }
  },

  async getGasPrice(fromChainID) {
    if (fromChainID === 33 || fromChainID === 3) {
      return null
    }
    if (LocalNetWorks.indexOf(fromChainID.toString()) > -1) {
      const providerKey = env.localProvider[fromChainID]
      let response = await axios.post(process.env[providerKey], {
        jsonrpc: '2.0',
        method: 'eth_gasPrice',
        params: [],
        id: 0,
      })
      if (
        response.status === 200 &&
        (response.statusText === 'OK' || response.statusText === '')
      ) {
        return parseInt(response.data.result)
      } else {
        return null
      }
    } else {
      return null
    }
  },

  async getOPFee(fromChainID) {
    // Create an ethers provider connected to the public mainnet endpoint.
    const providerKey = env.localProvider[fromChainID]

    const provider = new ethers.providers.JsonRpcProvider(
      process.env[providerKey]
    )
    // Create contract instances connected to the GPO and WETH contracts.
    const GasPriceOracle = getContractFactory('OVM_GasPriceOracle')
      .attach(predeploys.OVM_GasPriceOracle)
      .connect(provider)
    const ETH = getContractFactory('WETH9')
      .attach(predeploys.WETH9)
      .connect(provider)

    // Arbitrary recipient address.
    const to = store.state.transferData.selectMakerInfo.makerAddress
    // Small amount of WETH to send (in wei).
    const amount = ethers.utils.parseUnits('5', 18)
    // Compute the estimated fee in wei
    const l1FeeInWei = await GasPriceOracle.getL1Fee(
      ethers.utils.serializeTransaction({
        ...(await ETH.populateTransaction.transfer(to, amount)),
        gasPrice: await provider.getGasPrice(),
        gasLimit: 21000,
      })
    )
    // console.log(`Estimated L1 fee (in wei): ${l1FeeInWei.toString()}`)
    return l1FeeInWei
  },

  async getTokenConvertUsd(tokenName) {
    try {
      return (await exchangeToUsd(1, tokenName)).toNumber()
    } catch (error) {
      throw error.message
    }
  },

  realTransferOPID() {
    let toChainID = store.state.transferData.toChainID
    var p_text =
      toChainID.toString().length === 1
        ? '900' + toChainID.toString()
        : '90' + toChainID.toString()
    return p_text
  },
  realTransferAmount() {
    let fromChainID = store.state.transferData.fromChainID
    let toChainID = store.state.transferData.toChainID
    let selectMakerInfo = store.getters.realSelectMakerInfo
    let userValue = new BigNumber(store.state.transferData.transferValue).plus(
      new BigNumber(selectMakerInfo.tradingFee)
    )
    if (!fromChainID || !userValue) {
      return 0
    }
    let rAmount = new BigNumber(userValue).multipliedBy(
      new BigNumber(10 ** selectMakerInfo.precision)
    )
    let rAmountValue = rAmount.toFixed()
    var p_text =
      toChainID.toString().length === 1
        ? '900' + toChainID.toString()
        : '90' + toChainID.toString()
    var tValue = orbiterCore.getTAmountFromRAmount(
      fromChainID,
      rAmountValue,
      p_text
    )
    if (!tValue.state) {
      console.log('getTralTransferAmountError')
      return userValue
    } else {
      return new BigNumber(tValue.tAmount).dividedBy(
        new BigNumber(10 ** selectMakerInfo.precision)
      )
    }
  },
}
