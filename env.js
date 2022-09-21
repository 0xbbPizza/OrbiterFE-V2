export default {
  baseUrl: process.env.NODE_ENV === 'production' ? 'http://ec2-35-73-220-137.ap-northeast-1.compute.amazonaws.com' : '/send',
  credential: false,
  localProvider: {
    5: 'VUE_APP_HP_G', //Goerli
    22: 'VUE_APP_HP_AR_G',// Arbitrum Goerli
  },
  localWSProvider: {
    5: 'VUE_APP_WP_G', //Goerli
    22: 'VUE_APP_WP_AR_G', // Arbitrum Goerli
  },

  supportLocalNetWorksIDs: [
    '1',
    '2',
    '3',
    '5',
    '6',
    '7',
    '22',
    '33',
    '66',
    '77',
  ],
  localChainID_netChainID: {
    1: '1', // mainnet
    2: '42161', // Arbitrum
    3: '1', // zk
    4: '1', // starknet  
    5: '5', // Goerli
    6: '137', // polygon
    7: '10', // optimism
    22: '421613', // Arbitrum(G)
    33: '4', // zktest
    44: '4', // starknet(R)
    66: '80001', // polygon(R)
    77: '69', // optimism(K )
  },
  localChainMap: {
    Mainnet: 1,
    Arbitrum: 2,
    ZkSync: 3,
    Polygon: 6,
    Optimism: 7,
    Goerli: 5,
    'Arbitrum(G)': 22,
    'ZkSync(R)': 33,
    'Polygon(R)': 66,
    'Optimism(K)': 77,
  },
  txExploreUrl: {
    1: 'https://etherscan.io/tx/', // /tx/  /address/
    5: 'https://goerli.etherscan.io/tx/', // /tx/  /address/
    2: 'https://arbiscan.io/tx/', // /tx/  /address/
    22: 'https://goerli-rollup-explorer.arbitrum.io/tx/',
    3: 'https://zkscan.io/explorer/transactions/',
    33: 'https://rinkeby.zkscan.io/explorer/transactions/', // /explorer/transactions/   /explorer/accounts/
    6: 'https://polygonscan.com/tx/',
    66: 'https://mumbai.polygonscan.com/tx/',
    7: 'https://optimistic.etherscan.io/tx/',
    77: 'https://kovan-optimistic.etherscan.io/tx/',
  },
  accountExploreUrl: {
    1: 'https://etherscan.io/address/', // /tx/  /address/
    5: 'https://goerli.etherscan.io/address/', // /tx/  /address/
    2: 'https://arbiscan.io/address/', // /tx/  /address/
    22: 'https://goerli-rollup-explorer.arbitrum.io/address/',
    3: 'https://zkscan.io/explorer/accounts/',
    33: 'https://rinkeby.zkscan.io/explorer/accounts/', // /explorer/transactions/   /explorer/accounts/
    6: 'https://polygonscan.com/address/',
    66: 'https://mumbai.polygonscan.com/address/',
    7: 'https://optimistic.etherscan.io/address/',
    77: 'https://kovan-optimistic.etherscan.io/address/',
  },
  dTokenAddress: {
    ETH: {
      5: "0x9252621d299F4815F6F147D86c4a05B110B374d1",
      22: "0x115e2BbB909a5183F5c1B43C61Db0fae0e383dc7"
    },
    DAI: {
      5: "0x3484fa63622fdBc33BD709B3d23b68755C4642C1",
      22: "0x905237E61BCeBE22a1E585EC1673b848d237fC8D"
    },
    USDC: {
      5: "0xC98Fb7A5125e0f8a1C32be25ad3655bf24C6192A",
      22: "0xbf7a53F410413541FDe90e83ce20E3a21489494c"
    },
  },
  destAddress: {
    ETH: {
      5: "0xE6558c42B7Ee0C571bce9E5BBC43E1f51CdcCCa0",
      22: "0xC74AE1988f06332570775F4F18D7AbF7C5533525"
    },
    DAI: {
      5: "0x0dcDa24e719378fE0f18e117DF8c178b9EFEEb57",
      22: "0x314b9AF6cda2d332C00e33f55515eb04d4a012c1"
    },
    USDC: {
      5: "0xd127B977c57326C5137956369D47EF051085fCFF",
      22: "0xb74B89A54d4BE042A4833fAdaED5b7e79Aa97927"
    }
  },
  sourceAddress: {
    ETH: {
      5: "0x125671c5312086accb6D6Ee679510066707e9261",
      22: "0x1c67438eba7cDA2a99265Db845758c1B41e05028"
    },
    DAI: {
      5: "0xD1f04Fe74fefED4558513da8db171Ef9cF2ec5A3",
      22: "0x8F4708a973faa099a98519F7515644B0F57dCa67"
    },
    USDC: {
      5: "0x63867a52128485A7F766D20c8acdB6795108E631",
      22: "0x5deCa159b699cb9126a9dB20Aa750C04619a99f9"
    }
  },

  coinAddress: {
    ETH: {
      5: "0x0000000000000000000000000000000000000000",
      22: "0x0000000000000000000000000000000000000000",
    },
    DAI: {
      5: "0x5C221E77624690fff6dd741493D735a17716c26B",
      22: "0x3d9835F9cB196f8A88b0d4F9586C3E427af1Ffe0",
    },
    USDC: {
      5: "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4",
      22: "0xEA70a40Df1432A1b38b916A51Fb81A4cc805a963"
    }
  },
  precision: {
    ETH: 18,
    DAI: 18,
    USDC: 6
  }
}
