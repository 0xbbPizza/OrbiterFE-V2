import Vue from 'vue'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed'
import router from './router'
import { store } from './store'
import './config/theme.scss'
import './config/global.css'
import env from '../env'
import { decimal } from '../src/util/decimal/decimal'
import './icons'

import ant from './config/Ant'
import element from './config/Element'
import VueClipboard from 'vue-clipboard2'

import '../src/util/resize/onresize'
import loading from './components/Loading/loading.vue'

Vue.component('loading', loading)
Vue.config.productionTip = false
Vue.use(AsyncComputed)
Vue.use(ant)
Vue.use(element)
Vue.use(VueClipboard)
Vue.prototype.$env = env
Vue.prototype.$decimal = decimal

const defaultTitle = 'Orbiter'
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : defaultTitle
  next()
})

export default new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
