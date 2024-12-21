<style lang="scss" scoped>
.reason-text {
  color: $assist-danger;
}

.label {
  display: inline-block;
  width: 80px;
  text-align: right;
}
</style>

<template>
  <NotificationCard>
    <template #header>
      <div class="reason-text">
        {{ data.reason }}
      </div>
    </template>
    <template #main>
      <div>
        <div>
          <span class="label">订单号：</span>{{ data.orderNo }}
        </div>
        <div>
          <span class="label">票号：</span>{{ draftNoSix }}
        </div>
        <div>
          <span class="label">驳回时间：</span>{{ data.rejectTime }}
        </div>
      </div>
    </template>
    <template #footer>
      <el-button
        width="104"
        height="40"
        @click="closeNotification"
      >
        稍后处理
      </el-button>
      <el-button
        width="104"
        height="40"
        type="primary"
        @click="onHandle"
      >
        立即处理
      </el-button>
    </template>
  </NotificationCard>
</template>

<script setup>
import { computed } from 'vue'
import NotificationCard from './notification-card/notification-card.vue'
import { notificationQueue } from '@/views/components/notification/js/notification' // 消息实例队列
import { useDetailPage } from '@/hooks/detail-page' // 详情页面 hook

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  // 该消息组件id
  notificationId: {
    type: String,
    default: ''
  },
  // 该交易消息卡片组件用途 1-MQTT推送 2-消息列表
  type: {
    type: Number,
    default: 1
  },
})

// 票号处理
const draftNoSix = computed(() => {
  let len = props.data.draftNo ? props.data.draftNo.length : 0
  // eslint-disable-next-line no-magic-numbers
  let sixNo = len ? props.data.draftNo.substring(len - 6) : ''
  return sixNo
})

// 关闭通知弹窗
const closeNotification = () => {
  notificationQueue.closeNotification(props.notificationId)
}

// 详情页面 hook, 跳转详情
const openArgueOrderPage = useDetailPage('argue-order')
const handleToDetail = id => {
  openArgueOrderPage.open(id)
}
// 立即处理
const onHandle = () => {
  handleToDetail(props.data.id)
  closeNotification()
}
</script>
