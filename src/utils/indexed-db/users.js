import IMDb from './db'
// import { SPECIAL_CONVERSATION, HIDDEN } from '@/im/constant'
// import imApi from '@/apis/im'

// 数据结构
// v1
// {
//   id: string,
//   nickname: string,
//   avatar: string,
//   remark: string
// }

const userStore = {
  name: 'users',
  keyPath: 'id',
  autoIncrement: false,
  indexes: [],
  create(db) {
    if (!db.objectStoreNames.contains(this.name)) {
      const store = db.createObjectStore(this.name, {
        keyPath: this.keyPath,
        autoIncrement: this.autoIncrement
      })
      this.indexes.forEach((index) => {
        store.createIndex(index.name, index.keyPath, index.options)
      })
    }
  },
  // 预加载系统用户信息
  // async preloadSystemUserInfo() {
  //   const systemUserIds = Object.values(SPECIAL_CONVERSATION).filter(
  //     (item) => !HIDDEN.includes(item)
  //   )
  //   const result = []
  //   for (let i = 0; i < systemUserIds.length; i++) {
  //     const dbData = await this.getUserById(systemUserIds[i])
  //     if (dbData) continue
  //     const user = await imApi.getSystemUserBaseInfo(systemUserIds[i])
  //     result.push({
  //       id: systemUserIds[i],
  //       nickname: user.nickname,
  //       avatar: user.avatar,
  //       remark: ''
  //     })
  //   }
  //   if (result.length) {
  //     await this.syncData(result)
  //   }
  // },
  // 批量添加或修改用户信息
  async syncData(users) {
    const transaction = IMDb.database.transaction([this.name], 'readwrite')
    const store = transaction.objectStore(this.name)
    await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        resolve()
      }
      transaction.onerror = () => {
        reject(new Error('添加用户信息失败'))
      }
      users.forEach((user) => {
        store.put(user)
      })
    })
  },
  // 根据缓存完善会话信息
  async completeConversationInfo(data, key) {
    if (!Array.isArray(data) || typeof key !== 'string') {
      return
    }
    const transaction = IMDb.database.transaction([this.name], 'readwrite')
    const store = transaction.objectStore(this.name)
    for (let i = 0; i < data.length; i++) {
      if (data[i].conversationName) continue
      await new Promise((resolve) => {
        const request = store.get(data[i][key])
        request.onsuccess = () => {
          data[i] = {
            ...data[i],
            conversationName: (request.result?.remark || request.result?.nickname) ?? '',
            conversationAvatar: request.result?.avatar ?? '',
            filterKeywords: [request.result?.remark, request.result?.nickname]
          }
          resolve()
        }
      })
    }
    await new Promise((resolve) => {
      transaction.oncomplete = () => {
        resolve(data)
      }
    })
  },
  // 完善参数中的用户信息
  async completeUserInfo(data, key) {
    if (!Array.isArray(data) || typeof key !== 'string') {
      return
    }
    const transaction = IMDb.database.transaction([this.name], 'readwrite')
    const store = transaction.objectStore(this.name)
    for (let i = 0; i < data.length; i++) {
      await new Promise((resolve) => {
        const request = store.get(data[i][key])
        request.onsuccess = () => {
          Object.assign(data[i], {
            nickname: request.result?.nickname ?? '',
            avatar: request.result?.avatar ?? '',
            remark: request.result?.remark ?? ''
          })
          resolve()
        }
      })
    }
    await new Promise((resolve) => {
      transaction.oncomplete = () => {
        resolve(data)
      }
    })
  },
  // 更新某个用户信息
  async updateUser(user) {
    const transaction = IMDb.database.transaction([this.name], 'readwrite')
    const store = transaction.objectStore(this.name)
    await new Promise((resolve, reject) => {
      const request = store.put(user)
      request.onsuccess = () => {
        resolve()
      }
      request.onerror = () => {
        reject(new Error('更新用户信息失败'))
      }
    })
  },
  // 根据id获取用户信息
  async getUserById(id) {
    const transaction = IMDb.database.transaction([this.name], 'readonly')
    const store = transaction.objectStore(this.name)
    const result = await new Promise((resolve) => {
      const request = store.get(id)
      request.onsuccess = () => {
        resolve(request.result)
      }
    })
    return result
  }
}

export default userStore
