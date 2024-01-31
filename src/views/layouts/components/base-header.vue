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
      <el-icon class="mr-[8px] cursor-pointer" color="#ffffff" @click="toggle"
        ><FullScreen
      /></el-icon>
      <!-- 设置 -->
      <el-icon class="mr-[8px] cursor-pointer" color="#ffffff"><Setting /></el-icon>
      <!-- 用户名下拉 -->
      <el-dropdown trigger="click">
        <span class="flex items-center">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="ml-[8px] text-white"> admin </span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onExit"> 退出系统 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/index.js'
import { useFullscreen } from '@vueuse/core'
const { menu, setCollapse, onExit } = useUserStore()

// 设置菜单折叠状态
const setMenuCollapse = () => {
  setCollapse(!menu.isCollapse)
}

/** isFullscreen, enter, exit,  */
const { toggle } = useFullscreen()
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
