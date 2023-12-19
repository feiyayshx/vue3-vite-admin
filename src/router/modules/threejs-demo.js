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
    path: '/threejs-demo/3d',
    name: 'threejs3d',
    component: () => import('@/views/threejs-demo/case/load3D.vue'),
    meta: {
      title: '3D场景',
      noCache: true
    }
  }
]

export default authorityControlRoute
