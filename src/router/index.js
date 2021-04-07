import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/User/Users.vue'
import Rights from '../components/Power/Rights.vue'
import Roles from '../components/Power/Roles.vue'
import Categories from '../components/Goods/Categories.vue'
import Params from '../components/Goods/Params.vue'
import Goods from '../components/Goods/Goods.vue'
import AddGoods from '../components/Goods/AddGoods.vue'
import Report from '../components/Report/Report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: Goods
      },
      {
        path: '/goods/addgoods',
        component: AddGoods
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
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
