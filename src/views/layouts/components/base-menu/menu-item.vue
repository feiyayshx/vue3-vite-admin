<template>
  <el-sub-menu v-if="menuInfo.children && menuInfo.children.length > 0" :index="menuInfo.path">
    <template #title>
      <el-icon v-if="menuInfo.icon"><component :is="menuInfo.icon" /></el-icon>
      <span>{{ menuInfo.name }}</span>
    </template>
    <MenuItem v-for="menu in menuInfo.children" :key="menu.id" :menu-info="menu"></MenuItem>
  </el-sub-menu>
  <el-menu-item v-else :index="menuInfo.path">
    <el-icon v-if="menuInfo.icon"><component :is="menuInfo.icon" /></el-icon>
    <span>{{ menuInfo.name }}</span>
  </el-menu-item>
</template>
<script setup>
import { defineAsyncComponent } from 'vue'
defineProps({
  // 菜单项数据
  menuInfo: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const MenuItem = defineAsyncComponent({
  loader: () => import('@/views/layouts/components/base-menu/menu-item.vue')
})
</script>
