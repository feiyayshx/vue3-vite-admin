<template>
  <div class="header-wrapper">
    <div class="header-left-block">
      <img src="/vite.svg" class="header-logo" />
      <span class="header-title">system admin</span>
      <el-icon class="expand-icon" size="20" color="#fff" @click="setMenuCollapse">
        <Expand v-if="userStore.isCollapse" />
        <Fold v-else />
      </el-icon>
    </div>
    <div class="header-right-block"></div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/index.js'
const userStore = useUserStore()
// 设置菜单折叠状态
const setMenuCollapse = () => {
  userStore.setCollapse(!userStore.isCollapse)
}
</script>

<style lang="scss" scoped>
.header-wrapper {
  height: 100%;

  @include flex($justify: center);

  .header-left-block {
    @include flex($justify: center);

    .header-logo {
      width: 28px;
      height: 28px;
    }

    .header-title {
      color: #ffffff;
    }

    .expand-icon {
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .header-right-block {
    height: 100%;
    flex: 1;
  }
}
</style>
