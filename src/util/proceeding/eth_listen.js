import axios from 'axios'

const ETHLISTEN_TRANSFER_DURATION = 5 * 1000

export class EthListen {
  constructor(api, extra, address) {
    this.api = api
    this.extra = extra
    this.address = address

    this.transferReceivedHashs = {}
    this.transferConfirmationedHashs = {}
  }

  setTransferBreaker(transferBreaker) {
    this.transferBreaker = transferBreaker
    return this
  }

  transfer(filter, callbacks = undefined, confirmationsTotal = 3) {
    const checkFilter = (from, to) => {
      if (!filter) {
        return true
      }

      if (filter.from && filter.from.toUpperCase() != from.toUpperCase()) {
        return false
      }

      if (filter.to && filter.to.toUpperCase() != to.toUpperCase()) {
        return false
      }
      return true
    }

    let isFirstTicker = true
    let startblock = 0
    const timer = setInterval(() => ticker(), ETHLISTEN_TRANSFER_DURATION)
    const ticker = async () => {
      try {
        if (this.transferBreaker && this.transferBreaker() === false) {
          clearInterval(timer)
          return
        }

        if (isFirstTicker) {
          try {
            const resp = await axios.get(this.api.endPoint, {
              params: {
                apiKey: this.api.key,
                module: 'block',
                action: 'getblocknobytime',
                timestamp: this.extra.timestamp,
                closest: 'before'
              },
              timeout: 16000,
            })
            if (resp.status === 200 && resp.data) {
              if (resp.data.result.blockNumber) {
                startblock = parseInt(resp.data.result.blockNumber)
              } else {
                startblock = parseInt(resp.data.result)
              }
            }
            isFirstTicker = false
          } catch (error) {
            console.error(error)
          }
        }
        const resp = await axios.get(this.api.endPoint, {
          params: {
            apiKey: this.api.key,
            module: 'account',
            action: this.extra.action,
            address: this.address,
            page: 1,
            offset: 200,
            startblock,
            endblock: 'latest',
            sort: 'asc',
          },
          timeout: 16000,
        })
        const { data } = resp
        if (data.status != '1' || !data.result || data.result.length <= 0) {
          return
        }
        for (const item of data.result) {
          if (!checkFilter(item.from, item.to,)) {
            continue
          }

          if (this.extra.action === 'txlist' && confirmationsTotal > 0) {
            if (this.transferReceivedHashs[item.hash] === undefined) {
              this.transferReceivedHashs[item.hash] = true
              callbacks && callbacks.onReceived && callbacks.onReceived(item)
            }
            if (
              this.transferConfirmationedHashs[item.hash] === undefined &&
              item.confirmations >= confirmationsTotal
            ) {
              this.transferConfirmationedHashs[item.hash] = true
              callbacks &&
                callbacks.onConfirmation &&
                callbacks.onConfirmation(item)
            }
          } else if (this.extra.action === 'txlistinternal') {
            let hashSymbol = null
            if (this.extra.TransferChainID === 22) {
              hashSymbol = 'transactionHash'
            } else if (this.extra.TransferChainID === 5) {
              hashSymbol = 'hash'
            }
            if (this.transferReceivedHashs[item[hashSymbol]] === undefined) {
              this.transferReceivedHashs[item[hashSymbol]] = true
              let receiveItem = item;
              receiveItem['transactionHash'] = item[hashSymbol]
              callbacks && callbacks.onReceived && callbacks.onReceived(receiveItem)
            }
            if (
              this.transferConfirmationedHashs[item[hashSymbol]] === undefined &&
              item.type === 'call' && item.value > 0
            ) {
              this.transferConfirmationedHashs[item[hashSymbol]] = true
              callbacks &&
                callbacks.onConfirmation &&
                callbacks.onConfirmation(item)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    ticker()
  }
}
