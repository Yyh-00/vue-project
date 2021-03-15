import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转页面
  // next 是一个函数，表示放行
  // 如果用户访问的登陆也，直接放行
  if (to.path === '/login') return next()
  // 从seeeionStorge中获取到token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token直接跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})
export default router
