import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userData: {},
    typeList: [
      { text: 'JavaScript', value: '0' },
      { text: 'HTML', value: '1' },
      { text: 'CSS', value: '2' },
      { text: '框架类', value: '3' },
      { text: '基础类', value: '4' },
      { text: '业务类', value: '5' }
    ]
  },
  mutations: {
    setUser(state, user) {
      state.userData = user._serverData;
    },
    clearUser(state) {
      state.userData = {};
    }
  },
  actions: {},
  modules: {}
});
