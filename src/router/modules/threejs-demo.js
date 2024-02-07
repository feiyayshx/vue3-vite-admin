const authorityControlRoute = [
  // threejs
  {
    path: '/threejs-demo/base',
    name: 'threejsBase',
    component: () => import('@/views/threejs-demo/threejs-demo.vue'),
    meta: {
      title: '基础demo',
      noCache: true
    }
  },
  {
    path: '/threejs-demo/gltf',
    name: 'gltf3d',
    component: () => import('@/views/threejs-demo/case/load-gltf.vue'),
    meta: {
      title: 'gltf-3D',
      noCache: true
    }
  },
  {
    path: '/threejs-demo/fbx',
    name: 'fbx3d',
    component: () => import('@/views/threejs-demo/case/load-fbx.vue'),
    meta: {
      title: 'fbx-3D',
      noCache: true
    }
  },
  {
    path: '/threejs-demo/wander',
    name: 'sceneWander',
    component: () => import('@/views/threejs-demo/case/scene-wander.vue'),
    meta: {
      title: '场景漫游',
      noCache: true
    }
  },
  {
    path: '/threejs-demo/batched-mesh',
    name: 'batchedMesh',
    component: () => import('@/views/threejs-demo/case/batched-mesh.vue'),
    meta: {
      title: '批量网格',
      noCache: true
    }
  }
]

export default authorityControlRoute
