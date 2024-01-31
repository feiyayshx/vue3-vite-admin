class Storage {
  constructor(key) {
    this.key = key
  }
  get() {
    let data = window.localStorage.getItem(this.key)
    return data ? JSON.parse(data) : null
  }
  set(value) {
    window.localStorage.setItem(this.key, JSON.stringify(value))
  }
  remove() {
    window.localStorage.removeItem(this.key)
  }
  static get(key) {
    const storgae = new Storage(key)
    return storgae.get()
  }
  static set(key, value) {
    const storage = new Storage(key)
    return storage.set(key, value)
  }
  static remove(key) {
    const storage = new Storage(key)
    return storage.remove()
  }
}

export default Storage
