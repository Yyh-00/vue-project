<template>
  <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
          <!-- 侧边栏菜单区域 -->
          <!-- 侧边栏折叠按钮 -->
          <div class="toggle-btn" @click='toggleBtn'>|||</div>
          <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse='isCollapse' :collapse-transition=false router :default-active='activePath'>
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" :key="item.id" v-for="item in menuList">
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subItem.path" :key="subItem.id" v-for="subItem in item.children" @click="saveNavState('/'+subItem.path)">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-suitcase',
        101: 'el-icon-shopping-bag-1',
        102: 'el-icon-sell',
        145: 'el-icon-monitor'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空token值
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$meaasge.error(res.meta.mesg)
      this.menuList = res.data
    },
    toggleBtn () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .el-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    background-color: #373d41;
    >div{
      display: flex;
      align-items: center;
      span{
        margin-left: 10px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
    .el-menu{
      border-right: 0;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .toggle-btn{
    height: 24px;
    background-color: #4a5064;
    color: #fff;
    text-align: center;
    //字间距
    letter-spacing: 0.2em;
    font-size: 10px;
    line-height: 24px;
    cursor: pointer;
  }
</style>
