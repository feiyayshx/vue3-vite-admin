<template>
  <div class="h-auto grid grid-cols-2 grid-rows-3">
    <div>
      <canvas class="w-full h-[400px]" ref="meetingPlaceRef"></canvas>
    </div>
    <div>
      <canvas class="fbx-bg w-full h-[400px]" ref="roomPlaceRef"></canvas>
    </div>
    <div>
      <canvas class="w-full h-[400px]" ref="computerRef"></canvas>
    </div>
    <!-- <div>
      <canvas class="w-full h-full" ref="villageRef"></canvas>
    </div>
    <div ref="containerRef" class="relative">
      <div class="absolute left-[12%] top-[10px] text-black">gltf</div>
      <canvas class="w-full h-full" ref="smallTownRef" />
    </div> -->
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import {
  useCreateMeetingplace,
  useCreateRoomplace,
  useCreateComputer
  // useCreateGltfSmallTown,
  // useCreateGltfVillage
} from './model-3d'
const { meetingPlaceRef, createMeetingplace } = useCreateMeetingplace()
const { roomPlaceRef, createRoomplace } = useCreateRoomplace()
const { computerRef, createComputer } = useCreateComputer()
// const { containerRef, smallTownRef, createSmallTown } = useCreateGltfSmallTown()
// const { villageRef, createVillage } = useCreateGltfVillage()
onMounted(() => {
  createMeetingplace()
  createRoomplace()
  createComputer()
  // createSmallTown()
  // createVillage()
})
</script>
<style lang="scss">
.lil-gui.autoPlace {
  top: 60%;
  right: 30%;
}

.fbx-bg {
  background: linear-gradient(#635c66, #51433c);
}
</style>
