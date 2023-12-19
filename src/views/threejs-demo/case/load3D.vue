<template>
  <canvas class="w-[50%] h-[100%]" ref="canvasRef" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

import { updateAspect } from '../utils'
onMounted(() => {
  create3d()
})

const canvasRef = ref(null)

const create3d = () => {
  // 场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xbfe3dd)
  // 相机
  const camera = new THREE.PerspectiveCamera(40, 2, 1, 100)
  // camera.position.z = 5
  camera.position.set(5, 2, 8)
  // 渲染器
  const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, anitialias: true })
  // 更新相机参数
  updateAspect(renderer, camera)

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/node_modules/three/examples/jsm/libs/draco/gltf/')

  // 3d模型加载器
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)

  // 加载3d模型
  loader.load(
    '/models/LittlestTokyo.glb',
    (gltf) => {
      const model = gltf.scene
      model.position.set(1, 1, 0)
      model.scale.set(0.01, 0.01, 0.01)
      scene.add(model)
      animate()
    },
    undefined,
    (error) => {
      console.log(error)
    }
  )

  const animate = () => {
    // requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
}
</script>
