import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './plugins/element.js';
// 存储服务
import AV from 'leancloud-storage';

AV.init({
  appId: 'zgLIy5bygQg8Y97m4zWjQ0Hz-gzGzoHsz',
  appKey: 'xk76YyuQ5gGw7L0AFlnym83F',
  serverURLs: 'https://zgliy5by.lc-cn-n1-shared.com'
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  AV,
  render: h => h(App)
}).$mount('#app');
