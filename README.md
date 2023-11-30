# vue3-vite-admin

vue3+vite4+ElementPlus 构建的后台管理系统模版

### 项目启动

```
pnpm install  // 安装依赖
pnpm dev      // 开启本地服务器
```

### 打包构建

```
pnpm build    // 生产打包
```

## 开发规范约定

### 路由配置

#### 1. 路由名称name需要与路由组件文件名保持一致

路由配置项中的name字段需要与组件名保持一致，否则keep-alive设置的exclude如果匹配不到组件不会生效。规范路由名称是为了避免对每个组件添加组件名，方便keep-alive缓存。如果不想沿用该命名规范，可以借助插件单独设置每个组件的名称。
