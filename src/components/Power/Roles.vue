<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
       <el-row >
        <el-col ><el-button type="primary">添加角色</el-button></el-col>
      </el-row>
       <el-table :data="rolesList" border stripe>
         <!-- 展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bd-bottom' ,index===0?'bd-top':'','vcenter']" v-for="(item1,index) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <!-- 通过for循环渲染嵌套二级权限 -->
                <el-row :class="[index2 === 0?'':'bd-top']" v-for="(item2,index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close='deleteRight'>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
         <!-- 序号 -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label='角色名称' prop='roleName'></el-table-column>
        <el-table-column label='角色描述' prop='roleDesc'></el-table-column>
        <el-table-column label='操作' width="300px">
          <!-- 作用域插槽获取行前行的数据 -->
          <template slot-scope="">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small" >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" >删除</el-button>
            <!-- 分配权限按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="small">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
    },
    deleteRight() {
      /* this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败！')
        // this.$message.success('删除用户成功！')
        this.getUserList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }) */
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bd-top{
  border-top: 1px solid #c0c0c0;
}
.bd-bottom{
  border-bottom: 1px solid #c0c0c0;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
