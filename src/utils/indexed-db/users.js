import IMDb from './db'
import userApi from '@/apis/user'
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
      console.log('create')

      const store = db.createObjectStore(this.name, {
        keyPath: this.keyPath,
        autoIncrement: this.autoIncrement
      })
      this.indexes.forEach((index) => {
        store.createIndex(index.name, index.keyPath, index.options)
      })
    }
  },
  // 预加载用户信息
  async preloadUserInfo() {
    const userList = await userApi.queryFollowUser()
    if (userList.length) {
      await this.syncData(userList)
    }
  },
  // 批量添加用户信息
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
