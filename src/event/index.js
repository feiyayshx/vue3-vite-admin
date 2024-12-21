import { onBeforeUnmount } from 'vue'

/* eslint-disable no-console */
// 事件映射表
let eventMap = {}

/**
 * 监听事件
 * @param {string}    eventName 事件名
 * @param {function}  listener 回调函数
 * @param {object}    instance 注册事件的实例
 */
function on(eventName, listener, instance) {
  eventMap[eventName] = eventMap[eventName] || []
  eventMap[eventName].push({
    listener,
    instance,
  })
}

// 监听事件，只执行一次
function once(eventName, listener, instance) {
  eventMap[eventName] = eventMap[eventName] || []
  eventMap[eventName].push({
    listener,
    instance,
    once: true,
  })
}

// 解除事件监听
function off(eventName, listener) {
  // 解除所有事件监听
  if (!eventName) {
    eventMap = {}
    return
  }

  // 没有对应事件
  if (!eventMap[eventName]) {
    return
  }

  // 解除某事件监听
  eventMap[eventName].forEach((currentEvent, index) => {
    if (currentEvent.listener === listener) {
      eventMap[eventName].splice(index, 1)
    }
  })
}

// 发送事件，执行对应响应函数
function emit(eventName, ...args) {
  if (!eventMap[eventName]) {
    return
  }

  eventMap[eventName].forEach((currentEvent, index) => {
    currentEvent.listener(...args)
    if (currentEvent.once) {
      eventMap[eventName].splice(index, 1)
    }
  })
}

// 显示当前注册的事件，代码优化时使用
function showEventMap(targetEventName) {
  if (targetEventName) { // 查看具体某个事件的监听情况
    eventMap[targetEventName].forEach(eventItem => {
      console.log(targetEventName, eventItem.instance, eventItem.listener)
    })
  } else { // 查看所以事件的监听情况
    Object.keys(eventMap).forEach(eventName => {
      eventMap[eventName].forEach(eventItem => {
        console.log(eventName, eventItem.instance, eventItem.listener)
      })
    })
  }
}

// 提供 vue mixin 方法，在 beforeDestroy 自动注销事件监听
export const mixin = {
  beforeCreate() {
    // 重载 on 和 once 函数，收集本组件监听的事件，待消除时，销毁事件监听
    this.$eventListenerList = []
    this.$event = { on, once, off, emit, showEventMap }
    this.$event.on = (eventName, listener) => {
      this.$eventListenerList.push({ eventName, listener })
      on(eventName, listener)
    }
    this.$event.once = (eventName, listener) => {
      this.$eventListenerList.push({ eventName, listener })
      once(eventName, listener)
    }
  },

  // 消除组件时，自动销毁事件监听
  beforeDestroy() {
    this.$eventListenerList.forEach(currentEvent => {
      off(currentEvent.eventName, currentEvent.listener)
    })
    this.$eventListenerList.length = 0
  },
}

// useEvent hook
export const useEvent = () => {
  // 重载 on 和 once 函数，收集本组件监听的事件，待消除时，销毁事件监听
  const eventListenerList = []
  const event = { on, once, off, emit, showEventMap }
  event.on = (eventName, listener) => {
    eventListenerList.push({ eventName, listener })
    on(eventName, listener)
  }
  event.once = (eventName, listener) => {
    eventListenerList.push({ eventName, listener })
    once(eventName, listener)
  }

  onBeforeUnmount(() => {
    eventListenerList.forEach(currentEvent => {
      off(currentEvent.eventName, currentEvent.listener)
    })
    eventListenerList.length = 0
  })

  return event
}

export default { on, off, once, emit, showEventMap }
