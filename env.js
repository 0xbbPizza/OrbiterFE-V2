export default {
  baseUrl: process.env.NODE_ENV === 'production' ? 'http://ec2-35-73-220-137.ap-northeast-1.compute.amazonaws.com' : '/send',
  credential: false,
  localProvider: {
    5: 'VUE_APP_HP_G', // Goerli
    22: 'VUE_APP_HP_AR_G',// Arbitrum Goerli
    77: 'VUE_APP_HP_OP_G',// Optimism Goerli
  },
  localWSProvider: {
    5: 'VUE_APP_WP_G', // Goerli
    22: 'VUE_APP_WP_AR_G', // Arbitrum Goerli
    77: 'VUE_APP_WP_OP_G',// Optimism Goerli
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
    77: '420', // Optimism(G)
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
    'Optimism(G)': 77,
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
    77: 'https://blockscout.com/optimism/goerli/tx/',
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
    77: 'https://blockscout.com/optimism/goerli/address/',
  },
  dTokenAddress: {
    ETH: {
      5: "0x9fCd2baEd3AfE7Fd35d8F38D2A5305526D326f86",
      22: "0x99EEdbaf75827207fCFEDd4f7211F57Ed5431c15",
      77: "0x99EEdbaf75827207fCFEDd4f7211F57Ed5431c15"
    },
    DAI: {
      5: "0x3484fa63622fdBc33BD709B3d23b68755C4642C1",
      577: "0x99797CAAa90b7bd5223570B1d257908A87e69288",
      22: "0x905237E61BCeBE22a1E585EC1673b848d237fC8D",
      77: "0xD82E0163d59395e52A7a179b25DE5793B5Df32eF"
    },
    USDC: {
      5: "0xC98Fb7A5125e0f8a1C32be25ad3655bf24C6192A",
      22: "0xbf7a53F410413541FDe90e83ce20E3a21489494c",
      77: "0xbf7a53F410413541FDe90e83ce20E3a21489494c"
    },
  },
  destAddress: {
    ETH: {
      5: "0xe5c1879aD1A7762DcC19795C0027fe1cFBC93F95",
      22: "0xDE2806B339045ed88e5C89022C19C551C891C1F2",
      77: "0xDE2806B339045ed88e5C89022C19C551C891C1F2"
    },
    DAI: {
      5: "0x0dcDa24e719378fE0f18e117DF8c178b9EFEEb57",
      577: "0x5D71208078554A5BC26AE4A3D99395C70EBdd391",
      22: "0x314b9AF6cda2d332C00e33f55515eb04d4a012c1",
      77: "0xA95fe6E07AC474bBa4DDB238f147Da63a41Afff2"
    },
    USDC: {
      5: "0xd127B977c57326C5137956369D47EF051085fCFF",
      22: "0xb74B89A54d4BE042A4833fAdaED5b7e79Aa97927",
      77: "0xb74B89A54d4BE042A4833fAdaED5b7e79Aa97927"
    }
  },
  sourceAddress: {
    ETH: {
      5: "0xa2b7345BE8D7467eA462388ADdA8C314f6d4DE60",
      22: "0x1EAD43aE303D49c147E92A0F0271C8ffED8abCa6",
      77: "0x1EAD43aE303D49c147E92A0F0271C8ffED8abCa6"
    },
    DAI: {
      5: "0xD1f04Fe74fefED4558513da8db171Ef9cF2ec5A3",
      577: "0x8D5f9349520f11489C284eE06688C2744eF0fed5",
      22: "0x8F4708a973faa099a98519F7515644B0F57dCa67",
      77: "0x8ed7627077630bAB73B6D806c07F67B2020850FE"
    },
    USDC: {
      5: "0x63867a52128485A7F766D20c8acdB6795108E631",
      22: "0x5deCa159b699cb9126a9dB20Aa750C04619a99f9",
      77: "0x5deCa159b699cb9126a9dB20Aa750C04619a99f9"
    }
  },

  coinAddress: {
    ETH: {
      5: "0x0000000000000000000000000000000000000000",
      22: "0x0000000000000000000000000000000000000000",
      77: "0x0000000000000000000000000000000000000000"
    },
    DAI: {
      5: "0x5C221E77624690fff6dd741493D735a17716c26B",
      577: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
      22: "0x3d9835F9cB196f8A88b0d4F9586C3E427af1Ffe0",
      77: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
    },
    USDC: {
      5: "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4",
      22: "0xEA70a40Df1432A1b38b916A51Fb81A4cc805a963",
      77: "0xEA70a40Df1432A1b38b916A51Fb81A4cc805a963"
    }
  },
  precision: {
    ETH: 18,
    DAI: 18,
    USDC: 6
  }
}
