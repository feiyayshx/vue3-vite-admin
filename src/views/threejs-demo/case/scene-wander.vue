<template>
  <div class="h-full">
    <canvas class="w-full h-full" ref="wanderRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'

import { updateAspect } from '../utils'
// import { createBase3D } from './model-3d'

onMounted(() => {
  createWander()
})

// const getTexturesFromAtlasFile = (atlasImgUrl, tilesNum) => {
//   const textures = []

//   for (let i = 0; i < tilesNum; i++) {
//     textures[i] = new THREE.Texture()
//   }

//   new THREE.ImageLoader().load(atlasImgUrl, (image) => {
//     console.log(image, 'image')
//     let canvas, context
//     const tileWidth = image.height

//     for (let i = 0; i < textures.length; i++) {
//       canvas = document.createElement('canvas')
//       context = canvas.getContext('2d')
//       canvas.height = tileWidth
//       canvas.width = tileWidth
//       context.drawImage(image, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth)
//       textures[i].colorSpace = THREE.SRGBColorSpace
//       textures[i].image = canvas
//       textures[i].needsUpdate = true
//     }
//   })

//   return textures
// }

const useCreateSceneWander = () => {
  const wanderRef = ref(null)
  let scene = null
  let camera = null
  let controls = null
  let renderer = null

  // 方案1-全景图-立方体贴图
  // const createWander = () => {
  //   scene = new THREE.Scene()
  //   renderer = new THREE.WebGLRenderer({ canvas: wanderRef.value, anitialias: true })
  //   camera = new THREE.PerspectiveCamera(90, 2, 0.1, 100)
  //   camera.position.z = 0.01
  //   updateAspect(renderer, camera)
  //   window.addEventListener('resize', () => {
  //     updateAspect(renderer, camera)
  //   })

  //   controls = new OrbitControls(camera, renderer.domElement)
  //   controls.enablePan = false // 禁用平移
  //   controls.enableZoom = false // 禁用缩放
  //   controls.enableDamping = true // 启用阻尼
  //   controls.rotateSpeed = -0.25

  //   const textures = getTexturesFromAtlasFile('/models/panorama/sun_temple_stripe.jpg', 6)

  //   const materials = []

  //   for (let i = 0; i < 6; i++) {
  //     materials.push(new THREE.MeshBasicMaterial({ map: textures[i] }))
  //   }

  //   const skyBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials)
  //   skyBox.geometry.scale(1, 1, -1)
  //   scene.add(skyBox)

  //   animate()
  // }

  // 方案2-全景图-等距矩形
  const createWander = () => {
    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ canvas: wanderRef.value, anitialias: true })
    camera = new THREE.PerspectiveCamera(90, 2, 0.1, 1000)
    camera.position.z = 2
    updateAspect(renderer, camera)
    window.addEventListener('resize', () => {
      updateAspect(renderer, camera)
    })

    controls = new OrbitControls(camera, renderer.domElement)
    controls.autoRotate = false
    // controls.autoRotateSpeed = 3
    controls.enablePan = true // 平移
    controls.enableZoom = true // 缩放
    controls.enableDamping = false // 启用阻尼
    controls.rotateSpeed = -0.25

    // const loader = new THREE.TextureLoader() // 加载jpg,png格式的图片
    const loader = new EXRLoader() // 加载exr格式图像
    // 将等距矩形图片加载为纹理-HDRI高动态范围图像
    const texture = loader.load('/models/panorama/venice_sunset_4k.exr', () => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      // texture.colorSpace = THREE.SRGBColorSpace
      scene.background = texture
      // scene.environment = texture
    })

    animate()
  }

  const animate = () => {
    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)
  }

  return { wanderRef, createWander }
}

const { wanderRef, createWander } = useCreateSceneWander()
</script>
<style lang="scss"></style>
