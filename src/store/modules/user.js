/* 用户信息及特性化设置相关 */
import { defineStore } from 'pinia'
// import { reactive} from 'vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogined: false, // 是否已经登录
    isCollapse: false // 菜单折叠
  }),
  actions: {
    setIsLogined(data) {
      this.isLogined = data
    },
    setCollapse(data) {
      this.isCollapse = data
    }
  }
})

// export const useUserStore = defineStore('user', () => {

// })
