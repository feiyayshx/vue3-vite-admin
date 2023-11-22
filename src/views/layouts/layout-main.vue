<template>
  <el-container class="lay-container_wrapper">
    <el-header class="lay-header_wrapper" :height="headerHeight">
      <BaseHeader />
    </el-header>
    <el-container class="lay-content_wrapper">
      <BaseMenu />
      <section class="lay-content-right">
        <BaseTags />
        <el-main class="main-block">
          <router-view></router-view>
        </el-main>
      </section>
    </el-container>
  </el-container>
</template>

<script setup>
import BaseHeader from './components/base-header.vue'
import BaseMenu from './components/base-menu/index.vue'
import BaseTags from './components/base-tags.vue'
import { headerHeight } from '@/styles/js-var.module.scss'
</script>

<style lang="scss" scoped>
.lay-container_wrapper {
  height: 100vh;

  .lay-header_wrapper {
    background: #001529;
  }

  .lay-content_wrapper {
    display: flex;
    height: calc(100vh - 48px);
  }

  .lay-content-right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .main-block {
    background-color: $background-base;
    flex: 1;
  }
}
</style>
