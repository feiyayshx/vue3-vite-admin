<template>
  <div>
    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const defaultProps = {
  children: 'subList',
  label: 'name'
}
const treeData = ref([
  {
    id: '1',
    name: '功能实现',
    subList: [
      {
        menuId: '11',
        name: '虚拟列表',
        parentId: '1',
        icon: ''
      }
    ]
  },
  {
    id: '2',
    name: '权限控制',
    subList: [
      {
        menuId: '21',
        name: '页面',
        parentId: '2',
        icon: ''
      },
      {
        menuId: '22',
        name: '按钮',
        parentId: '2',
        icon: ''
      }
    ]
  }
])

const handleNodeClick = () => {}
</script>

<style lang="scss" scoped></style>
