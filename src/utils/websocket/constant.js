// key 为 mqtt topic 最后一个路径的大写，值为 mqtt topic 最后一个路径的驼峰形式
// 如 topic "topic_shendu_order/transaction_status_refresh" 对应的 key 为 TRANSACTION_STATUS_REFRESH，值为 transactionStatusRefresh

export const WEB_SOCKET_EVENT = {
  OPERATION_USER_NOTICE: 'operationUserNotice',
  SELLER_BANK_ACCOUNT_CHANGE_NOTICE: 'sellerBankAccountChangeNotice',
  AUTO_REVIEW_FAIL_NOTICE: 'autoReviewFailNotice' // 待人工审核订单提醒
}

// 常量-消息弹窗频率
// eslint-disable-next-line no-magic-numbers
export const MQTT_ALERT_TIME = 5 * 1000
