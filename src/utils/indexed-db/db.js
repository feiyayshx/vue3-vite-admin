import userStore from './users.js'
const NAME = 'db'
const VERSION = 1

const DATABASE = {
  database: null,
  initDB(uid) {
    return new Promise((resolve, reject) => {
      if (!indexedDB) {
        return reject(new Error('当前浏览器不支持indexedDB'))
      }
      const request = indexedDB.open(`${NAME}_${uid}`, VERSION)
      request.onsuccess = (event) => {
        console.log('success')
        this.database = event.target.result
        userStore.preloadUserInfo().then(() => {
          resolve(event.target.result)
        })
      }
      request.onerror = (error) => {
        console.log('数据库创建失败')
        reject(error)
      }
      request.onupgradeneeded = (event) => {
        console.log('grade')
        this.createStore(event.target.result)
      }
    })
  },
  deleteDB(uid) {
    indexedDB.deleteDatabase(`${NAME}_${uid}`)
  },
  createStore(database) {
    userStore.create(database)
  }
}
export default DATABASE
