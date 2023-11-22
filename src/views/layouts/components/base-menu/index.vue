<template>
  <el-aside class="aside-wrapper" :width="userStore.isCollapse ? 'auto' : '208px'">
    <el-scrollbar max-height="100%" view-class="menu-scroll-view">
      <el-menu
        class="menu-ul"
        :default-active="defaultActive"
        background-color="#ffffff"
        :collapse="userStore.isCollapse"
        router
        @select="onMenuSelect"
      >
        <MenuItem v-for="menu in userStore.menuList" :key="menu.id" :menu-info="menu" />
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import MenuItem from './menu-item.vue'
import { useUserStore } from '@/store/index.js'
const userStore = useUserStore()
const route = useRoute()

// 默认选中的菜单项
const defaultActive = ref('')
// 初始化数据
const initData = () => {
  // 设置默认选中的菜单
  defaultActive.value = route.path
  // 请求菜单数据
  userStore.getMenuList()
}
initData()

const onMenuSelect = (index, item) => {
  console.log(index, 'index')
  console.log(item, 'item')
}
</script>

<style lang="scss">
.menu-ul {
  border-right: 0;
}

.aside-wrapper {
  border-right: 1px solid $dark-border;
  background: $basic-white;
}
</style>
