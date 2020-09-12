<template>
 <div class="container">
<!--   面包屑导航-->
   <el-breadcrumb separator="/">
     <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>>用户管理</el-breadcrumb-item>
     <el-breadcrumb-item>用户列表</el-breadcrumb-item>
   </el-breadcrumb>
<!--   卡片视图-->
   <el-card>
<!--     搜索框-->
     <el-row :gutter="25">
       <el-col :span="7">
         <el-input placeholder="请输入用户ID" v-model="param.query">
           <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
         </el-input>
       </el-col>
<!--       添加用户按钮-->
       <el-col :span="2">
          <el-button type="primary" @click="handleAddUser">添加用户</el-button>
       </el-col>
     </el-row>
     <el-row>
<!--       表格组件-->
       <el-table
         :data="userList"
         border
         style="width: 100%">
         <el-table-column
           type="index"
          label="#">
         </el-table-column>
         <el-table-column
           prop="username"
           label="姓名">
         </el-table-column>
         <el-table-column
           prop="email"
           label="邮箱">
         </el-table-column>
         <el-table-column
           prop="mobile"
           label="电话">
         </el-table-column>
         <el-table-column
           prop="role_name"
           label="角色">
         </el-table-column>
         <el-table-column
           prop="mg_state"
           label="状态">
<!--           作用域插槽-->
           <template v-slot="scope">
<!--             开关组件-->
             <el-switch
               v-model="scope.row.mg_state"
               active-color="#409eff"
               inactive-color="#dcdfe6"
             @change="handleSwitch(scope.row)">
             </el-switch>
           </template>
         </el-table-column>
         <el-table-column
           label="操作"
         width="200px">
           <template v-slot="scope">
             <el-tooltip effect="dark" content="编辑角色" placement="top" :enterable="false" :hide-after="second">
               <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)"></el-button>
             </el-tooltip>
             <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false" :hide-after="second">
               <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)"></el-button>
             </el-tooltip>
             <el-tooltip effect="dark" content="设置角色" placement="top" :enterable="false" :hide-after="second">
               <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
             </el-tooltip>
           </template>
         </el-table-column>
       </el-table>
     </el-row>
     <el-row>
<!--       分页器-->
       <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="param.pagenum"
         :page-sizes="[1, 3, 5, 10]"
         :page-size="param.pagesize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
       </el-pagination>
     </el-row>
<!--     添加用户对话框-->
     <el-dialog
       title="添加用户"
       :visible.sync="addUerDialogVisible"
       width="40%" @close="addUserDialogClose">
<!--       form表单-->
       <el-form :model="addUserForm" :rules="addUserRules" ref="addUserRef" label-width="100px">
         <el-form-item label="用户名" prop="username">
           <el-input v-model="addUserForm.username"></el-input>
         </el-form-item>
         <el-form-item label="密码" prop="password">
           <el-input v-model="addUserForm.password" type="password"></el-input>
         </el-form-item>
         <el-form-item label="邮箱" prop="email">
           <el-input v-model="addUserForm.email"></el-input>
         </el-form-item>
         <el-form-item label="手机" prop="mobile">
           <el-input v-model="addUserForm.mobile"></el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="addUerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
       </span>
     </el-dialog>
<!--     角色编辑对话框-->
     <el-dialog
       title="用户修改"
       :visible.sync="userEditDialogVisible"
       width="40%" @close="handleUserEditClose">
       <el-form :model="userEditForm" :rules="userEditRules" ref="userEditRef" label-width="100px">
         <el-form-item label="用户名">
           <el-input v-model="userEditForm.username" disabled ></el-input>
         </el-form-item>
         <el-form-item label="邮箱" prop="email">
           <el-input v-model="userEditForm.email"></el-input>
         </el-form-item>
         <el-form-item label="手机" prop="mobile">
           <el-input v-model="userEditForm.mobile"></el-input>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="userEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditCommit">确 定</el-button>
       </span>
     </el-dialog>
   </el-card>
 </div>
</template>

<script>
export default {
  data () {
    const validEmail = (rule, value, callback) => {
      const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!emailReg.test(value)) return callback(new Error('输入邮箱格式错误'))
      callback()
    }
    const validMobile = (rule, value, callback) => {
      const mobileReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (!mobileReg.test(value)) return callback(new Error('输入手机格式有误'))
      callback()
    }
    return {
      param: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      userList: [],
      addUerDialogVisible: false,
      userEditDialogVisible: false,
      // 添加用户对话框表单内容数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用户修改对话框表单内容数据
      userEditForm: {
        username: '',
        email: '',
        mobile: ''
      },
      second: 2,
      // 添加用户表单验证规则对象
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ]
      },
      // 编辑角色信息表单验证规则对象
      userEditRules: {
        email: [
          { required: false, message: '请输入邮箱', trigger: 'blur' },
          { validator: validEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '请输入手机', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ]
      }
    }
  },
  // 生命周期函数
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.param })
      if (res.meta.status !== 200) return this.$message.error('获取用户数据列表失败')
      // console.log(res)
      this.total = res.data.total
      this.userList = res.data.users
    },
    // 设置用户状态
    async handleSwitch (scope) {
      const isSwitch = scope.mg_state
      const { data: res } = await this.$http.put(`users/${scope.id}/state/${isSwitch}`)
      if (res.meta.status !== 200) return this.$message.error('修改用户状态失败')
      this.$message.success('修改用户状态成功')
      this.getUserList()
    },
    // 页面size变化触发
    handleSizeChange (pageSize) {
      this.param.pagesize = pageSize
      this.getUserList()
    },
    // 当前页变化时触发
    handleCurrentChange (currentPage) {
      this.param.pagenum = currentPage
      this.getUserList()
    },
    // 点击触发添加用户dialog
    handleAddUser () {
      this.addUerDialogVisible = true
    },
    // 添加用户dialog关闭时触发
    addUserDialogClose () {
      this.$refs.addUserRef.resetFields()
    },
    // 实现添加用户操作
    addUser () {
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addUerDialogVisible = false
        this.getUserList()
      })
    },
    // 编辑角色弹窗显示
    async handleEdit (scope) {
      const { data: res } = await this.$http.get(`users/${scope.id}`)
      if (res.meta.status !== 200) return this.$message.error('获取角色信息失败')
      this.userEditForm = res.data
      this.userEditForm.id = scope.id
      this.userEditDialogVisible = true
    },
    // 编辑角色弹窗关闭事件
    handleUserEditClose () {
      this.$refs.userEditRef.resetFields()
    },
    // 编辑角色提交操作
    handleEditCommit () {
      this.$refs.userEditRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`users/${this.userEditForm.id}`, this.userEditForm)
        if (res.meta.status !== 200) return this.$message.error('提交角色信息失败')
        this.$message.success('更新角色信息成功')
        this.userEditDialogVisible = false
        this.getUserList()
      })
    },
    // 删除单个用户信息操作
    async handleDelete (scope) {
      const { data: res } = await this.$http.delete(`users/${scope.id}`)
      if (res.meta.status !== 200) return this.$message.error('删除用户操作失败')
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style scoped lang="less">
  .el-breadcrumb{
    margin-bottom: 20px;
  }
  .el-card{
    .el-input{
      margin-bottom: 20px;
    }
  }
  .el-table{
    color: #4b4b4b;
    font-weight: lighter;
    margin-bottom: 20px;
  }
</style>
