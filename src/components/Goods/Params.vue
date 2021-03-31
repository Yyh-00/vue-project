<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning"  show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_sec">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectKey"
            :options=" cartList"
            :props="props"
            @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加动态参数按钮 -->
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!--动态参数表格  -->
          <el-table :data="manyData" border stripe>
             <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close='tabClose(i,scope.row)'>{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
              <!-- 序号 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="medium" @click="showParamsData(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteParamsData(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only" >
          <!-- 添加静态属性按钮 -->
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
           <!--静态属性表格  -->
          <el-table :data="onlyData" border stripe>
             <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close='tabClose(i,scope.row)'>{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
              <!-- 序号 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="medium" @click="showParamsData(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="medium" @click="deleteParamsData(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加属性的对话框 -->
      <el-dialog
        :title="'添加'+ addText"
        :visible.sync="addDialogVisible"
        width="50%" @close='addDialogClose'
       >
        <span>
          <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" >
          <el-form-item :label="addText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParamsData">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数和属性的对话框 -->
      <el-dialog
        :title="'修改'+ addText"
        :visible.sync="editDialogVisible"
        width="50%" @close='editDialogClose'
       >
        <span>
          <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="100px" >
          <el-form-item :label="addText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParamsData">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartList: [],
      // 级联选择框双向绑定的数组
      selectKey: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      // 动态属性参数
      manyData: [],
      // 静态属性参数
      onlyData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: { required: true, message: '请输入分类名称', trigger: 'blur' }
      },
      editDialogVisible: false,
      editForm: {},
      // 控制按钮与输入框切换的状态
      inputVisible: false,
      // 输入框的内容
      inputValue: ''
    }
  },
  created() {
    this.getCartList()
  },
  methods: {
    // 获取分类列表
    async getCartList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.erroe('获取分类列表失败！')
      }
      // console.log(this.cartList)
      this.cartList = res.data
    },
    // 联级选择框数据变化
    handleChange() {
      this.getParamsData()
    },
    // tab页切换
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数数据
    async getParamsData() {
      // 长度不为3 则不是3级分类
      if (this.selectKey.length !== 3) {
        this.selectKey = []
        this.manyData = []
        this.onlyData = []
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return
      }
      // console.log(res.data)
      // 循环数据增加一些业务逻辑
      res.data.forEach(item => {
        // 三元表达式判断 若attr_vals为空则返回空数组，因为空数据分隔也会得到一个“”空字段
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    // 关闭添加对话框 重置
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭修改对话框 重置
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 添加参数
    async addParamsData() {
      const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
      if (res.meta.status !== 201) {
        return this.$message.error('添加分类失败！')
      }
      this.$message.success('添加分类成功！')
      this.getParamsData()
      this.addDialogVisible = false
    },
    // 修改参数显示原有数据
    async showParamsData(id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        return
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改参数
    async editParamsData() {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })

      if (res.meta.status !== 200) {
        return this.$message.error('更新失败！')
      }
      this.$message.success('更新成功！')
      this.getParamsData()
      this.editDialogVisible = false
    },
    // 删除参数
    deleteParamsData(id) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败！')
        }
        this.getParamsData()
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
    // 输入框数去焦点活按下enter键会消失
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
      } else {
        // 后续提交内容
        row.attr_vals.push(row.inputValue.trim())
        row.inputVisible = false
        row.inputValue = ''

        this.updateData(row)
      }
    },
    async updateData(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, { attr_name: row.attr_name, attr_sel: this.activeName, attr_vals: row.attr_vals.join(' ') })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败！')
      }
    },
    // 点击按钮输入框消失
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // 输入框布尔值改变是页面并没有立即重新渲染
      // $nextTick 方法的作用：就是当页面上元素被重新渲染后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 参数标签删除
    tabClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.updateData(row)
    }
  },
  // 计算属性
  computed: {
    // 返回一个布尔值
    isBtnDisabled() {
      if (this.selectKey.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId() {
      if (this.selectKey.length === 3) {
        return this.selectKey[2]
      }
      return null
    },
    addText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_sec{
  margin: 15px 0;
}
.el-tag{
  margin-right: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>
