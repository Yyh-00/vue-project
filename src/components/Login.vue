<template>
<div class="login-container">
<div class="login-box">
    <div class="avatar-box">
      <img src="../assets/logo.png" alt="">
    </div>
    <el-form  label-width="0px" class="login-form">
      <!-- 用户名 -->
      <el-form-item >
        <el-input prefix-icon="iconfont icon-user" ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item >
        <el-input ></el-input>
      </el-form-item>
      <el-form-item class="login-btn">
        <el-button type="primary" >登陆</el-button>
        <el-button type="info">重置</el-button>
      </el-form-item>
    </el-form>
</div>
</div>
</template>

<script>
export default {

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
