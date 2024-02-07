<template>
  <div class="h-full">
    <canvas class="w-full h-full" ref="batchedRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { radixSort } from 'three/addons/utils/SortUtils.js'

import { updateAspect } from '../utils'

// 渲染容器的dom
const batchedRef = ref(null)

let scene, camera, renderer, controls

let geometries, material, mesh

let ids = []

const api = {
  method: 'BATCHED',
  count: 256,
  dynamic: 16,

  sortObjects: true,
  perObjectFrustumCulled: true,
  opacity: 1,
  useCustomSort: true
}

const matrix = new THREE.Matrix4()

// 向量
const position = new THREE.Vector3()
// 欧拉角
const rotation = new THREE.Euler()
// 四元数
const quaternion = new THREE.Quaternion()

const scale = new THREE.Vector3()

const init = () => {
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  // 相机
  camera = new THREE.PerspectiveCamera(70, 2, 1, 100)
  camera.position.z = 30

  // 渲染器
  renderer = new THREE.WebGLRenderer({ canvas: batchedRef.value, antialias: true })
  updateAspect(renderer, camera)
  // 控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.autoRotate = true
  controls.autoRotateSpeed = 1.0

  window.addEventListener('resize', () => {
    updateAspect(renderer, camera)
  })
}
// 创建几何体
const initGeometries = () => {
  geometries = [
    new THREE.ConeGeometry(1.0, 2.0),
    new THREE.BoxGeometry(2.0, 2.0, 2.0),
    new THREE.SphereGeometry(1.0, 16.0, 8.0)
  ]
}
// 创建物体
// const initMesh = () => {}

// 创建材质
const createMaterial = () => {
  if (!material) {
    material = new THREE.MeshNormalMaterial()
  }
  return material
}

// 创建变换矩阵matrix
const randomizeMatrix = (matrix) => {
  position.x = Math.random() * 40 - 20
  position.y = Math.random() * 40 - 20
  position.z = Math.random() * 40 - 20

  rotation.x = Math.random() * 2 * Math.PI
  rotation.y = Math.random() * 2 * Math.PI
  rotation.z = Math.random() * 2 * Math.PI

  // 由欧拉角得到四元数
  quaternion.setFromEuler(rotation)
  scale.x = scale.y = scale.z = 0.5 + Math.random() * 0.5

  return matrix.compose(position, quaternion, scale)
}

function randomizeRotationSpeed(rotation) {
  rotation.x = Math.random() * 0.01
  rotation.y = Math.random() * 0.01
  rotation.z = Math.random() * 0.01
  return rotation
}

const initBatchedMesh = () => {
  const geometryCount = api.count
  const vertexCount = api.count * 512
  const indexCount = api.count * 1024
  const material = createMaterial()

  const euler = new THREE.Euler()
  const matrix = new THREE.Matrix4()
  mesh = new THREE.BatchedMesh(geometryCount, vertexCount, indexCount, material)
  mesh.userData.rotationSpeeds = []

  mesh.frustumCulled = false

  for (let i = 0; i < api.count; i++) {
    const id = mesh.addGeometry(geometries[i % geometries.length])
    mesh.setMatrixAt(id, randomizeMatrix(matrix))

    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.makeRotationFromEuler(randomizeRotationSpeed(euler))
    mesh.userData.rotationSpeeds.push(rotationMatrix)

    ids.push(id)
  }

  scene.add(mesh)
}

const animateMeshes = () => {
  const loopNum = Math.min(api.count, api.dynamic)
  for (let i = 0; i < loopNum; i++) {
    const rotationMatrix = mesh.userData.rotationSpeeds[i]
    const id = ids[i]

    mesh.getMatrixAt(id, matrix)
    matrix.multiply(rotationMatrix)
    mesh.setMatrixAt(id, matrix)
  }
}

function sortFunction(list, camera) {
  // initialize options
  this._options = this._options || {
    get: (el) => el.z,
    aux: new Array(this.maxGeometryCount)
  }

  const options = this._options
  options.reversed = this.material.transparent

  // convert depth to unsigned 32 bit range
  const factor = (2 ** 32 - 1) / camera.far // UINT32_MAX / max_depth
  for (let i = 0, l = list.length; i < l; i++) {
    list[i].z *= factor
  }

  // perform a fast-sort using the hybrid radix sort function
  radixSort(list, options)
}

const render = () => {
  mesh.sortObjects = api.sortObjects
  mesh.perObjectFrustumCulled = api.perObjectFrustumCulled
  mesh.setCustomSort(api.useCustomSort ? sortFunction : null)
  renderer.render(scene, camera)
}

const animate = () => {
  requestAnimationFrame(animate)
  animateMeshes()
  controls.update()
  render()
}

onMounted(() => {
  init()
  initGeometries()
  initBatchedMesh()
  animate()
})
</script>
