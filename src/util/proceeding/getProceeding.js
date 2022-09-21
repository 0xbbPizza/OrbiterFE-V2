import getTransactionList from '../../core/routes/transactionList'
import config from '../../core/utils/config'
import { store } from '../../store'
import util from '../../util/util'
import { CoinABI } from '../constants/contract/contract.js'
import { localWeb3 } from '../constants/contract/localWeb3.js'
import { EthListen } from './eth_listen'
import BigNumber from 'bignumber.js'
import { constants } from 'ethers'
import env from '../../../env'

const getHistory = () => {
  if (store.getters.realSelectMakerInfo) {
    getTransactionList
      .getTransactionList({
        address: store.state.web3.coinbase,
        daysAgo: 14,
        state: 1, //maker/user
      })
      .then((response) => {
        if (response.state === 1) {
          store.commit('updateTransactionList', response.list)
        }
      })
      .catch((error) => {
        console.log('error =', error)
      })
  }
}

const storeUpdateProceedState = (state) => {
  store.commit('updateProceedState', state)

  getHistory()
}

async function confirmUserTransaction(
  localChainID,
  makerInfo,
  txHash,
  amount,
  dest,
  confirmations = 1
) {
  store.commit('updateProceedingUserTransferLocalChainID', localChainID)
  store.commit('updateProceedingUserTransferTxid', txHash)
  setTimeout(async () => {
    if (!isCurrentTransaction(txHash)) {
      return
    }
    // main & arbitrum
    const trxConfirmations = await getConfirmations(localChainID, txHash)
    if (!trxConfirmations) {
      return confirmUserTransaction(
        localChainID,
        makerInfo,
        txHash,
        amount,
        dest,
        confirmations
      )
    }
    if (!isCurrentTransaction(txHash)) {
      return
    }
    var trx = trxConfirmations.trx
    console.log('trx =', trx)
    if (!isCurrentTransaction(txHash)) {
      return
    }
    store.commit(
      'updateProceedingUserTransferTimeStamp',
      trxConfirmations.timestamp
    )
    console.log(
      'Transaction with hash ' +
      txHash +
      ' has ' +
      trxConfirmations.confirmations +
      ' confirmation(s)'
    )
    if (
      trxConfirmations.confirmations > 0 &&
      trxConfirmations.confirmations < confirmations
    ) {
      if (!isCurrentTransaction(txHash)) {
        return
      }
      storeUpdateProceedState(2)
    }
    if (trxConfirmations.confirmations >= confirmations) {
      console.log(
        'Transaction with hash ' + txHash + ' has been successfully confirmed'
      )
      if (!isCurrentTransaction(txHash)) {
        return
      }
      storeUpdateProceedState(3)

      let amountToSend = amount
      let TransferChainID =
        localChainID === makerInfo.c1ID ? makerInfo.c2ID : makerInfo.c1ID
      startScanMakerTransfer(
        txHash,
        TransferChainID,
        makerInfo,
        makerInfo.makerAddress,
        dest,
        amountToSend
      )
      return
    }
    return confirmUserTransaction(
      localChainID,
      makerInfo,
      txHash,
      amount,
      dest,
      confirmations
    )
  }, 10 * 1000)
}

function startScanMakerTransfer(
  transactionID,
  TransferChainID,
  makerInfo,
  from,
  to,
  amount
) {
  if (!isCurrentTransaction(transactionID)) {
    return
  }
  const web3 = localWeb3(TransferChainID)
  var tokenAddress =
    makerInfo.c1ID === TransferChainID
      ? makerInfo.t1Address
      : makerInfo.t2Address
  let overrideFrom = tokenAddress === constants.AddressZero ? env.destAddress['ETH'][TransferChainID] : from
  ScanMakerTransfer(
    transactionID,
    TransferChainID,
    makerInfo,
    web3,
    tokenAddress,
    overrideFrom,
    to,
    amount
  )
}

