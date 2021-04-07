<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert title="添加商品信息" type="info" show-icon center></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 侧边标签页区域 -->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsFormRef" label-width="100px" label-position='top'>
       <el-tabs :tab-position="'left'"  v-model="activeIndex" :before-leave='beforeTabLeave' @tab-click='tabClick'>
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop='goods_name'>
            <el-input v-model="addGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop='goods_price'>
            <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop='goods_weight'>
            <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop='goods_number'>
            <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
            v-model="addGoodsForm.goods_cat"
            :options="catelist"
            :props="props"
            @change="handleChange" clearable>
           </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!-- 复选框组件 -->
          <el-form-item :label="item.attr_name" v-for="item in manyParamsData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals" >
              <el-checkbox v-for="(cb,i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
           </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyParamsData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="https://www.liulongbin.top:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture" :headers="headersObj" :on-success='handleSuccess' >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器 -->
          <quill-editor :content='addGoodsForm.goods_introduce'></quill-editor>
          <!-- 添加按钮 -->
          <el-button type="primary" class="addGoods" @click="addGoods">添加商品</el-button>
        </el-tab-pane>
       </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片的对话框 -->
    <el-dialog
      title="预览图片"
      :visible.sync="previewVisible"
      width="50%"
      >
      <img :src="previewUrl" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品介绍
        goods_introduce: '',
        attrs: []
      },
      addGoodsRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      catelist: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      manyParamsData: [],
      onlyParamsData: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewUrl: '',
      previewVisible: false,
      manyParamsDataAttrs: [],
      onlyParamsDataAttrs: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败！')
      }
      this.catelist = res.data
      // console.log(this.catelist)
    },
    handleChange() {
      // console.log(this.addGoodsForm.goods_cat)
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // 阻止return false就是阻止标签页切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async tabClick() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败！')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyParamsData = res.data
        this.manyParamsData.forEach(item => {
          const manyattr = {}
          manyattr.attr_id = item.attr_id
          manyattr.attr_value = item.attr_vals.join(',')
          this.manyParamsDataAttrs.push(manyattr)
        })
      }
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取属性失败！')
        }
        this.onlyParamsData = res.data
        this.onlyParamsData.forEach(item => {
          const onlyattr = {}
          onlyattr.attr_id = item.attr_id
          onlyattr.attr_value = item.attr_vals
          this.onlyParamsDataAttrs.push(onlyattr)
        })
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      // console.log(file)
      this.previewUrl = file.url
      // console.log(this.previewUrl)
      this.previewVisible = true
    },
    // 处理图片移除之后的操作
    handleRemove(file) {
      // console.log(file)
      const filePath = file.response.data.tmp_path
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      this.addGoodsForm.pics.splice(i, 1)
      // console.log(this.addGoodsForm)
    },
    // 图片上传成功后的操作
    handleSuccess(response) {
      // console.log(response)
      const pathObj = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(pathObj)
      // console.log(this.addGoodsForm)
    },
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async vaild => {
        if (!vaild) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 验证成功的操作
        // lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addGoodsForm)
        // this.addGoodsForm.goods_price = this.addGoodsForm.goods_price - 0
        // this.addGoodsForm.goods_number = this.addGoodsForm.goods_number - 0
        // this.addGoodsForm.goods_weight = this.addGoodsForm.goods_weight - 0
        form.goods_cat = form.goods_cat.join(',')
        form.attrs = [...this.manyParamsDataAttrs, ...this.onlyParamsDataAttrs]
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.previewImg{
  width: 100%;
}
.addGoods{
  margin-top: 20px;
}
</style>
