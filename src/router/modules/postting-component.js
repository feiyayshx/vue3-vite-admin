/*============== 组件封装路由 =============== */
const posttingComponentRoute = [
  // 表格列表
  {
    path: '/postting-components/table-list',
    name: 'TableList',
    component: () => import('@/views/postting-components/list-component/table-list.vue'),
    meta: {
      title: '表格列表'
    }
  },
  // 卡片列表
  {
    path: '/postting-components/card-list',
    name: 'CardList',
    component: () => import('@/views/postting-components/list-component/card-list.vue'),
    meta: {
      title: '卡片列表'
    }
  },
  // 表单组件
  {
    path: '/postting-components/form',
    name: 'FormComponent',
    component: () => import('@/views/postting-components/form-component/form-component.vue'),
    meta: {
      title: '表单组件'
    }
  },
  // 上传组件
  {
    path: '/postting-components/upload',
    name: 'UploadComponent',
    component: () => import('@/views/postting-components/upload-component/upload-component.vue'),
    meta: {
      title: '上传组件'
    }
  }
]

export default posttingComponentRoute
