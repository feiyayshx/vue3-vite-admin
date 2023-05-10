<template>
  <el-scrollbar height="100%">
    <el-menu default-active="1">
      <el-menu-item index="1">
        <el-icon><House /></el-icon>
          <span>首页</span>
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统管理</span>
        </template>  
        <el-menu-item index="2-1">菜单</el-menu-item>
        <el-menu-item index="2-2">角色</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { House,Setting } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>

</style>
