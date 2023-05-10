<template>
  <el-container class="el-container_wrapper">
    <el-header class="el-header_wrapper" :height="headerHeight">
      <layout-header  />
    </el-header>
    <el-container>
      <el-aside width="208px">
        <layout-nav />
      </el-aside>
      <el-main class="main-block">Main</el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import LayoutHeader from './layout-header.vue';
import LayoutNav from './layout-nav.vue';
import {headerHeight} from '@/styles/js-var.module.scss'
</script>

<style lang="scss" scoped>
.el-container_wrapper {
  height: 100%;
  .el-header_wrapper {
    background:#001529;
  }
  .main-block {
    background-color: $background-base;
    height: calc(100vh - 48px);
    overflow-y: auto;
  }
}
</style>
