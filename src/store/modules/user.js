/* 用户信息及特性化设置相关 */
import { defineStore } from 'pinia'
import userApi from '@/apis/user.js'
import router from '@/router/index'

// import { reactive} from 'vue'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogined: false, // 是否已经登录
    menu: {
      isCollapse: false, // 菜单折叠状态-true:折叠，false-展开
      menuList: [] // 菜单数据
    },
    tags: {
      tagsList: [], // 标签数据
      excludeCacheTags: [] // 不加缓存的标签数据
    }
  }),
  actions: {
    setIsLogined(data) {
      this.isLogined = data
    },
    setCollapse(data) {
      this.menu.isCollapse = data
    },
    // 添加标签路由
    addTagsList(data) {
      // 重复path
      let repeatPath = this.tags.tagsList.find((item) => item.path === data.path)
      const { path, name, meta } = data
      if (!repeatPath) {
        this.tags.tagsList.push({
          path,
          name,
          ...meta
        })
      }
      this.addExcludeCacheTags(data)

      // console.log(this.tags.tagsList, 'tagslist')
    },
    // 删除标签
    removeTag(removeTag, activePath) {
      let index = this.tags.tagsList.findIndex((tag) => tag.path === removeTag.path)
      if (removeTag.path === activePath) {
        this.tags.tagsList.splice(index, 1)
        let newIndex = index === this.tags.tagsList.length ? index - 1 : index
        router.push({ path: this.tags.tagsList[newIndex].path })
      } else {
        this.tags.tagsList.splice(index, 1)
      }
      this.removeExcludeCacheTags(removeTag.name)
    },
    // 添加不缓存的路由标签
    addExcludeCacheTags(route) {
      const { name, meta } = route
      // 根据路由对象，添加不缓存的标签
      if (meta.noCache) {
        let isExist = this.tags.excludeCacheTags.find((tag) => tag === name)
        if (!isExist) {
          this.tags.excludeCacheTags.push(name)
        }
      }
      console.log(this.tags.excludeCacheTags, 'excludetags')
    },
    // 删除不缓存的路由标签
    removeExcludeCacheTags(name) {
      let index = this.tags.excludeCacheTags.findIndex((tag) => tag === name)
      if (index > -1) {
        this.tags.excludeCacheTags.splice(index, 1)
      }
    },
    // 获取菜单数据
    async getMenuList() {
      let res = await userApi.queryUserInfo()
      this.menu.menuList = res || []
    }
  }
})

// export const useUserStore = defineStore('user', () => {

// })
