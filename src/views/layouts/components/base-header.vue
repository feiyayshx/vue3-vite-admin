<template>
  <div class="header-wrapper">
    <div class="header-left-block">
      <img src="/vite.svg" class="header-logo" />
      <span class="header-title">system admin</span>
      <el-icon class="expand-icon" size="20" color="#fff" @click="setMenuCollapse">
        <Expand v-if="menu.isCollapse" />
        <Fold v-else />
      </el-icon>
    </div>
    <div class="header-right-block">
      <!-- 用户名下拉 -->
      <el-dropdown>
        <span>
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          用户名
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item> 退出 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 设置 -->
      <div>
        <el-icon><Setting /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/index.js'
const { menu, setCollapse } = useUserStore()
// 设置菜单折叠状态
const setMenuCollapse = () => {
  setCollapse(!menu.isCollapse)
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
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    flex: 1;
  }
}
</style>
