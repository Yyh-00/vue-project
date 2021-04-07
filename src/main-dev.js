import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './plugins/element.js'
// 导入全局样式文件
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import echarts from 'echarts'
// 导入nprogress对应的包和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根路径
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.baseURL = 'http://itcgq.com:8888/api/private/v1/'
// 使用axios请求拦截器给请求头中添加token值，展示进度条
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 展示进度条
  NProgress.start()
  // 最后必须ruturn请求
  return config
})
// 在response拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  return config
})

// 全局挂载
Vue.prototype.$http = axios
// 开发模式下减少警告语句
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 全局挂载富文本依赖
Vue.use(VueQuillEditor)
// 全局挂在echarts
Vue.prototype.$echarts = echarts

Vue.filter('dataFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
