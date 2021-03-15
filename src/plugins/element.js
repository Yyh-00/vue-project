import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Icon,
  Message,
  Container,
  Header,
  Main,
  Aside
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Icon)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
// 全局挂载登弹窗提示
Vue.prototype.$message = Message
