<template>
  <div class="h-full grid grid-cols-2 grid-rows-2">
    <div ref="containerRef" class="relative">
      <canvas class="fbx-bg w-full h-full" ref="canvasFbxRef"></canvas>
    </div>
    <div>demo2</div>
    <div>demo3</div>
    <div>demo4</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCreateFbx3d } from './model-3d'
const { canvasFbxRef, createFbx3d } = useCreateFbx3d()
onMounted(() => {
  createFbx3d()
})
</script>
<style lang="scss">
.lil-gui.autoPlace {
  top: 15%;
  right: 30%;
}

.fbx-bg {
  background: linear-gradient(#635c66, #51433c);
}
</style>
