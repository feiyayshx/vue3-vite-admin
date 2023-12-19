<template>
  <div class="h-full bg-white p-[16px]">
    <div class="grid grid-cols-4 gap-2">
      <!-- 纹理 -->
      <Texture />
      <!-- 立方体场景 -->
      <canvas class="w-full h-[300px]" ref="threedemo1"></canvas>
      <!-- 线条 -->
      <canvas class="w-full h-[300px]" ref="threedemo2"></canvas>
      <!-- 场景 -->
      <SunScene />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { resizeRendererToDisplaySize } from './utils'
import SunScene from './base/scene.vue'
import Texture from './base/texture.vue'

onMounted(() => {
  createCube()
  drawLine()
})

/* 创建立方体 */
const threedemo1 = ref(null)
const createCube = () => {
  // 创建场景
  const scene = new THREE.Scene()

  /**
   * @desc 创建透视摄像机
   * 参数1~4分别是：视野角度FOV; 长宽比aspect ratio；近截面near；远截面far
   */
  const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000)
  camera.position.z = 5

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: threedemo1.value,
    antialias: true // 抗锯齿
    // precision: 'mediump'
  })

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  // MeshBasicMaterial不受光照影响改成：MeshPhongMaterial
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  // 光照
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(-1, 2, 6)
  scene.add(light)

  const animate = () => {
    requestAnimationFrame(animate)

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }

  animate()
}

// 线条
const threedemo2 = ref('')
const drawLine = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 4 / 3, 1, 500)
  camera.position.set(0, 0, 100)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer({ canvas: threedemo2.value, antialias: true })
  resizeRendererToDisplaySize(renderer)

  // 定义材质
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 5 })

  // 创建一些顶点
  const points = [
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0)
  ]

  // 创建几何体
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geometry, material)
  scene.add(line)
  renderer.render(scene, camera)
}
</script>
<style lang="scss" scoped></style>
