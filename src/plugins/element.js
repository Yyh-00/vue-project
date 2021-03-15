import Vue from 'vue'
import { Button, Form, FormItem, Input, Icon, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Icon)
// 全局挂载登弹窗提示
Vue.prototype.$message = Message
