/* eslint-disable no-magic-numbers */
import { ElNotification } from 'element-plus'

// 消息提醒-（旧的信息立即被新的信息顶替，最多存在1条）
class notifyQueue {
  constructor(maxLimit = 1, duration = 6000) {
    // 最多存在的消息数量
    this.maxLimit = maxLimit
    // 消息队列(保存后续的消息)
    this.queue = []
    // 消息存在时间倒计时,单位s
    this.defaultDuration = duration
    // 当前存在的消息实例
    this.instances = []
  }

  // 执行队列里的消息
  run(options) {
    try {
      // 消息数量超出限制，顶替旧消息
      if (this.instances.length >= this.maxLimit) {
        const oldInstances = this.instances[0]?.value // 最旧的消息
        oldInstances.close() // 关闭消息
        // this.instances.shift(oldInstances) // 从消息实例集合里删除

        // 执行消息提醒通知,返回的实例存入消息数组里,id为消息id value为消息实例
        const instance = ElNotification(options)
        this.instances.push({
          id: options.id,
          value: instance
        })
      } else {
        // 执行消息提醒通知,返回的实例存入消息数组里,id为消息id value为消息实例
        const instance = ElNotification(options)
        this.instances.push({
          id: options.id,
          value: instance
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('执行队列里的消息error :>> ', error)
    }
  }

  // 入队
  enQueue(item) {
    this.queue.push(item)
  }

  // 出队（从队尾拿最新消息）
  deQueue() {
    if (!this.queue.length) return
    this.queue.pop(this.queue[0])
  }

  // 执行下一条消息
  next() {
    if (!this.queue.length) return
    this.run(this.queue[0])
  }

  /**
   * 关闭当前消息
   * @param {string} id 消息id
   * @param {boolean} isHandleClose 是否手动关闭消息弹框（注意！若在Notification组件的onClose里调用，则一定要传false,否则会出错）
   */
  closeNotification(id = '', isHandleClose = true) {
    if (!this.instances.length) return

    // 查找当前消息实例
    const curIndex = this.instances.findIndex(v => v.id === id)
    const curNotification = curIndex > -1 ? this.instances[curIndex]?.value : ''
    if (!curNotification || curIndex === -1) return
    // 删除对应的消息实例
    this.instances.splice(curIndex, 1)

    // 判断是否可以显示下一条消息，从队列里取出并执行下一条消息提醒
    if (this.queue.length && this.instances.length < this.maxLimit) {
      setTimeout(() => {
        this.next()
        this.deQueue()
      }, 500)
    }

    // 手动触发消息关闭
    if (isHandleClose) {
      curNotification.close()
    }
  }

  // 关闭全部弹窗
  closeAllNotification() {
    if (this.instances.length > 0) {
      this.instances.forEach(curInstance => {
        curInstance.value.close()
        this.deQueue()
      })
      this.instances = []
    }
  }
}

export default notifyQueue
