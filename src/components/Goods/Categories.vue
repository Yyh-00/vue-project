<template>
   <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addClass">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table class="treeTable" :columns='columns' :data='catelist' show-index border :show-row-hover='false' :selection-type='false' :expand-type='false'>
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color:green" v-if="scope.row.cat_deleted===true"></i>
          <i class="el-icon-error" style="color:red"  v-if="scope.row.cat_deleted===false"></i>
        </template>
        <template slot="islevel" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <template slot="opt" >
          <el-button type="primary" icon="el-icon-edit" size="medium" >编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="medium">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[2, 5, 8, 10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

     <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose" >
      <span>
        <el-form ref="addClassFormRef" :model="addForm" label-width="80px" :rules="addRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
              <el-cascader
                v-model="selectKeys"
                :options="parentCateList"
                :props="selsectProps"
                @change="handleChange" clearable ></el-cascader>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
      </span>
    </el-dialog>
   </div>

</template>

<script>
export default {
  data() {
    return {
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [],
      total: 0,
      // tree-table中的属性
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok'
        }, {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'islevel'
        }, {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addDialogVisible: false,
      addRules: {
        cat_name: { required: true, message: '请输入分类名称', trigger: 'blur' }
      },
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0

      },
      // 父级分类的列表
      parentCateList: [],
      // 被选中的分类id
      selectKeys: [],
      // 级联框中的prop属性设置
      selsectProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryinfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败！')
      }
      console.log(res)
      this.catelist = res.data.result
      this.total = res.data.total
    },
    // 展示条数变更
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize
      this.getCateList()
    },
    // 展示页面变更
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage
      this.getCateList()
    },
    addClass() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }

      this.parentCateList = res.data
    },
    handleChange() {
      // 判断selectKeys数组长度是否大于0
      if (this.selectKeys.length > 0) {
        this.addForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addForm.cat_level = this.selectKeys.length
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    confirmSelect() {
      this.$refs.addClassFormRef.validate(async vaild => {
        if (!vaild) {
          return this.$message.error('请注意表单格式')
        }
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addDialogVisible = false
      })
    },
    // 添加分类对话框关闭事件
    addDialogClose() {
      this.$refs.addClassFormRef.resetFields()
      this.selectKeys = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    }
  }
}

</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
  font-size: 12px;
}
.el-cascader{
  width: 100%;
}
</style>
