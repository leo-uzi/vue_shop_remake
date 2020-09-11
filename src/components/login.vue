<template>
  <div class="container">
    <div class="box-container">
      <div class="box_img">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--      表单组件-->
      <el-form label-width="0px" :rules="formRules" :model="rulesForm" ref="formRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-yonghu" v-model="rulesForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-mima" v-model="rulesForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button type="info" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 表单数据绑定
      rulesForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 58个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单重置
    handleReset () {
      this.$refs.formRef.resetFields()
    },
    // 登录事件
    handleLogin () {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.rulesForm)
        if (res.meta.status !== 200) return this.$message.error('用户名或密码错误')
        this.$message.success('登陆成功！')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.container{
  height: 100%;
  background-color: #2b4b6b;
  .box-container{
    background-color: #fff;
    width: 450px;
    height: 300px;
    border-radius: 8px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .box_img{
      position: absolute;
      left: 50%;
      top: -50%;
      transform: translate(-50%,50%);
      width: 130px;
      height: 130px;
      border-radius: 50%;
      border: solid 1px #f5f5f5;
      padding: 12px;
      background-color: #fff;
      box-shadow: 0px 4px 6px 2px #eeeeee;
      img{
        width: 100%;
        border-radius: 50%;
        border: 1px solid #f5f5f5 ;
        background-color: #f5f5f5;
      }
    }
    .el-form{
      width: 90%;
      position: absolute;
      bottom: -10px;
      padding: 20px;
      .btn{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
