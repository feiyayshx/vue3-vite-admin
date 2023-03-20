<template>
  <el-container class="el-container_wrapper">
    <el-header>
      <layout-header />
    </el-header>
    <el-container>
      <el-aside width="208px">
        <layout-nav />
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import LayoutHeader from './layout-header.vue';
import LayoutNav from './layout-nav.vue';

</script>

<style lang="scss" scoped>
.el-container_wrapper {
  height: 100%;
}
</style>
