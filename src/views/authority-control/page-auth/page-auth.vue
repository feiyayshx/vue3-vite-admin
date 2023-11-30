<template>
  <div>页面权限: {{ currentDate }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
onMounted(() => {
  init()
})
const currentDate = ref(null)
const init = () => {
  let date = new Date()
  currentDate.value = date.toLocaleTimeString()
}
</script>

<style lang="scss" scoped></style>
