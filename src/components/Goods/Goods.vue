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
          <el-input placeholder="请输入内容"  class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="600px"></el-table-column>
        <el-table-column prop="goods_price" label="商品促销（元）" ></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" ></el-table-column>
        <el-table-column prop="add_time" label="创建时间" ></el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="">
            <el-button type="primary" icon="el-icon-edit"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
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
      goodsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      goodsList: [],
      total: ''
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
      this.$message.success('获取列表数据成功！')
      this.goodsList = res.data.goods
      this.total = res.total
      console.log(res.data)
    },
    goAddGoods() {
      this.$router.push('goods/addgoods')
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
