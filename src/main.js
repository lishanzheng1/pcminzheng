import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import storageUtil from './util/storageUtil'
import axios from 'axios'

Vue.use(ElementUI);
Vue.prototype.$axios = axios;
//Vue.prototype.serverUrl = 'http://localhost:7001';
Vue.prototype.serverUrl = 'http://info.windd.cn/collection'

router.beforeEach((to, from, next) => {
  const type = to.meta.type;
  if (type === 'login') {
    if (storageUtil.read('sessionId')) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router
});
