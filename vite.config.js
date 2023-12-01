import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    resolve: {
      // 配置别名
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/common.scss' as *;@use '@/styles/element/index.scss' as *;`
        }
      },
      postcss: {
        plugins: [tailwindcss(), autoprefixer()]
      }
    },
    plugins: [
      // 提供vue3单文件组件支持
      vue(),
      // 自动按需导入ElementPlus组件
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ]
      })
    ]
  }
})
