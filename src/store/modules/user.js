/* 用户信息及特性化设置相关 */
import { defineStore } from 'pinia'
import userApi from '@/apis/user.js'
import router from '@/router/index'

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
    // 添加标签路由
    addTagsList(data) {
      // 重复path
      let repeatPath = this.tagsList.find((item) => item.path === data.path)
      const { path, meta } = data
      if (!repeatPath) {
        this.tagsList.push({
          path: path,
          ...meta
        })
      }
      console.log(this.tagsList, 'tagslist')
    },
    // 删除标签
    removeTag(removeTag, activePath) {
      let index = this.tagsList.findIndex((tag) => tag.path === removeTag.path)
      if (removeTag.path === activePath) {
        this.tagsList.splice(index, 1)
        let newIndex = index === this.tagsList.length ? index - 1 : index
        router.push({ path: this.tagsList[newIndex].path })
      } else {
        this.tagsList.splice(index, 1)
      }
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
