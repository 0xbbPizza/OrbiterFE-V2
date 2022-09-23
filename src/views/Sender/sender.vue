<template>
  <div
    class="senderContent"
    :style="{ width: status === '3' ? '60rem' : '48rem' }"
  >
    <keep-alive>
      <Transfer
        v-on:stateChanged="changeState"
        v-if="status === '1' && !showDetail"
      />
    </keep-alive>
    <Confirm
      v-on:stateChanged="changeState"
      v-if="status === '2' && !showDetail"
    />
    <Proceed
      v-on:stateChanged="changeState"
      v-if="status === '3' && !showDetail"
    />
    <Detail
      :detailData="detailData"
      v-on:stateChanged="changeState"
      v-if="showDetail"
    />
    <!-- <div class="grant">
      <span>
        Welcome to Pizza 🍕 Bridge, a decentralized L222 bridge, <br />
        Idea from Vitalik:<a
          href="https://gitcoin.co/issue/gitcoinco/skunkworks/253/100027342"
          >Grant Program</a
        ><br />
        THE CODE<br />
        <a href="https://github.com/0xbbPizza/L2Bridge-GitcoinBounty"
          >🌊Contract and README</a
        ><br />
        <a href="https://github.com/0xbbPizza/OrbiterFE-V2"
          >🏄frontend (power by eric)</a
        ><br />
        <p>
          🚰Get rinkeby DAI token from
          <a href="https://mint.zksync.dev/mint" target="_blank">this faucet</a>
        </p>
      </span>
    </div> -->
  </div>
</template>

<script>
import Transfer from './transfer'
import Confirm from './confirm'
import Proceed from './proceed'
import Detail from '../../components/sender/detail'
import Middle from '../../util/middle/middle'
export default {
  name: 'Sender',
  props: {},
  components: {
    Transfer,
    Confirm,
    Proceed,
    Detail,
  },
  data() {
    return {
      status: '1', // 1 2.confirm 3.proceed
      showDetail: false,
      detailData: null,
    }
  },
  watch: {},
  mounted() {
    Middle.$on('showDetail', (state) => {
      if (state) {
        this.showDetail = true
        this.detailData = state
      }
    })
  },
  computed: {},
  methods: {
    changeState(e) {
      if (e !== '1' && e !== '2' && e !== '3') {
        this.showDetail = false
      } else {
        if (this.status !== e) {
          this.status = e
        }
      }
    },
    dosome() {
      window.open('https://www.google.com', '_blank')
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.senderContent {
  height: 54rem;
  padding: 2.4rem 2rem;
}
</style>
