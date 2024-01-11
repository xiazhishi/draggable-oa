import Vue from 'vue'
import App from './App.vue'
import VueGridLayout from 'vue-grid-layout'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import pathUtils from './util/pathUtils'
import store from './store'
import routes from './router/index'
import VueRouter from "vue-router";

Vue.config.productionTip = false
Vue.use(VueGridLayout)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.prototype.$EventBus = new Vue()
Vue.prototype.$contextPath = pathUtils.getContextPath
Vue.prototype.$extend = function () {
  return Object.assign({}, ...arguments)
}

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')


