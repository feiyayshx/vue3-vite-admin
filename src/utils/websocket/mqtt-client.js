import commonApi from '@/apis/common'
import '@/utils/libs/paho-mqtt'

// [MQTT-TCP连接通信](https://help.aliyun.com/document_detail/73742.htm?spm=a2c4g.11186623.0.0.33ae695fJZ8VUC#section-llx-5ay-oma)

/** 获取 mqtt token 最大重试次数 */
const GET_TOKEN_MAX_TRY_TIME = 5

/** mqtt 连接最大重试次数 */
const MQTT_CONNECT_MAX_TRY_TIME = 5

/** mqtt 超时连接最大重试次数 */
const MQTT_CONNECT_EXPIRCE_MAX_TRY_TIME = 5

/** mqtt token 读写权限 */
const MQTT_TOKEN_PERMISSION = 'RW'

/** mqtt 客户端 */
const mqttClient = {
  /** websocket 对象 */
  websocket: null,

  /** mqtt 连接过期时间戳 */
  expirationTime: 0,

  /** mqtt 过期检查计时器 */
  checkExpirationTimeout: null,

  /** 客户端对象 */
  client: null,

  /** 获取 token 尝试次数 */
  getTokenTryTime: 0,

  /** 连接尝试次数 */
  connectTryTime: 0,

  /** 是否在线 */
  isOnline: false,

  /** 连接断开的回调 */
  onConnectionLost: null,

  /** 超时次数 */
  tokenExpireNotice: 0,

  // 初始化
  init(websocket) {
    this.websocket = websocket
  },

  /**
   * 重置
   * @returns {promise} 返回 promise，如果有 client 则断开后 resolve
   */
  reset() {
    const { client } = this
    this.expirationTime = 0
    this.stopCheckExpiration()
    this.client = null
    this.getTokenTryTime = 0
    if (client) {
      return new Promise((resolve) => {
        try {
          client.disconnect()
        } catch (e) {
          // 未连接或连接中
        }
        this.isOnline = false
        resolve()
      })
    } else {
      return Promise.resolve()
    }
  },

  /**
   * 等待
   * @param {number} ms 毫秒数
   * @returns {Promise} 表示是否已等待完成的 promise
   */
  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  },

  /**
   * 获取 mqtt token
   * @param {string} clientId 用户请求接口的 clientId
   * @param {string} token 用户请求接口的 token
   * @param {string} interfacePrefix 接口前缀
   */
  getMqttToken: async function getMqttToken(clientId) {
    if (this.isOnline) {
      return
    }
    // 处理获取 token 失败的情况
    const handleError = async (error) => {
      if (this.getTokenTryTime < GET_TOKEN_MAX_TRY_TIME && !error.$isTokenExpired) {
        console.log('获取 mqtt token 接口请求失败，重试中...')
        await this.wait(5000)
        return this.getMqttToken(clientId)
      } else {
        throw new Error('获取 mqtt token 接口请求失败')
      }
    }
    try {
      this.getTokenTryTime++
      const data = await commonApi.getApplyToken(clientId)
      this.getTokenTryTime = 0
      return data
    } catch (e) {
      // eslint-disable-next-line
      console.log(e)
      return handleError(e)
    }
  },

  /**
   * 创建连接
   * @param {boolean} isReconnect 是否重新连接
   */
  connect: async function connect(isReconnect) {
    if (this.client) {
      return this.client
    }

    let res
    let MQTT = window.Paho
    const getRandomNumber = () => Math.floor(Math.random() * 10)
    const randomId = Array.from({ length: 15 }, getRandomNumber).join('')
    const clientId = `${'GID_DJ_GROUP_DEV'}@@@${randomId}`
    // const clientId = `${
    //   import.meta.env.VUE_APP_API_ENV === 'development' ? 'GID_DJ_GROUP_DEV' : 'GID_DJ_GROUP'
    // }@@@${randomId}`

    try {
      res = await this.getMqttToken(clientId)
    } catch (error) {
      this.isOnline = false
      // console.log('获取 mqtt token 失败，导致创建 mqtt 连接失败')
      if (isReconnect && typeof this.onConnectionLost === 'function') {
        this.reset()
        this.onConnectionLost(error)
      }
      return Promise.reject(error)
    }
    this.setExpirationTime(res.expiration)

    // 阿里云Token模式MQTT客户端连接文档：https://help.aliyun.com/document_detail/54282.html?spm=a2c4g.11186623.6.595.735d218d6xG7PJ
    const { accessKey } = res // 账号的 AccessKey，在阿里云控制台查看
    const { instanceId } = res // 实例 ID，购买后从控制台获取
    // 由鉴权模式名称、AccessKey ID、InstanceId三部分组成，以 “|” 分隔。Token模式下鉴权模式设置为”Token”
    const username = `Token|${accessKey}|${instanceId}`
    // 客户端需要使用的Token内容。具体设置方法是将所有的Token按照Token类型和Token内容依次使用“|”连接符拼接成一个完整的字符串
    const password = `${MQTT_TOKEN_PERMISSION}|${res.token}`
    const useSSL = window.location.protocol === 'https:'

    const client = (this.client = new MQTT.Client(
      res.url, // MQTT 域名
      useSSL ? 443 : 80, // WebSocket 端口，如果使用 HTTPS 加密则配置为443,否则配置80
      clientId // 客户端 ClientId
    ))
    let resolvePromise
    let rejectPromise
    const promise = new Promise((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject
    })
    // 成功回调
    const onSuccess = () => {
      this.isOnline = true
      const topics = Object.values(res.topics)
      topics.forEach((topic) => {
        client.subscribe(topic)
      })
      resolvePromise(client)
      this.websocket.emit('connected')
      this.checkExpiration()
    }
    // 失败回调
    const onFailure = () => {
      this.isOnline = false
      this.connectTryTime++
      if (this.connectTryTime < MQTT_CONNECT_MAX_TRY_TIME) {
        console.log('mqtt 连接失败，重试中...')
        this.reconnect()
      } else {
        this.reset()
        rejectPromise(new Error('mqtt 连接失败'))
        this.websocket.emit('connect-failed')
      }
    }
    const options = {
      timeout: 3,
      userName: username,
      password,
      useSSL, // 如果使用 HTTPS 加密则配置为 true
      mqttVersion: 4,
      cleanSession: true,
      onSuccess,
      onFailure
    }
    client.onConnectionLost = async (error) => {
      // errorCode 为 0 表示为主动断开，比如在即将到期的时候会主动断开然后重连，这时候不需要做任何操作
      if (error && error.errorCode === 0) {
        return
      }
      try {
        await this.reconnect()
      } catch (e) {
        console.log('mqtt 断开后重连失败', e)
        if (typeof this.onConnectionLost === 'function') {
          this.reset()
          this.onConnectionLost(error)
        }
      }
    }
    // 接收消息
    client.onMessageArrived = (message) => {
      const topic = message.destinationName
      const payload = message.payloadString
      this.handleMessage(topic, payload)
    }
    client.connect(options)

    return promise
  },

  /**
   * 设置过期时间
   * @param {number} expiration 时长毫秒数
   */
  setExpirationTime(expiration) {
    this.expirationTime = Date.now() + Number(expiration)
  },

  /**
   * 重新连接
   * @param {number} delayTime 延迟时间
   * @returns {Promise} 连接结果对应的 promise
   */
  // eslint-disable-next-line no-magic-numbers
  async reconnect(delayTime = 2000) {
    await this.wait(delayTime)
    if (!this.client) {
      return
    }
    await this.reset()
    return this.connect(true)
  },

  /**
   * 检查 mqtt 连接是否过期
   */
  async checkExpiration() {
    if (!this.client || !this.expirationTime) {
      return
    }
    const num5 = 1
    const fiveMinutes = num5 * 60 * 1000
    const checkAgain = () => {
      const num10 = 30
      const tenSecs = num10 * 1000
      // 每隔30秒检查一次
      this.checkExpirationTimeout = setTimeout(() => {
        this.checkExpiration()
      }, tenSecs)
    }
    // 离过期时间小于五分钟则重连 重连最大次数5次
    if (this.expirationTime - Date.now() < fiveMinutes) {
      this.tokenExpireNotice++
      if (this.tokenExpireNotice > MQTT_CONNECT_EXPIRCE_MAX_TRY_TIME) return
      try {
        console.log('mqtt 过期，重新连接')
        this.connectTryTime = 0
        await this.reconnect()
      } catch (e) {
        console.log(e)
      }
    } else {
      this.tokenExpireNotice = 0
      checkAgain()
    }
  },

  /**
   * 停止检查 mqtt 连接是否过期
   */
  stopCheckExpiration() {
    this.checkExpirationTimeout && clearTimeout(this.checkExpirationTimeout)
    this.checkExpirationTimeout = null
  },

  /**
   * 通过 ipc 通知渲染进程
   * @param {string} channel 事件名
   * @param {any} data 数据
   */
  notify(channel, data) {
    this.websocket.notify(channel, data)
  },

  /**
   * 处理消息
   * @param {string} topic topic
   * @param {buffer} message 消息内容
   */
  handleMessage(topic, message) {
    let data = JSON.parse(message.toString())
    const { _msgtype: topicChannel } = data
    this.tokenExpireNotice = 0
    data.topicChannel = topicChannel
    this.notify(topicChannel, data)
  }
}

export default mqttClient
