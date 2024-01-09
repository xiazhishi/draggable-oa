import Vue from 'vue'
import App from './App.vue'
import VueGridLayout from 'vue-grid-layout'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'

Vue.config.productionTip = false
Vue.use(VueGridLayout)
Vue.use(ElementUI)
Vue.prototype.$EventBus = new Vue()

new Vue({
  render: h => h(App),
  store
}).$mount('#app')


