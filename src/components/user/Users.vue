<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <div>
            <el-input placeholder="请输入内容" v-model="userInfo.query" clearable @clear='getUserList'>
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label='姓名' prop='username'></el-table-column>
        <el-table-column label='邮箱' prop='email'></el-table-column>
        <el-table-column label='电话' prop='mobile'></el-table-column>
        <el-table-column label='角色' prop='role_name'></el-table-column>
        <el-table-column label='状态' prop='mg_state'>
          <template slot-scope="scope">
            <!-- {{scope.row}} 当前这一行的数据-->
          <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作' width="180px">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="small"  @click="showUser(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteUser(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip  effect="dark" content="分配角色" placement="top-start" :enterable=false>
            <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userInfo.pagenum"
      :page-sizes="[1, 2, 5, 8]"
      :page-size="userInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total>
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close='addDialogClose'>
          <!-- 内容主体区域 -->
          <span>
            <el-form :model="addForm" ref="addFormRef" label-width="80px" :rules="addRules">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
      </el-dialog>

     <!-- 修改用户信息的对话框 -->
     <el-dialog title="提示" :visible.sync="modifyDialogVisible" width="50%" @close='modifyDialogClose' >
        <!-- 内容主体区域 -->
        <span>
          <el-form :model="modifyForm" ref="modifyFormRef" label-width="80px" :rules="addRules">
            <el-form-item label="用户名">
              <el-input v-model="modifyForm.username" disabled ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="modifyForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="modifyForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyUser">确 定</el-button>
        </span>
     </el-dialog>
   </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入正确的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入正确的电话'))
    }
    return {
      userInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 1,
      dialogVisible: false,
      modifyDialogVisible: false,
      id: 1,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      modifyForm: {},
      addRules: {
        username: [{ required: true, message: '请输入登陆名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkMobile, trigger: 'blur' }]
      }
    }
  },
  // 生命周期函数
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.userInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表数据失败！')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.userInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.userInfo.pagenum = newPage
      this.getUserList()
    },
    // 改变用户状态
    async changeState(userinfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        this.$message.error('设置用户状态失败！')
        userinfo.mg_state = !userinfo.mg_state
        return
      }
      this.$message.success('设置用户状态成功！')
    },
    addDialogClose() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 修改用户数据框关闭
    modifyDialogClose() {
      /* this.addForm = {
        username: '',
        password: '',
        email: '',
        mobile: ''
      } */
      this.$refs.modifyFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请检查表单格式')
        // 可以发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 显示修改用户框内数据
    async showUser(id) {
      /* console.log(msg)
      this.addForm.username = msg.username
      this.addForm.email = msg.email
      this.addForm.mobile = msg.mobile
      this.id = msg.id
      this.modifyDialogVisible = true */
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('修改用户信息请求失败')
      this.modifyForm = res.data
      this.modifyDialogVisible = true
    },
    // 修改用户数据提交
    modifyUser() {
      const params = { email: this.modifyForm.email, mobile: this.modifyForm.mobile }

      this.$refs.modifyFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请检查表单格式')
        // 可以发起修改用户请求
        const { data: res } = await this.$http.put(`users/${this.modifyForm.id}`, params)
        if (res.meta.status !== 200) return this.$message.error('编辑用户失败！')
        this.$message.success('编辑用户成功！')
        this.modifyDialogVisible = false
        this.getUserList()
      })
    },
    async deleteUser(id) {
      // 弹出提示框
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
      })
    }

  }
}
</script>

<style lang="less" scoped>

</style>
