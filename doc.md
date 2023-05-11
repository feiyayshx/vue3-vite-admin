# 项目模版搭建流程

### 安装@vue/cli
安装后可以使用vue命令
```
npm install -g @vue/cli
```
### 创建一个vite简洁模版
```
vue create vue3-vite-admin
```
### 引入vue-router

### 引入pinia

### 引入element-plus

### 引入@element-plus/icons-vue
pnpm安装
```js
pnpm add @element-plus/icons-vue --save
```
使用
```html
<template>
  <el-icon :size="size" :color="color">
      <Edit />
  </el-icon>
</template>
<script>
import {Edit } from '@element-plus/icons-vue'
</script>
```
[Icon官方文档参考](https://element-plus.org/zh-CN/component/icon.html#%E5%9F%BA%E7%A1%80%E7%94%A8%E6%B3%95)

### 重置浏览器样式
本项目使用normalize.css统一浏览器样式。创建本地静态文件，main.js中引入。

### 安装sass预编译依赖
```
pnpm add sass -D
```
### eslint校验配置
安装 [eslint](https://zh-hans.eslint.org/docs/latest/use/getting-started), [eslint-plugin-vue](https://eslint.vuejs.org/rules/)
```js
pnpm add eslint eslint-plugin-vue -D
```
eslint是js代码校验的核心库，ESLint完全是插件式的，每个规则都是一个插件。
```js
modules.exports = {
  "extends": {
      'eslint:recommended', // Eslint推荐规则配置
  }
}

```
eslint-plugin-vue插件针对的是vue3语法规则，相关配置如下：
**.eslintrc.js**
```js
modules.exports = {
  "parser": "vue-eslint-parser",
  "extends": {
      // others ...
      'plugin:vue/vue3-essential', // 更多选项可以参阅eslint-plugin-vue官方文档
      'plugin:vue/vue3-strongly-recommended'
    }
}
```
**运行阶段执行eslint校验**
方案1：安装vite-plugin-eslint
```js
pnpm add vite-plugin-eslint -D
```
配置vite.config.js
```js
import vitePluginEslint from 'vite-plugin-eslint'
export default defineConfig(()=>{
  return {
    plugins: [
      vitePluginEslint({
         include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts']
      })
    ]
  }
})
```
### git提交配置

### vite.config.js文件配置

