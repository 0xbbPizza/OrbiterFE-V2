import env from '../../../env'
const state = {
  web3: {
    isInstallMeta: false,
    isInjected: false,
    web3Instance: null,
    networkId: null,
    coinbase: null,
    error: null,
    localLogin: true,
    starkNet: {
      starkNetAddress: '',
      starkNetWalletName: '',
      starkWalletIcon: '',
      starkIsConnected: false,
      starkChain: '',
    },
  },
  innerWH: {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  },
  confirmData: {
    routeDescInfo: [],
  },
  transferData: {
    selectTokenInfo: '',
    selectMakerInfo: '',
    fromChainID: '',
    toChainID: '',
    transferValue: 0,
    gasFee: 0,
    ethPrice: 0,
    amount: 0,
    destAddress: '',
  },
  proceedState: 1,
  proceedTXID: null,
  proceeding: {
    userTransfer: {
      localChainID: null,
      from: null,
      to: null,
      amount: null,
      txid: null,
      isConfirmed: null,
      nonce: null,
      timeStamp: null,
    },
    makerTransfer: {
      localChainID: null,
      from: null,
      to: null,
      amount: null,
      txid: null,
      isConfirmed: null,
      nonce: null,
      timeStamp: null,
    },
  },
  zktokenList: {
    rinkeby: [],
    mainnet: [],
  },
  transactionList: null,
  liquidityData: [],
  poolNetworkOrTokenConfig: {
    dTokenAddresses: env.dTokenAddresses,
    makerInfoList: [],
    NetworkArray: [],
    toChainAddress: {},
    toChainId: 0,
    tokenInfoArray: [],
  },
  themeMode: localStorage.getItem('themeMode') || 'light', // light dark
  curPage: {
    Status: '1',
    TabState: 'Sender',
    NetworkliquidityState: '1',
    curNetworkPoolMode: true,
  },
  dialog: {
    selectWalletDialogVisible: false,
    isStarkNetDialog: false,
    addLiquidityDialogVisible: false,
  },
  isMobile: false,
}
export default state
