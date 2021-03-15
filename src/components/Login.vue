<template>
<div class="login-container">
<div class="login-box">
    <div class="avatar-box">
      <img src="../assets/logo.png" alt="">
    </div>
    <el-form ref="loginFormRef" label-width="0px" class="login-form" :model="LoginForm" :rules='rules'>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input prefix-icon="el-icon-user-solid" v-model="LoginForm.username"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input  prefix-icon="el-icon-lock"  v-model="LoginForm.password" type="password" ></el-input>
      </el-form-item>
      <el-form-item class="login-btn">
        <el-button type="primary" @click="login" >登陆</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
</div>
</div>
</template>

<script>
export default {
  data () {
    return {
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [{ required: true, message: '请输入登陆名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }],
        password: [{ min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    resetForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // 解构赋值
        const { data: res } = await this.$http.post('login', this.LoginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登陆失败')
        this.$message.success('登陆成功')
        // console.log(res)
        // 1.将登陆成功后的token值保存在sessionStorage中，因为只有网站打开是才会生效
        window.sessionStorage.setItem('token', res.data.token)
        // 2.通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
  height: 100%;
  background-color: #2b4b6b;
}
.login-box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  border-radius: 3px;
}
.avatar-box{
  width: 130px;
  height: 130px;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login-form{
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 0 20px;
    box-sizing: border-box;
    .login-btn{
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
