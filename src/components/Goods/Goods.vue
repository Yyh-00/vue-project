<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加商品 -->
      <el-row :gutter="20">
        <el-col>
          <el-input placeholder="请输入内容"  class="input-with-select" clearable v-model="goodsInfo.query" @clear='getGoodsList'>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
        <el-table-column prop="goods_price" label="商品促销（元）" width="150px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="150px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200px">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showGoodsParams(scope.row.goods_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteGoodsParams(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="goodsInfo.pagenum"
          :page-sizes="[2, 5, 8, 10]"
          :page-size="goodsInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!-- 编辑按钮对话框 -->
    <el-dialog
      title="编辑信息"
      :visible.sync="editDialogVisible"
      width="50%"
      >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_name">
          <el-input v-model="editForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_name">
          <el-input v-model="editForm.goods_weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      goodsList: [],
      total: 0,
      editForm: {},
      editFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }]
      },
      editDialogVisible: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.goodsInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败！')
      }
      // this.$message.success('获取列表数据成功！')
      this.goodsList = res.data.goods
      this.total = res.data.total
      // console.log(res.data)
    },
    goAddGoods() {
      this.$router.push('goods/addgoods')
    },
    handleSizeChange(newSize) {
      this.goodsInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.goodsInfo.pagenum = newPage
      this.getGoodsList()
    },
    async showGoodsParams(id) {
      const { data: res } = await this.$http.get(`goods/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败！')
      }
      this.editForm = res.data
      console.log(this.editForm.goods_id)
      console.log(id)
      this.editDialogVisible = true
    },
    editGoodsParams() {
      const pics = []
      const picsObj = {}
      // picsObj.pic = '/tmp_uploads/' + this.editForm.pics[0].pics_id.subString(22)
      picsObj.pic = this.editForm.pics.length > 0 ? "'/tmp_uploads/' + this.editForm.pics[0].pics_id.subString(22)" : '[]'
      // console.log(this.editForm.pics)
      pics.push(picsObj)

      const attrs = []
      this.editForm.attrs.forEach(item => {
        const attrsObj = {}
        attrsObj.attr_id = item.attr_id
        attrsObj.attr_value = item.attr_value
        attrs.push(attrsObj)
      })

      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请先补全表单数据！')
        }
        const { data: res } = await this.$http.put(`goods/${this.editForm.goods_id}`, {
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_number: this.editForm.goods_number,
          goods_weight: this.editForm.goods_weight,
          goods_introduce: this.editForm.goods_introduce,
          pics: pics,
          attrs: attrs
        })
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('编辑商品信息失败！')
        }
        this.getGoodsList()
        this.editDialogVisible = false
      })
    },
    deleteGoodsParams(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(`goods/${id}`)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getGoodsList()
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
.input-with-select{
  width: 400px;
  margin-right: 20px;
}
</style>
