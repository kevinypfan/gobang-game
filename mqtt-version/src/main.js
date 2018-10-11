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

router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const userId = window.localStorage.getItem("userId");
    const roomId = window.localStorage.getItem("roomId");
    if (store.state.user) next();
    if (!userId) {
      next('/')
    } else {
      axios.post("/hasUser", { userId }).then(({ data }) => {
        if (!data) {
          next('/');
        }
        store.commit('setUser', data);
        if (roomId) next()
      }).catch(err => {
        console.log(err)
        next('/roomlist');
      });
    }
  } else {
    next() // make sure to always call next()!
  }
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
