<template>
  <el-aside :width="userStore.isCollapse ? 'auto' : '208px'">
    <el-scrollbar max-height="100%" view-class="menu-scroll-view">
      <el-menu
        class="menu-ul"
        :default-active="defaultActive"
        :collapse="userStore.isCollapse"
        router
        @select="onMenuSelect"
      >
        <MenuItem v-for="menu in menuList" :key="menu.id" :menu-info="menu" />
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import MenuItem from './menu-item.vue'
import userApi from '@/apis/user.js'
import { useUserStore } from '@/store/index.js'
const userStore = useUserStore()
const route = useRoute()
// 默认选中的菜单项
const defaultActive = ref('')
let menuList = ref([])
// 初始化数据
const initData = () => {
  defaultActive.value = route.path
}
initData()

// 获取菜单
const getMenuList = async () => {
  let res = await userApi.queryUserInfo()
  console.log(res, 'res')
  menuList.value = res || []
}
getMenuList()

const onMenuSelect = (params) => {
  console.log(params, 'params')
}
</script>

<style lang="scss">
// .menu-scroll-view,
// .menu-ul {
//   height: 100%;
// }
</style>
