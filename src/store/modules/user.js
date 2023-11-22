/* 用户信息及特性化设置相关 */
import { defineStore } from 'pinia'
import userApi from '@/apis/user.js'

// import { reactive} from 'vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogined: false, // 是否已经登录
    isCollapse: false, // 菜单折叠状态-true:折叠，false-展开
    menuList: [], // 菜单数据
    tagsList: [] // 标签数据
  }),
  actions: {
    setIsLogined(data) {
      this.isLogined = data
    },
    setCollapse(data) {
      this.isCollapse = data
    },
    // 获取菜单数据
    async getMenuList() {
      let res = await userApi.queryUserInfo()
      this.menuList = res || []
      console.log(res, 'res')
    }
  }
})

// export const useUserStore = defineStore('user', () => {

// })
