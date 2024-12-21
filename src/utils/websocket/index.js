// import user from '@/utils/user'
import mqttClient from './mqtt-client'
import { onBeforeUnmount } from 'vue'
const websocket = {
  /** 事件监听对象 */
  eventMap: {},

  /**
   * 监听事件
   * @param {string} eventName 事件名
   * @param {function} listener 回调函数
   */
  on(eventName, listener) {
    this.eventMap[eventName] = this.eventMap[eventName] || []
    this.eventMap[eventName].push({ listener })
  },

  // 监听事件，只执行一次
  once(eventName, listener) {
    this.eventMap[eventName] = this.eventMap[eventName] || []
    this.eventMap[eventName].push({
      listener,
      once: true
    })
  },

  // 解除事件监听
  off(eventName, listener) {
    // 解除所有事件监听
    if (!eventName) {
      this.eventMap = {}
      return
    }

    // 没有对应事件
    if (!this.eventMap[eventName]) {
      return
    }

    // 解除某事件监听
    this.eventMap[eventName].forEach((currentEvent, index) => {
      if (currentEvent.listener === listener) {
        this.eventMap[eventName].splice(index, 1)
      }
    })
  },

  //  触发事件
  emit(eventName, ...args) {
    if (!this.eventMap[eventName]) {
      return
    }

    this.eventMap[eventName].forEach((currentEvent, index) => {
      currentEvent.listener(...args)
      if (currentEvent.once) {
        this.eventMap[eventName].splice(index, 1)
      }
    })
  },

  // 创建 websocket 连接
  async connect() {
    // if (!user.getToken()) {
    //   throw new Error('创建 mqtt 连接失败，token 不存在')
    // }
    const res = await mqttClient.connect()
    return res
  },

  // 断开连接
  disconnect() {
    mqttClient.reset()
    this.emit('disconnect', { type: 'disconnect' })
  },

  // 订阅所有频道
  notify(channel, data) {
    // eslint-disable-next-line no-console
    console.log(`%cmqtt 消息 -- channel: ${channel}, 数据：`, 'color:', data)
    // 可以通过 message 事件监听所有 channel 的消息
    this.emit('message', channel, data)
    switch (channel) {
      // 这里可以对单个 channel 的消息做统一处理
      default:
        this.emit(channel, data)
        break
    }
  }
}

mqttClient.init(websocket)
mqttClient.onConnectionLost = (error) => {
  websocket.emit('disconnect', error)
}

// 提供 vue mixin 方法，在 beforeDestroy 自动注销事件监听, 选项式api中推荐使用
export const mixin = {
  beforeCreate() {
    // 重载 on 函数，收集本组件监听的事件，待消除时，销毁事件监听
    this.$websocketListenerList = []
    this.$websocket = Object.create(websocket)
    this.$websocket.on = (eventName, listener) => {
      this.$websocketListenerList.push({ eventName, listener })
      websocket.on(eventName, listener)
    }
  },

  // 消除组件时，自动销毁事件监听
  beforeDestroy() {
    this.$websocketListenerList.forEach((currentEvent) => {
      websocket.off(currentEvent.eventName, currentEvent.listener)
    })
  }
}

// use websocketEvent hook for vue3
export const useWebsocketEvent = () => {
  // 重载 on 函数，收集本组件监听的事件，待消除时，销毁事件监听
  const websocketListenerList = []
  const useWebsocket = Object.create(websocket)
  useWebsocket.on = (eventName, listener) => {
    websocketListenerList.push({ eventName, listener })
    websocket.on(eventName, listener)
  }
  onBeforeUnmount(() => {
    websocketListenerList.forEach((currentEvent) => {
      websocket.off(currentEvent.eventName, currentEvent.listener)
    })
    websocketListenerList.length = 0
  })
  return useWebsocket
}

export default websocket
