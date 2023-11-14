<template>
  <el-container class="el-container_wrapper">
    <el-header class="el-header_wrapper" :height="headerHeight">
      <BaseHeader  />
    </el-header>
    <el-container>
      <el-aside width="208px">
        <NavBar />
      </el-aside>
      <el-main class="main-block">Main</el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import BaseHeader from './components/base-header.vue';
import NavBar from './components/nav-bar.vue';
import {headerHeight} from '@/styles/js-var.module.scss'
</script>

<style lang="scss" scoped>
.el-container_wrapper {
  height: 100%;

  .el-header_wrapper {
    background:#001529;
  }

  .main-block {
    overflow-y: auto;
    height: calc(100vh - 48px);
    background-color: $background-base;
  }
}
</style>
