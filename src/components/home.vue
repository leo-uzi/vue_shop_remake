<template>
 <div class="container">
   <el-container class="container-box">
     <el-header>
       <div>
         <img src="../assets/logo.png" alt="">
         商城后台系统
       </div>
       <el-button type="info" @click="handleLogout">退出</el-button>
     </el-header>
     <el-container>
       <el-aside :width="isCollapse?'64px':'200px'">
<!--         左侧菜单组件-->
         <el-menu
           :default-active="activePath"
           class="menu"
           background-color="#323744"
           text-color="#fff"
           active-text-color="#396db2"
           :unique-opened="true"
           :collapse="isCollapse"
           :collapse-transition="false"
            router>
           <div class="toggleBtn" @click="handleToggle">
             |||
           </div>
           <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
             <template slot="title">
               <i :class="fontClass[item.id]"></i>
               <span>{{item.authName}}</span>
             </template>
               <el-menu-item :index="'/'+item2.path" v-for="item2 in item.children" :key="item2.id" @click="handleClickMenuitem('/'+item2.path)">
                 <template slot="title">
                   <i class="el-icon-menu"></i>
                   <span>{{item2.authName}}</span>
                 </template>
               </el-menu-item>
           </el-submenu>
         </el-menu>
       </el-aside>
       <el-main>
         <router-view></router-view>
       </el-main>
     </el-container>
   </el-container>
 </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      fontClass: {
        125: 'iconfont icon-yonghuguanli',
        103: 'iconfont icon-quanxianguanli',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-dingdanguanli',
        145: 'iconfont icon-shujutongji'
      },
      // 菜单折叠状态
      isCollapse: false,
      // 激活选中的菜单项的内容
      activePath: ''
    }
  },
  // 页面内容一生成便加载生命周期函数
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 触发退出按钮事件
    handleLogout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取列表数据失败')
      this.menuList = res.data
      // console.log(this.menuList)
    },
    // 左侧菜单栏点击切换显示状态
    handleToggle () {
      this.isCollapse = !this.isCollapse
    },
    // 点击菜单项将路径值保存至storage中
    handleClickMenuitem (path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  }
}
</script>

<style scoped lang="less">
.container{
  height: 100%;
  .container-box{
    height: 100%;
    .el-header{
      background-color: #373c41;
      display: flex;
      padding: 0;
      padding-right: 20px;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      font-size: 20px;
      div{
        display: flex;
        align-items: center;
        img{
          width: 60px;
          height: 60px;
          margin-right: 20px;
        }
      }
      .el-button{
      }
    }
    .el-aside{
      background-color: #323744;
    }
    .el-main{
      font-weight: 700;
      font-size: 24px;
    }
  }
}
.el-menu{
  border: none;
  .toggleBtn{
    background-color: #485166;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 22px;
    height: 22px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-submenu{
    .iconfont{
      font-size: 20px;
      color: #eaeaea;
      margin-right: 20px;
    }
    span{
      font-size: 16px;
    }
    .el-menu-item{
      span{
        font-size: 15px;
      }
    }
  }
}
.el-icon-menu{
  span{
    font-size: 15px;
  }
}
.el-main{
}
</style>
