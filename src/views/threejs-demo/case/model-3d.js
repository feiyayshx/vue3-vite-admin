import { ref, isRef } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { updateAspect } from '../utils'

/**
 * @desc 创建一个基础3d需要的场景，相机，渲染器等
 */
export const createBase3D = (canvasRef, options) => {
  if (!isRef(canvasRef)) {
    return console.error('请使用ref绑定一个canvas元素的dom')
  }
  // 时钟对象
  const clock = new THREE.Clock()
  // 动画混合器
  let mixer = null

  // 场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xbfe3dd)
  // 相机
  const camera = new THREE.PerspectiveCamera(40, 2, 1, 100)
  // camera.position.set(5, 2, 8)

  // 渲染器
  const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, anitialias: true })
  // 更新相机参数
  updateAspect(renderer, camera)

  const controls = new OrbitControls(camera, renderer.domElement)
  // controls.target.set(0, 0.5, 0)
  controls.update()
  controls.enablePan = false // 禁用摄像机平移
  controls.enableDamping = true // 启用阻尼惯性

  // 辐射环境贴图
  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  // 高亮环境-类似于HDR
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer, 0.04)).texture

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // 3d模型加载器
  const loader = new GLTFLoader()
  // 压缩/解压3d模型
  if (options?.isDraco) {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/node_modules/three/examples/jsm/libs/draco/gltf/')
    loader.setDRACOLoader(dracoLoader)
  }

  // 加载3d模型-'/models/LittlestTokyo.glb',
  /**
   * 卡通人：https://sdpjw.oss-cn-qingdao.aliyuncs.com/static/3d/models/characters.glb
   * 会场：https://sdpjw.oss-cn-qingdao.aliyuncs.com/static/3d/models/laozhang-dome.glb
   * 房间：https://sdpjw.oss-cn-qingdao.aliyuncs.com/static/3d/models/scene_collision.glb
   * https://sdpjw.oss-cn-qingdao.aliyuncs.com/static/3d/models/scene_desk_obj.glb
   */
  loader.load(
    options.loadUrl,
    (object) => {
      if (typeof options.loadCallback === 'function') {
        options.loadCallback(object)
      }

      let model = object
      if (options.ext === 'gltf') {
        model = object.scene
      }
      if (object.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        mixer.clipAction(object.animations[0]).play()
      }

      animate()
    },
    undefined,
    (error) => {
      console.log(error)
    }
  )

  const animate = () => {
    requestAnimationFrame(animate)

    if (mixer) {
      const delta = clock.getDelta()
      mixer.update(delta)
    }
    controls.update()

    if (options.stats) {
      options.stats.update()
    }
    if (typeof options.animateCallback === 'function') {
      options.animateCallback()
    }

    renderer.render(scene, camera)
  }

  window.addEventListener('resize', () => {
    updateAspect(renderer, camera)
  })

  return { scene, camera, renderer, controls }
}

/**
 * @desc 会场模型
 */
export const useCreateMeetingplace = () => {
  const meetingPlaceRef = ref(null)
  const createMeetingplace = () => {
    const { scene, controls, camera } = createBase3D(meetingPlaceRef, {
      ext: 'gltf', // 模型类型
      isDraco: false, // 模型是否需要解压缩
      loadUrl: 'https://sdpjw.oss-cn-qingdao.aliyuncs.com/static/3d/models/laozhang-dome.glb', // 模型加载地址
      loadCallback: (gltf) => {
        const model = gltf.scene
        model.position.set(1, 1, 0)
        model.scale.set(0.5, 0.5, 0.5)
        scene.add(model)
      },
      animateCallback: () => {}
    })
    scene.add(camera)
    camera.position.set(-7, 9, -27)
    controls.target.set(0, 0.5, 0)
  }

  return { meetingPlaceRef, createMeetingplace }
}

/**
 * @desc 房间模型
 */
export const useCreateRoomplace = () => {
  const roomPlaceRef = ref(null)
  const createRoomplace = () => {
    const { scene, controls, camera } = createBase3D(roomPlaceRef, {
      ext: 'gltf', // 模型类型
      isDraco: false, // 模型是否需要解压缩
      loadUrl: 'https://sdpjw.oss-cn-qingdao.aliyuncs.com/static/3d/models/scene_collision.glb', // 模型加载地址
      loadCallback: (gltf) => {
        const model = gltf.scene
        model.position.set(1, 1, 0)
        // model.scale.set(0.5, 0.5, 0.5)
        scene.add(model)
      },
      animateCallback: () => {
        // console.log(camera.position, 'pos')
      }
    })
    camera.position.set(10, 7, -26)
    controls.target.set(0, 0.5, 0)
  }

  return { roomPlaceRef, createRoomplace }
}

/**
 * @desc 电脑模型
 */
export const useCreateComputer = () => {
  const computerRef = ref(null)
  const createComputer = () => {
    const { scene, controls, camera } = createBase3D(computerRef, {
      ext: 'gltf', // 模型类型
      isDraco: false, // 模型是否需要解压缩
      loadUrl: 'https://sdpjw.oss-cn-qingdao.aliyuncs.com/static/3d/models/scene_desk_obj.glb', // 模型加载地址
      loadCallback: (gltf) => {
        const model = gltf.scene
        model.position.set(1, 1, 0)
        // model.scale.set(0.5, 0.5, 0.5)
        scene.add(model)
      },
      animateCallback: () => {
        // console.log(camera.position, 'pos')
        // console.log(controls.target, 'target')
      }
    })
    // camera.scale.set(0.2, 0.2, 0.2)
    camera.position.set(13, 1.5, -12)
    controls.target.set(0, 0.5, 0)
  }

  return { computerRef, createComputer }
}
/**
 * @desc 小镇模型-glb格式
 * @returns
 */
