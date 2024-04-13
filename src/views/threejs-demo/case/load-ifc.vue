<template>
  <div class="h-auto">
    <div>
      <canvas class="w-full h-[600px]" ref="containerRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { updateAspect } from '../utils'
import { IFCLoader } from 'web-ifc-three/IFCLoader'
import { IFCSPACE } from 'web-ifc'
const containerRef = ref(null)
const createScene = async () => {
  if (!containerRef.value) return
  // 场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x8cc7de)
  // 摄像机
  const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000)
  camera.position.z = -70
  camera.position.y = 25
  camera.position.x = 90
  // 渲染器
  const renderer = new THREE.WebGLRenderer({ canvas: containerRef.value, anitialias: true })
  // 更新相机参数
  updateAspect(renderer, camera)
  // 轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  // controls.update()
  controls.enablePan = false // 禁用摄像机平移
  controls.enableDamping = true // 启用阻尼惯性
  // 创建物体
  const geometry = new THREE.BoxGeometry() // 几何体
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff }) // 材质
  const cube = new THREE.Mesh(geometry, material) // 物体
  scene.add(cube)

  //Lights
  const directionalLight1 = new THREE.DirectionalLight(0xffeeff, 2.5)
  directionalLight1.position.set(1, 1, 1)
  scene.add(directionalLight1)

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.5)
  directionalLight2.position.set(-1, 0.5, -1)
  scene.add(directionalLight2)

  const ambientLight = new THREE.AmbientLight(0xffffee, 0.75)
  scene.add(ambientLight)

  const ifcLoader = new IFCLoader()
  await ifcLoader.ifcManager.setWasmPath('/models/', true)

  await ifcLoader.ifcManager.parser.setupOptionalCategories({
    [IFCSPACE]: false
  })

  await ifcLoader.ifcManager.applyWebIfcConfig({
    USE_FAST_BOOLS: true
  })

  ifcLoader.load('/models/ifc/rac_advanced_sample_project.ifc', function (model) {
    console.log(model, 'model')
    // scene.add(model.mesh)
    // render()
  })

  const render = () => {
    // controls.update()
    renderer.render(scene, camera)
  }
  render()

  controls.addEventListener('change', render)
  window.addEventListener('resize', () => {
    updateAspect(renderer, camera)
    render()
  })
}

onMounted(() => {
  createScene()
})
</script>
<style lang="scss">
// .lil-gui.autoPlace {
//   top: 60%;
//   right: 30%;
// }

// .fbx-bg {
//   background: linear-gradient(#635c66, #51433c);
// }
</style>
