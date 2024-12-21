import { h } from 'vue'
import NotificationQueue from './notification-queue' // 消息队列
import '../scss/notification.scss' // css

import OperationNotice from '../components/operation-notice.vue'
import ChangeAccountNotice from '../components/change-account-notice.vue'
import OrderReviewNotice from '../components/order-review-notice.vue'
import { WEB_SOCKET_EVENT } from '@/websocket/constant' // mqtt监听事件
const defaultOptions = {
  maxDurationCount: 1, // 消息提醒存在最大数量
  duration: 5000, // 消息提醒存在时间 默认5秒 (平台发出的消息通知不自动关闭，其余统一5秒后自动关闭)
  title: '消息提醒', // 消息提醒左上角标题
  offset: 20, // 消息位置偏移量
  position: 'bottom-right'
}

let idCount = 1 // 消息id(前端自定义字段，用来识别关闭对应mqtt消息)

// 消息队列初始化
export const notificationQueue = new NotificationQueue(defaultOptions.maxDurationCount)

// 获取对应的通知组件
const getComponent = topic => {
  switch (topic) {
    case 'platForm':
      return OperationNotice
    case WEB_SOCKET_EVENT.SELLER_BANK_ACCOUNT_CHANGE_NOTICE:
      return ChangeAccountNotice
    case WEB_SOCKET_EVENT.AUTO_REVIEW_FAIL_NOTICE:
      return OrderReviewNotice
    default:
      break
  }
}

export default {

  /**
   * 执行消息提醒弹窗
   * @param {String} topic 消息提醒类型(account:开户 order交易订单 bargain议价 platForm平台 breakContract违约相关 issue发布提醒)
   * @param {Object|String} data 消息提醒数据
   * @param {Object} options 配置数据
   */
  notify(topic = '', data, options = {}) {
    try {
      const NotificationCard = getComponent(topic)
      if (!NotificationCard) {
      // eslint-disable-next-line no-console
        console.warn('组件不存在')
        return
      }

      // 如果消息组件存在initData初始化函数，则调用该函数处理data数据，再传入vm，否则直接传入data数据
      // if (NotificationCard?.methods.initData) {
      //   data = NotificationCard.methods.initData(data)
      // }

      // 使用props传入data数据，消息组件监听data再赋值给自身定义的数据来使用
      let vnode = h(NotificationCard, {
        data,
        notificationId: `notification_${idCount}`,
        type: 1, // 该交易消息卡片组件用途 1-MQTT推送 2-消息列表
      })

      // 监听组件内按钮点击事件，触发关闭消息提醒
      // vm.$on('close-notification', id => {
      //   notificationQueue.closeNotification(id)
      // })

      // ele Notification 组件配置
      const notificationOptions = Object.assign({}, {
        id: `notification_${idCount}`,
        title: options.notificationTitle || defaultOptions.title,
        // eslint-disable-next-line no-underscore-dangle
        message: vnode,
        duration: options.duration || defaultOptions.duration,
        customClass: options.customClass || 'notification-popup',
        position: options.position || defaultOptions.position,
        offset: options.offset || defaultOptions.offset,
        // eslint-disable-next-line no-underscore-dangle
        onClose: this.onClose.bind(vnode, `notification_${idCount}`),
      }, options)

      idCount++

      setTimeout(() => {
        notificationQueue.run(notificationOptions)
      // eslint-disable-next-line no-magic-numbers
      }, 200)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('error :>> ', error)
    }
  },
  // 消息提醒组件关闭（通知队列执行下一条消息）
  onClose(id) {
    // 若在Notification组件的onClose里调用，则一定要传false,否则会出错
    notificationQueue.closeNotification(id, false)
  },
}
