/* 菜单数据 */
export const menuList = [
  {
    id: '1',
    name: '工作台',
    path: '/dashboard',
    icon: 'HomeFilled',
    children: []
  },
  {
    id: '2',
    name: '组件封装',
    path: '/postting-components',
    icon: 'Menu',
    children: [
      {
        id: '2-1',
        name: '列表组件',
        path: '/postting-components/list',
        children: [
          {
            id: '2-1-1',
            path: '/postting-components/table-list',
            name: '表格列表'
          },
          {
            id: '2-1-2',
            path: '/postting-components/card-list',
            name: '卡片列表'
          }
        ]
      },
      {
        id: '2-2',
        name: '表单组件',
        path: '/postting-components/form'
      },
      {
        id: '2-3',
        name: '上传组件',
        path: '/postting-components/upload'
      }
    ]
  },
  {
    id: '5',
    name: '功能实现',
    path: '/function-manage',
    icon: 'Tools',
    children: [
      {
        id: '5-1',
        name: '虚拟列表',
        path: '/function-manage/virtual-list'
      },
      {
        id: '5-2',
        name: '防抖与节流',
        path: '/function-manage/debounce-throttle'
      }
    ]
  },
  {
    id: '3',
    name: '权限控制',
    path: '/authority-control',
    icon: 'infoFilled',
    children: [
      {
        id: '3-1',
        name: '页面权限',
        path: '/authority-control/page-auth'
      },
      {
        id: '3-2',
        name: '操作权限',
        path: '/authority-control/operation-auth'
      }
    ]
  },
  {
    id: '4',
    name: '系统管理',
    path: '/system-manage',
    icon: 'UserFilled',
    children: [
      {
        id: '4-1',
        name: '角色管理',
        path: '/system-manage/role'
      },
      {
        id: '4-2',
        name: '菜单管理',
        path: '/system-manage/menu'
      },
      {
        id: '4-3',
        name: '用户管理',
        path: '/system-manage/user'
      }
    ]
  }
]
