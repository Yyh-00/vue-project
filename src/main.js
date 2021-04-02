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

// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 使用axios请求拦截器给请求头中添加token值
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须ruturn请求
  return config
})
// 全局挂载
Vue.prototype.$http = axios
// 开发模式下减少警告语句
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 全局挂载富文本依赖
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
