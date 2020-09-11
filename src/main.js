import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'

Vue.config.productionTip = false
// 设置基础地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 用请求拦截器在请求头中的Authorization字段中添加token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 全局引入http
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
