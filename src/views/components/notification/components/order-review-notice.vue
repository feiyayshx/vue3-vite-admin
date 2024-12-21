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
        <span>自动审单失败，请尽快处理</span>
      </div>
    </template>
    <template #main>
      <div>
        <div>
          <span class="label">承兑人：</span>{{ data.acceptorName }}
        </div>
        <div>
          <span class="label">票据金额：</span>{{ `${yuan2wan(data.draftAmount)}万` }}
        </div>
        <div>
          <span class="label">票号后六位：</span>{{ data.lastSixDraftNo }}
        </div>
        <div>
          <span class="label">发布时间：</span>{{ formatTime(data.publishTime) }}
        </div>
      </div>
    </template>
    <template #footer>
      <el-button
        width="104"
        height="40"
        type="primary"
        @click="onHandle"
      >
        处理
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
import reviewOrderApi from '@/apis/review-order' // 订单审核管理接口

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
const openAuditDetail = useDetailPage('order-audit-audit')
const handleToDetail = async orderNo => {
  await reviewOrderApi.goToReview({
    orderNo,
    needReviewFlag: 1 // 是否需要判断审核人是否为空 1需要 0不需要
  })
  openAuditDetail.open(orderNo, {
    fromType: 'audit'
  })
  closeNotification()
}
// 立即处理
const onHandle = () => {
  handleToDetail(props.data.orderNo)
}
</script>
