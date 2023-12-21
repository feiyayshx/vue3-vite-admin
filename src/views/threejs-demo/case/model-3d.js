import { ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import Stats from 'three/addons/libs/stats.module.js'
import { updateAspect } from '../utils'
/**
 * @desc gltf格式3d模型加载
 * @returns
 */
export const useCreateGltf3d = () => {
  const containerRef = ref(null)
  const canvasRef = ref(null)

  const createGltf3d = () => {
    // 辅助工具-渲染帧率(1秒刷新的次数)
    const stats = new Stats()
    stats.dom.style.position = 'absolute'
    containerRef.value.appendChild(stats.dom)

    // 时钟对象
    const clock = new THREE.Clock()

    let mixer = null

    // 场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xbfe3dd)
    // 相机
    const camera = new THREE.PerspectiveCamera(40, 2, 1, 100)
    camera.position.set(5, 2, 8)

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, anitialias: true })
    // 更新相机参数
    updateAspect(renderer, camera)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.5, 0)
    controls.update()
    controls.enablePan = false // 禁用摄像机平移
    controls.enableDamping = true // 启用阻尼惯性

    // 辐射环境贴图
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer, 0.04)).texture

    // 压缩/解压3d模型
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

        mixer = new THREE.AnimationMixer(model)
        mixer.clipAction(gltf.animations[0]).play()

        animate()
      },
      undefined,
      (error) => {
        console.log(error)
      }
    )

    const animate = () => {
      requestAnimationFrame(animate)

      const delta = clock.getDelta()
      mixer.update(delta)

      controls.update()
      stats.update()
      renderer.render(scene, camera)
    }

    window.addEventListener('resize', () => {
      updateAspect(renderer, camera)
    })
  }

  return { containerRef, canvasRef, createGltf3d }
}

export const useCreateGltfVillage = () => {
  const canvasVillageRef = ref(null)

  const createGltfVillage = () => {
    // 场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xbfe3dd)
    // 相机
    const camera = new THREE.PerspectiveCamera(40, 2, 1, 100)
    camera.position.set(10, 2, 4)

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasVillageRef.value, anitialias: true })
    // 更新相机参数
    updateAspect(renderer, camera)

    // 辅助坐标轴
    const axesHelper = new THREE.AxesHelper(150)
    scene.add(axesHelper)
    const cametaHelper = new THREE.CameraHelper(camera)
    scene.add(cametaHelper)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(2, 0.5, 0)
    controls.update()
    controls.enablePan = false // 禁用摄像机平移
    controls.enableDamping = true // 启用阻尼惯性

    // 辐射环境贴图
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer, 0.04)).texture

    // 3d模型加载器
    const loader = new GLTFLoader()
    // 加载3d模型
    loader.load(
      '/models/village/scene.gltf',
      (gltf) => {
        console.log(gltf, 'gltf')
        const model = gltf.scene
        model.position.set(1, 1, 0)
        model.scale.set(0.1, 0.1, 0.1)
        scene.add(model)
        animate()
      },
      undefined,
      (error) => {
        console.log(error)
      }
    )

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    window.addEventListener('resize', () => {
      updateAspect(renderer, camera)
    })
  }

  return { canvasVillageRef, createGltfVillage }
}

/**
 * @desc 加载fbx模型
 */
export const useCreateFbx3d = () => {
  const canvasFbxRef = ref(null)

  const createFbx3d = () => {
    // 场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xbfe3dd)

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1)
    hemisphereLight.position.set(10, 10, 10)
    scene.add(hemisphereLight)

    // const ambientLight = new THREE.AmbientLight(0x404040)
    // scene.add(ambientLight)

    // const dirLight = new THREE.DirectionalLight(0xffffff, 5)
    // dirLight.position.set(0, 20, 10)
    // // dirLight.castShadow = true
    // dirLight.shadow.camera.top = 180
    // dirLight.shadow.camera.bottom = -100
    // dirLight.shadow.camera.left = -120
    // dirLight.shadow.camera.right = 120
    // scene.add(dirLight)

    // const light = new THREE.PointLight(0xffff00, 2, 100)
    // light.position.set(0, 20, 10)
    // scene.add(light)

    // 相机
    const camera = new THREE.PerspectiveCamera(30, 2, 1, 1000)
    camera.position.set(-6, 1, 0)

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasFbxRef.value })

    // 更新相机参数
    updateAspect(renderer, camera)
    window.addEventListener('resize', () => {
      updateAspect(renderer, camera)
    })

    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(-2, 1, 0)
    controls.update()

    // 辅助坐标轴
    const axesHelper = new THREE.AxesHelper(150)
    scene.add(axesHelper)

    // 辐射环境贴图
    // const pmremGenerator = new THREE.PMREMGenerator(renderer)
    // scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer, 0.04)).texture

    // 加载模型
    const loader = new FBXLoader()

    loader.load('/models/neon-clothing/source/neon_clothing.fbx', (object) => {
      console.log(object, 'object')
      const model = object
      object.traverse(function (child) {
        // console.log(child, 'child')
        if (child.isMesh) {
          // child.material.emissive = new THREE.Color(1, 1, 1)
          // child.material.emissiveIntensity = 1
          // child.material.emissiveMap = child.material.map
          child.castShadow = true
          child.receiveShadow = true
        }
      })
      // model.position.set(0, 0, 0)
      model.scale.set(0.01, 0.01, 0.01)
      scene.add(model)

      animate()
    })

    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
  }

  return { canvasFbxRef, createFbx3d }
}

export const useCreateFbxDancing = () => {
  const canvasDancingRef = ref(null)
  const createFbxDancing = () => {
    // 场景
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xa0a0a0)
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000)
    // 相机
    const camera = new THREE.PerspectiveCamera(45, 2, 1, 2000)
    camera.position.set(100, 200, 300)
    // 渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasDancingRef.value, antialias: true })

    // 更新相机参数
    updateAspect(renderer, camera)
    window.addEventListener('resize', () => {
      updateAspect(renderer, camera)
    })

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 100, 0)
    controls.update()

    const clock = new THREE.Clock()

    // 半球光-光源放置在场景之上，颜色从天空光线颜色渐变到地面光线颜色
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5)
    hemiLight.position.set(0, 200, 0)
    scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 5)
    dirLight.position.set(0, 200, 100)
    dirLight.castShadow = true
    dirLight.shadow.camera.top = 180
    dirLight.shadow.camera.bottom = -100
    dirLight.shadow.camera.left = -120
    dirLight.shadow.camera.right = 120
    scene.add(dirLight)

    // ground
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    )
    mesh.rotation.x = -Math.PI / 2
    mesh.receiveShadow = true
    scene.add(mesh)

    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000)
    grid.material.opacity = 0.2
    grid.material.transparent = true
    scene.add(grid)

    const loader = new FBXLoader()
    let mixer = null
    loader.load('/models/Samba Dancing.fbx', function (object) {
      console.log(object, 'dance')
      // mixer = new THREE.AnimationMixer(object)

      // const action = mixer.clipAction(object.animations[0])
      // action.play()

      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true
          // child.receiveShadow = true
        }
      })

      scene.add(object)
    })

    const animate = () => {
      requestAnimationFrame(animate)

      const delta = clock.getDelta()

      if (mixer) {
        mixer.update(delta)
      }

      renderer.render(scene, camera)
    }
    animate()
  }

  return { canvasDancingRef, createFbxDancing }
}
