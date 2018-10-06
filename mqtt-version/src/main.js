import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMqtt from 'vue-mqtt';
import axios from './axiosInstance'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.use(VueMqtt, 'ws://120.105.129.49:9001');

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