export const useCreateGltfSmallTown = () => {
  const containerRef = ref(null)
  const smallTownRef = ref(null)
  const createSmallTown = () => {
    // 辅助工具-渲染帧率(1秒刷新的次数)
    const stats = new Stats()
    stats.dom.style.position = 'absolute'
    containerRef.value.appendChild(stats.dom)

    const { scene, controls, camera } = createBase3D(smallTownRef, {
      ext: 'gltf', // 模型类型
      stats: stats,
      isDraco: true, // 模型是否需要解压缩
      loadUrl: '/models/LittlestTokyo.glb', // 模型加载地址
      loadCallback: (gltf) => {
        const model = gltf.scene
        model.position.set(1, 1, 0)
        model.scale.set(0.01, 0.01, 0.01)
        scene.add(model)
      }
    })
    camera.position.set(5, 2, 8)
    controls.target.set(0, 0.5, 0)
  }

  return { containerRef, smallTownRef, createSmallTown }
}

/**
 * @desc 村庄模型-gltf格式
 * @returns
 */
export const useCreateGltfVillage = () => {
  const villageRef = ref(null)

  const createVillage = () => {
    const { scene, controls, camera } = createBase3D(villageRef, {
      ext: 'gltf', // 模型类型
      isDraco: false, // 模型是否需要解压缩
      loadUrl: '/models/village/scene.gltf', // 模型加载地址
      loadCallback: (gltf) => {
        const model = gltf.scene
        model.position.set(1, 1, 0)
        model.scale.set(0.1, 0.1, 0.1)
        scene.add(model)
      }
    })
    camera.position.set(8, 2, 3)
    controls.target.set(2, 1, 0)
  }

  return { villageRef, createVillage }
}

export class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object
    this.prop = prop
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`
  }
  set value(hexString) {
    this.object[this.prop].set(hexString)
  }
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name)
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
  folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
  folder.open()
}

class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj
    this.prop = prop
  }
  get value() {
    return THREE.MathUtils.radToDeg(this.obj[this.prop])
  }
  set value(v) {
    this.obj[this.prop] = THREE.MathUtils.degToRad(v)
  }
}

/**
 * @desc 花园房子模型-fbx格式
 * @returns
 */

export const useCreateFbx3d = () => {
  const canvasFbxRef = ref(null)
  const gui = new GUI()

  const createFbx3d = () => {
    // 场景
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0xbfe3dd)

    // 半球光
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5)
    hemisphereLight.position.set(-10, 100, 50)
    scene.add(hemisphereLight)

    // 环境光
    // const ambientLight = new THREE.AmbientLight(0xffffff, 3)
    // scene.add(ambientLight)

    // 平行光
    // const dirLight = new THREE.DirectionalLight(0xffffff, 5)
    // dirLight.position.set(-10, 10, 10)
    // dirLight.target.position.set(-2, 1, 0)

    // dirLight.castShadow = true
    // dirLight.shadow.camera.top = 180
    // dirLight.shadow.camera.bottom = -100
    // dirLight.shadow.camera.left = -120
    // dirLight.shadow.camera.right = 120
    // scene.add(dirLight)
    // scene.add(dirLight.target)

    // const helper = new THREE.DirectionalLightHelper(dirLight)
    // scene.add(helper)

    // gui.addColor(new ColorGUIHelper(dirLight, 'color'), 'value').name('color')
    // gui.add(dirLight, 'intensity', 0, 2, 0.01)

    // function updateLight() {
    //   dirLight.target.updateMatrixWorld()
    //   helper.update()
    // }
    // updateLight()

    // makeXYZGUI(gui, dirLight.position, 'position', updateLight)
    // makeXYZGUI(gui, dirLight.target.position, 'target', updateLight)

    // // 点光源
    // const light = new THREE.PointLight(0xffff00, 2)
    // light.position.set(0, 10, 0)
    // scene.add(light)

    // const pointHelper = new THREE.PointLightHelper(light)
    // scene.add(pointHelper)
    // const updateLight = () => {
    //   pointHelper.update()
    // }
    // gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    // gui.add(light, 'intensity', 0, 2, 0.01)
    // gui.add(light, 'distance', 0, 40).onChange(updateLight)
    // makeXYZGUI(gui, light.position, 'position', updateLight)

    // 聚光灯
    const light = new THREE.SpotLight(0xffffff, 150)
    light.position.set(-1.5, 1.2, 1.6)
    light.target.position.set(0, 0.2, 0)
    scene.add(light)
    scene.add(light.target)

    const helper = new THREE.SpotLightHelper(light)
    scene.add(helper)
    const updateLight = () => {
      light.target.updateMatrixWorld()
      helper.update()
    }
    gui.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight)
    makeXYZGUI(gui, light.position, 'position', updateLight)
    makeXYZGUI(gui, light.target.position, 'target', updateLight)

    // 相机
    const camera = new THREE.PerspectiveCamera(30, 2, 1, 1000)
    camera.position.set(-6, 1, 0)

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ canvas: canvasFbxRef.value, alpha: true })

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

    loader.load('/models/fbx/garden.fbx', (object) => {
      console.log(object, 'garden')
      const model = object
      object.traverse(function (child) {
        // console.log(child, 'child')
        if (child.isMesh) {
          // child.castShadow = true
          // child.receiveShadow = true
        }
      })
      // model.position.set(0, 0, 0)
      model.scale.set(0.1, 0.1, 0.1)
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

/**
 * @desc 舞动的机器人-fbx格式
 * @returns
 */

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
