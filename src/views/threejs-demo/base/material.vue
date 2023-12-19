<!-- 材质 -->
<template>
  <canvas ref="materialCanvas" class="w-full h-[300px]"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import * as THREE from 'three'
// import { resizeRendererToDisplaySize } from '../utils'

onMounted(() => {
  // createScene()
})
const materialCanvas = ref(null)
</script>
