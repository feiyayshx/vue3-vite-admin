<template>
  <el-container class="lay-container_wrapper">
    <el-header class="lay-header_wrapper" :height="headerHeight">
      <BaseHeader />
    </el-header>
    <el-container class="lay-content_wrapper">
      <el-aside width="208px">
        <BaseMenu />
      </el-aside>
      <el-main class="main-block">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import BaseHeader from './components/base-header.vue'
import BaseMenu from './components/base-menu/index.vue'
import { headerHeight } from '@/styles/js-var.module.scss'
</script>

<style lang="scss" scoped>
.lay-container_wrapper {
  height: 100vh;

  .lay-header_wrapper {
    background: #001529;
  }

  .lay-content_wrapper {
    height: calc(100vh - 48px);
  }

  .main-block {
    // overflow: hidden;
    height: 100%;
    background-color: $background-base;
  }
}
</style>
