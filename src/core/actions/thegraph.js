// util/thegraph.js
import Axios from '../utils/Axios'
import env from '../../../env'
Axios.axios()

const nowMakerList = [
  // DAI
  {
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 5,
    c2ID: 22,
    c1Name: 'Goerli',
    c2Name: 'Arbitrum(G)',
    t1Address: env.coinAddress['DAI'][5],
    t2Address: env.coinAddress['DAI'][22],
    tName: 'DAI',
    c1MinPrice: 0.1,
    c1MaxPrice: 10,
    c2MinPrice: 0.1,
    c2MaxPrice: 10,
    precision: env.precision['DAI'],
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0,
    c2TradingFee: 0,
    c1GasFee: 0,
    c2GasFee: 0,
    c1AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    override: {
      c1ID: false,
      c2ID: false
    }
  },
  {
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 5,
    c2ID: 77,
    c1Name: 'Goerli',
    c2Name: 'Optimism(G)',
    t1Address: env.coinAddress['DAI'][577],
    t2Address: env.coinAddress['DAI'][77],
    tName: 'DAI',
    c1MinPrice: 0.1,
    c1MaxPrice: 10,
    c2MinPrice: 0.1,
    c2MaxPrice: 10,
    precision: env.precision['DAI'],
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0,
    c2TradingFee: 0,
    c1GasFee: 0,
    c2GasFee: 0,
    c1AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    override: {
      c1ID: 577,
      c2ID: false
    }
  },
  {
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 77,
    c2ID: 22,
    c1Name: 'Optimism(G)',
    c2Name: 'Arbitrum(G)',
    t1Address: env.coinAddress['DAI'][77],
    t2Address: env.coinAddress['DAI'][22],
    tName: 'DAI',
    c1MinPrice: 0.1,
    c1MaxPrice: 10,
    c2MinPrice: 0.1,
    c2MaxPrice: 10,
    precision: env.precision['DAI'],
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0,
    c2TradingFee: 0,
    c1GasFee: 0,
    c2GasFee: 0,
    c1AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    override: {
      c1ID: false,
      c2ID: false
    }
  },
  // USDC
  // {
  //   makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
  //   c1ID: 5,
  //   c2ID: 22,
  //   c1Name: 'Goerli',
  //   c2Name: 'Arbitrum(G)',
  //   t1Address: env.coinAddress['USDC'][5],
  //   t2Address: env.coinAddress['USDC'][22],
  //   tName: 'USDC',
  //   c1MinPrice: 0.1,
  //   c1MaxPrice: 10,
  //   c2MinPrice: 0.1,
  //   c2MaxPrice: 10,
  //   precision: env.precision['USDC'],
  //   c1AvalibleDeposit: 1000,
  //   c2AvalibleDeposit: 1000,
  //   c1TradingFee: 0,
  //   c2TradingFee: 0,
  //   c1GasFee: 0,
  //   c2GasFee: 0,
  //   c1AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  //   c2AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  // },
  // {
  //   makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
  //   c1ID: 5,
  //   c2ID: 77,
  //   c1Name: 'Goerli',
  //   c2Name: 'Optimism(G)',
  //   t1Address: env.coinAddress['USDC'][5],
  //   t2Address: env.coinAddress['USDC'][77],
  //   tName: 'USDC',
  //   c1MinPrice: 0.1,
  //   c1MaxPrice: 10,
  //   c2MinPrice: 0.1,
  //   c2MaxPrice: 10,
  //   precision: env.precision['USDC'],
  //   c1AvalibleDeposit: 1000,
  //   c2AvalibleDeposit: 1000,
  //   c1TradingFee: 0,
  //   c2TradingFee: 0,
  //   c1GasFee: 0,
  //   c2GasFee: 0,
  //   c1AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  //   c2AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  // },
  // {
  //   makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
  //   c1ID: 77,
  //   c2ID: 22,
  //   c1Name: 'Optimism(G)',
  //   c2Name: 'Arbitrum(G)',
  //   t1Address: env.coinAddress['USDC'][77],
  //   t2Address: env.coinAddress['USDC'][22],
  //   tName: 'USDC',
  //   c1MinPrice: 0.1,
  //   c1MaxPrice: 10,
  //   c2MinPrice: 0.1,
  //   c2MaxPrice: 10,
  //   precision: env.precision['USDC'],
  //   c1AvalibleDeposit: 1000,
  //   c2AvalibleDeposit: 1000,
  //   c1TradingFee: 0,
  //   c2TradingFee: 0,
  //   c1GasFee: 0,
  //   c2GasFee: 0,
  //   c1AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  //   c2AvalibleTimes: [
  //     {
  //       startTime: 1636019587,
  //       endTime: 99999999999999,
  //     },
  //   ],
  // },

  //ETH
  {
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 5,
    c2ID: 22,
    c1Name: 'Goerli',
    c2Name: 'Arbitrum(G)',
    t1Address: env.coinAddress['ETH'][5],
    t2Address: env.coinAddress['ETH'][22],
    tName: 'ETH',
    c1MinPrice: 0.001,
    c1MaxPrice: 10,
    c2MinPrice: 0.001,
    c2MaxPrice: 10,
    precision: env.precision['ETH'],
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0,
    c2TradingFee: 0,
    c1GasFee: 0,
    c2GasFee: 0,
    c1AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    override: {
      c1ID: false,
      c2ID: false
    }
  },
  {
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 5,
    c2ID: 77,
    c1Name: 'Goerli',
    c2Name: 'Optimism(G)',
    t1Address: env.coinAddress['ETH'][5],
    t2Address: env.coinAddress['ETH'][77],
    tName: 'ETH',
    c1MinPrice: 0.001,
    c1MaxPrice: 10,
    c2MinPrice: 0.001,
    c2MaxPrice: 10,
    precision: env.precision['ETH'],
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0,
    c2TradingFee: 0,
    c1GasFee: 0,
    c2GasFee: 0,
    c1AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    override: {
      c1ID: false,
      c2ID: false
    }
  },
  {
    makerAddress: '0x49377441951437beE356D7d90a16dFF97C66fBB0',
    c1ID: 77,
    c2ID: 22,
    c1Name: 'Optimism(G)',
    c2Name: 'Arbitrum(G)',
    t1Address: env.coinAddress['ETH'][77],
    t2Address: env.coinAddress['ETH'][22],
    tName: 'ETH',
    c1MinPrice: 0.001,
    c1MaxPrice: 10,
    c2MinPrice: 0.001,
    c2MaxPrice: 10,
    precision: env.precision['ETH'],
    c1AvalibleDeposit: 1000,
    c2AvalibleDeposit: 1000,
    c1TradingFee: 0,
    c2TradingFee: 0,
    c1GasFee: 0,
    c2GasFee: 0,
    c1AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    c2AvalibleTimes: [
      {
        startTime: 1636019587,
        endTime: 99999999999999,
      },
    ],
    override: {
      c1ID: false,
      c2ID: false
    }
  },
]

export default {
  getMakerInfo: function (req, next) {
    return new Promise((resolve, reject) => {
      var res = {}
      res.code = 0
      res.data = nowMakerList
      if (next) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  },
  getAllMakerList: function (req, next) {
    return new Promise((resolve, reject) => {
      var res = {}
      res.code = 0
      res.data = []

      // push now makerList
      res.data = res.data.concat(nowMakerList)

      if (next) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  },
}
