<style lang="scss" scoped>
.reason-text {
  color: $assist-danger;
}

.label {
  display: inline-block;
}
</style>

<template>
  <NotificationCard>
    <template #header>
      <div class="reason-text">
        <div>修改回款账户{{ data.status === 'SUCCESS' ? '成功' : '失败' }}</div>
        <span v-if="data.status !== 'SUCCESS'">失败原因：{{ data.failMsg }}</span>
      </div>
    </template>
    <template #main>
      <div>
        <div>
          <span class="label">承兑人：</span>{{ data.acceptorName }}
        </div>
        <div>
          <span class="label">票据金额 / 到账金额：</span>{{ `${yuan2wan(data.draftAmount)}万 / ${yuan2wan(data.draftActualAmount)}万` }}
        </div>
        <div>
          <span class="label">通知时间：</span>{{ formatTime(data.notifyTime) }}
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
import NotificationCard from './notification-card/notification-card.vue'
import { notificationQueue } from '@/views/components/notification/js/notification' // 消息实例队列
import { useDetailPage } from '@/hooks/detail-page' // 详情页面 hook
import { yuan2wan } from '@/common/js/number' // 金额单位转换
import { formatTime } from '@/common/js/date' // 时间处理

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
