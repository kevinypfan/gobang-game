import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    room: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setRoom(state, payload) {
      state.room = payload
    },
  },
  actions: {

  }
})
