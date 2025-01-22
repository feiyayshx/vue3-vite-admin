<template>
  <div>
    dashboard
    <el-button type="primary">添加数据</el-button>
    <el-button type="primary">修改数据</el-button>
    <el-button type="primary">删除数据</el-button>
  </div>
</template>

<script setup>
import DataBase from '@/utils/indexed-db/db.js'

const init = () => {
  DataBase.initDB(1)
}
init()
</script>

<style lang="scss" scoped></style>
