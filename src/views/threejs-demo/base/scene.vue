<!-- 场景图 -->
<template>
  <canvas ref="sceneCanvas" class="w-full h-[300px]"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { resizeRendererToDisplaySize } from '../utils'

onMounted(() => {
  createScene()
})
const sceneCanvas = ref(null)

// 创建球几何体
const createSphere = (r, wSegments, hSegments) => {
  let radius = r || 2
  let widthSegments = wSegments || 6
  let heightSegments = hSegments || 6
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments)
}

// 创建太阳
const createSun = (sphereGeometry) => {
  const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 })
  let sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
  sunMesh.scale.set(4, 4, 4) // 放大5倍
  return sunMesh
}

// 创建地球
const createEarth = (sphereGeometry) => {
  const material = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0xabcdef
  })
  let earthMesh = new THREE.Mesh(sphereGeometry, material)
  // earthMesh.position.x = 10
  return earthMesh
}

// 创建月球
const createMoon = (sphereGeometry) => {
  const material = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222
  })
  let moonMesh = new THREE.Mesh(sphereGeometry, material)
  // earthMesh.position.x = 10
  moonMesh.scale.set(0.5, 0.5, 0.5)
  return moonMesh
}

// 创建场景
const createScene = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 2, 1, 1000)
  camera.position.set(0, 50, 0)
  camera.up.set(0, 0, 1)
  camera.lookAt(0, 0, 0)
  const renderer = new THREE.WebGLRenderer({ canvas: sceneCanvas.value, antialias: true })

  // 更新旋转角度的对象数组
  const objects = []

  // 添加空的太阳系场景图节点
  const solarSystem = new THREE.Object3D()
  scene.add(solarSystem)
  objects.push(solarSystem)

  // 创建球体
  const sphereGeometry = createSphere()
  // 创建太阳
  const sunMesh = createSun(sphereGeometry)
  solarSystem.add(sunMesh)
  objects.push(sunMesh)

  // 创建空的地球系场景图节点
  const earchSystem = new THREE.Object3D()
  earchSystem.position.x = 15
  solarSystem.add(earchSystem)
  objects.push(earchSystem)

  // 创建地球
  const earthMesh = createEarth(sphereGeometry)
  earchSystem.add(earthMesh)
  objects.push(earthMesh)

  // 创建空的月球系场景图
  const moonSystem = new THREE.Object3D()
  moonSystem.position.x = 4
  earchSystem.add(moonSystem)

  // 创建月球
  const moonMesh = createMoon(sphereGeometry)
  moonSystem.add(moonMesh)
  objects.push(moonMesh)

  // 添加点光源
  const light = new THREE.PointLight(0xffffff, 3)
  scene.add(light)

  const animate = () => {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    objects.forEach((obj) => {
      // 添加x,y,z轴
      const axes = new THREE.AxesHelper()
      axes.material.depthTest = false
      axes.renderOrder = 1
      obj.add(axes)
      obj.rotation.y += 0.01
    })
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()
}
</script>