function ScanMakerTransfer(
  transactionID,
  TransferChainID,
  makerInfo,
  web3,
  tokenAddress,
  from,
  to,
  amount
) {
  const duration = 10 * 1000
  const ticker = async () => {
    if (!isCurrentTransaction(transactionID)) {
      return
    }

    // checkData
    const checkData = (_from, _to, _amount, _address) => {
      console.log('_from =', _from)
      console.log('_to =', _to)
      console.log('_address =', _address)
      console.log('_amount =', _amount)
      console.log('localChainID =', TransferChainID)
      console.log('makerInfo =', makerInfo)
      console.log('web3 =', web3)
      console.log('tokenAddress =', tokenAddress)
      console.log('from =', from)
      console.log('to =', to)
      console.log('amount =', amount)
      console.log('transactionID =', transactionID)

      if (_address && _address.toLowerCase() !== tokenAddress.toLowerCase()) {
        return false
      }
      if (
        _from.toLowerCase() === from.toLowerCase() &&
        _to.toLowerCase() === to.toLowerCase() &&
        new BigNumber(_amount).comparedTo(new BigNumber(amount)) === 0
      ) {
        if (!isCurrentTransaction(transactionID)) {
          return false
        }
        return true
      }
      return false
    }
    // when is eth tokenAddress
    if (util.isEthTokenAddress(tokenAddress)) {
      let api = null
      let extra = null
      const timestamp = Math.floor((new Date().getTime() - 60000 * 2) / 1000)
      switch (TransferChainID) {
        case 1:
          api = {
            endPoint: config.etherscan.Mainnet,
            key: config.etherscan.Mainnet.key,
          }
          break
        case 5:
          api = {
            endPoint: config.etherscan.Goerli,
            key: config.etherscan.key,
          }
          extra = {
            action: 'txlistinternal',
            TransferChainID,
            timestamp
          }
          break
        case 2:
          api = { endPoint: config.arbitrum.Mainnet, key: '' }
          break
        case 22:
          api = { endPoint: config.arbitrum.Goerli, key: '' }
          extra = {
            action: 'txlistinternal',
            TransferChainID,
            timestamp
          }
          break
        case 7:
          api = {
            endPoint: config.optimistic.Mainnet,
            key: config.optimistic.key,
          }
          break
        case 77:
          api = {
            endPoint: config.optimistic.Rinkeby,
            key: config.optimistic.key,
          }
          break
      }
      if (!api) {
        return
      }

      new EthListen(api, extra, to)
        .setTransferBreaker(() => isCurrentTransaction(transactionID))
        .transfer(
          { from, to },
          {
            onReceived: (transaction) => {
              if (
                checkData(
                  transaction.from,
                  transaction.to,
                  transaction.value,
                  ''
                )
              ) {
                store.commit(
                  'updateProceedingMakerTransferTxid',
                  transaction.transactionHash
                )
                storeUpdateProceedState(4)
              }
            },
            onConfirmation: (transaction) => {
              if (
                checkData(
                  transaction.from,
                  transaction.to,
                  transaction.value,
                  ''
                )
              ) {
                storeUpdateProceedState(5)
              }
            },
          },
          1
        )
      return
    } else {
      const currentBlock = await web3.eth.getBlockNumber()

      const tokenContract = new web3.eth.Contract(CoinABI, tokenAddress)
      // Generate filter options
      const options = {
        filter: {
          from: from,
          to: to,
        },
        fromBlock: currentBlock - 100,
        toBlock: 'latest',
      }
      tokenContract.getPastEvents('Transfer', options, function (error, events) {
        if (!isCurrentTransaction(transactionID)) {
          return
        }
        if (error) {
          console.log('111Error =', error)
        } else {
          for (let index = 0; index < events.length; index++) {
            const txinfo = events[index]
            console.log('txinfo =', txinfo)
            if (
              checkData(
                txinfo.returnValues.from,
                txinfo.returnValues.to,
                txinfo.returnValues.amount,
                txinfo.address
              )
            ) {
              store.commit(
                'updateProceedingMakerTransferTxid',
                txinfo.transactionHash
              )
              storeUpdateProceedState(4)
              confirmMakerTransaction(
                transactionID,
                TransferChainID,
                makerInfo,
                txinfo.transactionHash
              )
              return
            }
          }
        }

        setTimeout(() => ticker(), duration)
      })
    }

  }
  ticker()
  // setTimeout(() => ticker(), 100)
}

async function confirmMakerTransaction(
  transactionID,
  localChainID,
  makerInfo,
  txHash,
  confirmations = 1
) {
  // state: 0 / 1      userTransfer / makerTransfer
  setTimeout(async () => {
    if (!isCurrentTransaction(transactionID)) {
      return
    }
    const trxConfirmations = await getConfirmations(localChainID, txHash)
    if (!trxConfirmations) {
      return confirmMakerTransaction(
        transactionID,
        localChainID,
        makerInfo,
        txHash,
        confirmations
      )
    }
    console.log(
      'Transaction with hash ' +
      txHash +
      ' has ' +
      trxConfirmations.confirmations +
      ' confirmation(s)'
    )
    if (trxConfirmations.confirmations >= confirmations) {
      console.log(
        'Transaction with hash ' + txHash + ' has been successfully confirmed'
      )
      if (!isCurrentTransaction(transactionID)) {
        return
      }
      storeUpdateProceedState(5)
      return
    }
    return confirmMakerTransaction(
      transactionID,
      localChainID,
      makerInfo,
      txHash,
      confirmations
    )
  }, 10 * 1000)
}

async function getConfirmations(localChainID, txHash) {
  try {
    const web3 = localWeb3(localChainID)
    const trx = await web3.eth.getTransaction(txHash)
    const currentBlock = await web3.eth.getBlockNumber()
    if (!trx) {
      return trx
    }
    if (trx.blockNumber !== null) {
      var blockInfo = await web3.eth.getBlock(trx.blockNumber)
      return {
        confirmations: currentBlock - trx.blockNumber,
        trx: trx,
        timestamp: blockInfo.timestamp,
      }
    }
    return { confirmations: 0, trx: trx, timestamp: 0 }
  } catch (error) {
    console.log(error)
  }
}

/*
  Whether the monitoring is the current transaction
  return bool
*/

function isCurrentTransaction(txid) {
  let currentTransaction = store.state.proceedTXID
  if (currentTransaction === txid) {
    return true
  }
  return false
}

export default {
  UserTransferReady(
    user,
    maker,
    amount,
    localChainID,
    makerInfo,
    txHash,
    dest
  ) {
    console.log('user =', user)
    console.log('maker =', maker)
    console.log('amount =', amount)
    console.log('localChainID =', localChainID)
    console.log('makerInfo =', makerInfo)
    console.log('txHash =', txHash)
    console.log('dest =', dest)
    store.commit('updateProceedTxID', txHash)
    store.commit('updateProceedingUserTransferFrom', user)
    store.commit('updateProceedingUserTransferTo', maker)
    var realAmount = amount
    store.commit('updateProceedingUserTransferAmount', realAmount)
    confirmUserTransaction(localChainID, makerInfo, txHash, realAmount, dest)
  },
}
