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
        <el-col ><el-button type="primary" @click="showAddRolesDialog">添加角色</el-button></el-col>
      </el-row>
       <el-table :data="rolesList" border stripe>
         <!-- 展开 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bd-bottom' ,index===0?'bd-top':'','vcenter']" v-for="(item1,index) in scope.row.children" :key="item1.id" >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close='deleteRight(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <!-- 通过for循环渲染嵌套二级权限 -->
                <el-row :class="[index2 === 0?'':'bd-top']" v-for="(item2,index2) in item1.children" :key="item2.id" >
                  <el-col :span="6">
                    <el-tag type="success" closable @close='deleteRight(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close='deleteRight(scope.row,item3.id)'>
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
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small"  @click="showRoles(scope.row.id)">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteRoles(scope.row.id)">删除</el-button>
            <!-- 分配权限按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="small" @click="showSetRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改用户权限信息的对话框 -->
      <el-dialog title="提示" :visible.sync="modifyDialogVisible" width="50%">
        <!-- 内容主体区域 -->
        <span>
          <el-form :model="modifyForm" ref="modifyFormRef" label-width="80px">
            <el-form-item label="角色名称">
              <el-input v-model="modifyForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="modifyForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click=" modifyDialogVisible= false">取 消</el-button>
          <el-button type="primary" @click="modifyRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加角色的对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRolesDialogVisible" width="50%" @close='addRolesDialogClose'>
        <span>
          <el-form :model="addRolesForm" ref="addRolesFormRef" label-width="80px" :rules="addRules">
            <el-form-item label="角色名称" prop='roleName'>
              <el-input v-model="addRolesForm.roleName" ></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="addRolesForm.roleDesc"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

     <!-- 设置权限的对话框 -->
      <el-dialog
        title="分配权限" :visible.sync="SetRightsDialogVisible" width="50%" @close='SetRightsDialogClose'>
        <span>
          <el-tree :data="rightsList" :props="defaultProps" show-checkbox default-expand-all node-key='id' :default-checked-keys='defkeys' ref="treeRef"></el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="SetRightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRight">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      modifyForm: {},
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      rightsList: {},
      defkeys: [],
      roleId: '',
      modifyDialogVisible: false,
      SetRightsDialogVisible: false,
      addRolesDialogVisible: false,
      addRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      defaultProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
    },
    // 删除指定权限
    deleteRight(role, id3) {
      this.$confirm('此操作将永久删除该用户权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data: res } = await this.$http.delete('roles/' + role.id + '/rights/' + id3)
        if (res.meta.status !== 200) return this.$message.error('删除失败！')
        // this.$message.success('删除用户成功！')
        // this.getRolesList()
        role.children = res.data
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 删除指定角色
    async deleteRoles(id) {
      // console.log(document.body.scrollHeight)
      // 弹出提示框
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) return this.$message.error('删除失败！')
        // this.$message.success('删除用户成功！')
        this.getRolesList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示修改用户框内数据
    async showRoles(id) {
      /* console.log(msg)
      this.addForm.username = msg.username
      this.addForm.email = msg.email
      this.addForm.mobile = msg.mobile
      this.id = msg.id
      this.modifyDialogVisible = true */
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('修改用户信息请求失败')
      this.modifyForm = res.data
      this.modifyDialogVisible = true
    },
    // 修改用户数据
    modifyRoles() {
      const params = { roleName: this.modifyForm.roleName, roleDesc: this.modifyForm.roleDesc }

      this.$refs.modifyFormRef.validate(async valid => {
        // if (!valid) return this.$message.error('请检查表单格式')
        // 可以发起修改用户请求
        const { data: res } = await this.$http.put(`roles/${this.modifyForm.roleId}`, params)
        if (res.meta.status !== 200) return this.$message.error('编辑用户失败！')
        this.$message.success('编辑用户成功！')
        this.modifyDialogVisible = false
        this.getRolesList()
      })
    },
    // 显示设置权限的对话框
    async showSetRightsDialog(role) {
      // 获取所有权限列表
      this.roleId = role.id
      // console.log(typeof (this.roleId))
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
      }
      this.rightsList = res.data
      // console.log(this.rightsList)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defkeys)
      this.SetRightsDialogVisible = true
    },
    // 通过递归的方式获取角色下三级权限的id并保存到defkeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    SetRightsDialogClose() {
      this.defkeys = []
    },
    // 分配权限
    async allotRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keysStr = keys.join(',')
      const { data: res } = await this.$http.post('roles/' + this.roleId + '/rights', { rids: keysStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.SetRightsDialogVisible = false
    },
    // 显示添加角色对话框
    showAddRolesDialog() {
      this.addRolesDialogVisible = true
    },
    // 添加角色
    addRoles() {
      // 表单提交前的验证
      this.$refs.addRolesFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请检查表单格式')
        // 可以发起添加用户请求
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加角色成功！')
        this.addRolesDialogVisible = false
        this.getRolesList()
      })
    },
    addRolesDialogClose() {
      this.$refs.addRolesFormRef.resetFields()
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
