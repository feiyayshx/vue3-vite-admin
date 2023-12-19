<template>
  <canvas ref="textureRef" class="w-full h-[300px]"></canvas>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { resizeRendererToDisplaySize } from '../utils'
import textureImg from '@/assets/texture-img.png'

onMounted(() => {
  createTexture()
})
const textureRef = ref(null)

// 加载纹理
const loadTexture = (loader, path) => {
  const texture = loader.load(path, (texture) => {
    console.log(texture, '纹理加载完成')
  })
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// 使用纹理
const createTexture = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, 2, 1, 1000)
  camera.position.z = 4

  const renderer = new THREE.WebGLRenderer({ canvas: textureRef.value, antialias: true })

  // 等待所有纹理加载完成
  // const loadManager = new THREE.LoadingManager()
  // loadManager.onLoad = () => {
  //   const boxs = new THREE.Mesh(geometry,materials)
  //   scene.add(boxs)
  // }
  // loadingManager.onProgess = () => {}

  // 创建纹理加载器
  const loader = new THREE.TextureLoader() // THREE.TextureLoader(loadManager)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const meterial = new THREE.MeshBasicMaterial({ map: loadTexture(loader, textureImg) })
  const boxMesh = new THREE.Mesh(geometry, meterial)
  scene.add(boxMesh)

  const animate = () => {
    boxMesh.rotation.x += 0.01
    boxMesh.rotation.y += 0.01
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()
}
</script>
