<template>
  <div class="h-full grid grid-cols-2 grid-rows-2">
    <div ref="containerRef" class="relative">
      <div class="absolute left-[12%] top-[10px] text-black">gltf</div>
      <canvas class="w-full h-full" ref="canvasRef" />
    </div>
    <div>
      <canvas class="w-full h-full" ref="canvasVillageRef"></canvas>
    </div>
    <div>
      <canvas class="fbx-bg w-full h-full" ref="canvasFbxRef"></canvas>
    </div>
    <div>demo4</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCreateGltf3d, useCreateFbx3d, useCreateGltfVillage } from './model-3d'

const { containerRef, canvasRef, createGltf3d } = useCreateGltf3d()
const { canvasFbxRef, createFbx3d } = useCreateFbx3d()
// const { canvasDancingRef, createFbxDancing } = useCreateFbxDancing()
const { canvasVillageRef, createGltfVillage } = useCreateGltfVillage()
onMounted(() => {
  // gltf格式模型
  createGltf3d()
  createFbx3d()
  createGltfVillage()
})
</script>
<style lang="scss">
.lil-gui.autoPlace {
  top: 200px;
  right: 50%;
}

.fbx-bg {
  background: linear-gradient(#635c66, #51433c);
}
</style>
