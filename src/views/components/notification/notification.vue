<style lang="scss" scoped>
.notification {
  &.fixed-style {
    position: fixed;
    right: 50px;
    bottom: 50px;
    z-index: 999;
  }
}
</style>

<template>
  <div class="notification fixed-style" />
</template>

<script setup>
import { onMounted } from 'vue'
import { WEB_SOCKET_EVENT, MQTT_ALERT_TIME } from '@/utils/websocket/constant' // mqtt监听事件
import { useWebsocketEvent } from '@/websocket/index.js'
import notification from './js/notification' // 消息派发

const useWebsocket = useWebsocketEvent()

// 消息频率开关
let mqttFlag = false

onMounted(() => {
  init()
})

/**
 * 执行消息提醒弹窗
 * @param {String} type 消息提醒类型(account:开户 order交易订单 bargain议价 platForm平台 breakContract违约相关)
 * @param {Object|String} data 消息提醒数据
 * @param {Object} options 配置数据
 */
const handleNotify = (type = '', data, options) => {
  if (!data) return
  if (mqttFlag) return
  mqttFlag = true
  setTimeout(() => {
    mqttFlag = false
  }, MQTT_ALERT_TIME)
  notification.notify(type, data, options)
}

const handleMQTTListener = () => {
  useWebsocket.on(WEB_SOCKET_EVENT.SELLER_BANK_ACCOUNT_CHANGE_NOTICE, (data) => {
    handleNotify(WEB_SOCKET_EVENT.SELLER_BANK_ACCOUNT_CHANGE_NOTICE, data, {
      notificationTitle: '修改回款账户结果',
      duration: 0
    })
  })

  // 待人工审核订单提醒
  useWebsocket.on(WEB_SOCKET_EVENT.AUTO_REVIEW_FAIL_NOTICE, (data) => {
    handleNotify(WEB_SOCKET_EVENT.AUTO_REVIEW_FAIL_NOTICE, data, {
      notificationTitle: '待审核订单提醒'
    })
  })
}

// 初始化
const init = () => {
  // 接口数据初始化
  // this.initData()

  // 当前页面可见状态事件监听
  // this.pageVisibilityListener()

  // MQTT推送监听
  handleMQTTListener()
}
</script>
