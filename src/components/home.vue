<template>
 <div>
   <el-button type="info" @click="handleLogout">退出</el-button>
 </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    // 退出事件
    handleLogout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="less">

</style>
