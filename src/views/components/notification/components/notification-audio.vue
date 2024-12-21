<!-- 消息通知音频播放组件 -->
<template>
  <div>
    <!-- 音频播放 -->
    <audio id="audio" ref="audio" :src="audioSrc">
      <source :src="audioSrc" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
import { WEB_SOCKET_EVENT } from '@/websocket/constant' // mqtt监听事件
import { TRANSACTION_STATUS, MARGIN_BANK_ACCOUNT } from '@/constant'
// 音频oss路径地址
const ossPath = 'https://cdn.sdpjw.cn/static/erp/audio/'

// 兑接音频地址
const djOssPath = 'https://static-file.duijie.org.cn/frontend-file/frontend/new-audio/'

// 系统默认提示音
const DEFAULT_AUTO = `${ossPath}default.mp3`

// 订单交易状态提示音
const ORDER_AUTO = {
  // 待确认
  CONFIRM: {
    // 男
    MALE: {
      id: 1,
      DEFAULT: `${djOssPath}male/confirm-male-default.mp3`, // 普通订单
      // RADAR: `${ossPath}male/confirm-male-radar.mp3`, // 自动订单
    },
    FEMALE: {
      id: 0,
      DEFAULT: `${djOssPath}female/confirm-female-default.mp3`, // 普通订单
      // RADAR: `${ossPath}female/confirm-female-radar.mp3`, // 自动订单
    }
  },
  // 待收款
  RECEIPT: {
    // 男
    MALE: {
      id: 1,
      DEFAULT: `${djOssPath}male/receive-male-default.mp3`, // 普通订单
      // RADAR: `${ossPath}male/pay-male-radar.mp3`, // 自动订单
      // FAST: `${ossPath}male/pay-male-fast.mp3`, // 极速订单
    },
    FEMALE: {
      id: 0,
      DEFAULT: `${djOssPath}female/receive-female-default.mp3`, // 普通订单
      // RADAR: `${ossPath}female/pay-female-radar.mp3`, // 自动订单
      // FAST: `${ossPath}female/pay-female-fast.mp3`, // 极速订单
    }
  },
  // 待背书
  ENDORSE: {
    // 男
    MALE: {
      id: 1,
      DEFAULT: `${djOssPath}male/endorse-male-default.mp3`, // 普通订单
      // RADAR: `${ossPath}male/endorse-male-radar.mp3`, // 自动订单
      // FAST: `${ossPath}male/endorse-male-fast.mp3`, // 极速订单
    },
    FEMALE: {
      id: 0,
      DEFAULT: `${djOssPath}female/endorse-female-default.mp3`, // 普通订单
      // RADAR: `${ossPath}female/endorse-female-radar.mp3`, // 自动订单
      // FAST: `${ossPath}female/endorse-female-fast.mp3`, // 极速订单
    }
  },
  // 待付款（原待支付）
  PAY: {
    // 男
    MALE: {
      id: 1,
      DEFAULT: `${djOssPath}male/pay-male-default.mp3`, // 普通订单
      // RADAR: `${ossPath}male/endorse-male-default.mp3`, // 自动订单
      // FAST: `${ossPath}male/endorse-male-default.mp3`, // 极速订单
    },
    FEMALE: {
      id: 0,
      DEFAULT: `${djOssPath}female/pay-female-default.mp3`, // 普通订单
      // RADAR: `${ossPath}female/endorse-female-default.mp3`, // 自动订单
      // FAST: `${ossPath}female/endorse-female-default.mp3`, // 极速订单
    }
  },
  // 待签付
  SIGNIN: {
    // 男
    MALE: {
      id: 1,
      DEFAULT: `${djOssPath}male/signin-male-default.mp3`, // 普通订单
      // RADAR: `${ossPath}male/signin-male-radar.mp3`, // 自动订单
      // FAST: `${ossPath}male/signin-male-fast.mp3`, // 极速订单
    },
    FEMALE: {
      id: 0,
      DEFAULT: `${djOssPath}female/signin-female-default.mp3`, // 普通订单
      // RADAR: `${ossPath}female/signin-female-radar.mp3`, // 自动订单
      // FAST: `${ossPath}female/signin-female-fast.mp3`, // 极速订单
    }
  },
  // 锁票模式-待签收
  LOCK_SIGNIN: {
    // 男
    MALE: {
      id: 1,
      DEFAULT: `${djOssPath}male/lock-signin-male-default.mp3`, // 普通订单
    },
    FEMALE: {
      id: 0,
      DEFAULT: `${djOssPath}female/lock-signin-female-default.mp3`, // 普通订单
    }
  },
  // 自动接单
  RADAR: {
    // 男
    MALE: {
      id: 1,
      DEFAULT: `${ossPath}male/radar-male.mp3`, // 男声
    },
    FEMALE: {
      id: 0,
      DEFAULT: `${ossPath}female/radar-female.mp3`, // 女声
    }
  },
}

export default {
  name: 'notification-audio',

  components: {},
  props: {

    // 消息提醒设置
    remindSetting: {
      type: Object,
      default: () => ({})
    },

    // 接收到的mqtt推送消息数据
    mqttData: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
      defaultAudioSrc: DEFAULT_AUTO, // 音频来源
      isAutoplay: true, // 是否自动播放
      isCanPlay: false, // 是否能播放
    }
  },

  computed: {
    audioSrc() {
      let res = this.defaultAudioSrc // 默认系统提示音
      const {
        voiceRemindPendingConfirmType = -1, // 待确认声音类型0-女声1-男生-1系统
        voiceRemindOutstandingReceivablesType = -1, // 待收款声音类型0-女声1-男生-1系统
        voiceRemindPendingEndorseType = -1, // 待背书声音类型0-女声1-男生-1系统
        voiceRemindPendingSignInType = -1, // 锁票模式-待签收声音类型0-女声1-男生-1系统
        voiceRemindSignAndPayType = -1, // 待签付声音类型0-女声1-男生-1系统
        voiceRemindPendingRadarType = -1, // 自动自动接单成功声音类型 0-女声 1-男生,-1,系统默认
        voiceRemindPendingPayType = -1 // 待付款声音类型0-女声1-男生-1系统
      } = (this.remindSetting || {})

      // mqtt推送频道-交易订单刷新
      if (this.mqttData?.topicChannel === WEB_SOCKET_EVENT.ORDER_STATUS_REFRESH) {
        const {
          role, // 操作角色，1-接单方，2-持票方
          transactionStatus, // 交易状态，,11-未交易、12-待确认、13-待支付、14-支付中、15-待背书、16-待签付、17-校验中、18-交易完成、21-确认阶段持票方已取消、22-确认阶段接票方取消订单，23-确认阶段平台已取消、,24-支付阶段持票方已取消、25-支付阶段接单方已取消、26-支付阶段平台已取消、27-背书阶段持票方取消中、28-背书阶段持票方已取消、29-背书阶段平台已取消、30-签收阶段接单方取消中、,31-签收阶段接单方已取消、32签收阶段持票方已取消，33-签收阶段平台已取消
          radarType = 0, // 是否自动类型，0不是，1是
          fastTrade = 0, // 是否极速票，0不是，1是
          paymentChannel, // 渠道类型
        } = (this.mqttData || {})

        let orderType = 'DEFAULT' // 默认普通订单

        if (radarType === 1) {
          orderType = 'RADAR' // 自动订单
        }

        if (fastTrade === 1) {
          orderType = 'FAST' // 极速票
        }

        // 待确认
        if (transactionStatus === TRANSACTION_STATUS.WAITING_CONFIRM.id) {
          switch (voiceRemindPendingConfirmType) {
            case ORDER_AUTO.CONFIRM.MALE.id:
              res = ORDER_AUTO.CONFIRM.MALE[orderType]
              break
            case ORDER_AUTO.CONFIRM.FEMALE.id:
              res = ORDER_AUTO.CONFIRM.FEMALE[orderType]
              break
            default:
              res = this.defaultAudioSrc // 默认系统提示音
              break
          }
        }

        // 待收款
        if (transactionStatus === TRANSACTION_STATUS.CHECKING.id) {
          switch (voiceRemindOutstandingReceivablesType) {
            case ORDER_AUTO.RECEIPT.MALE.id:
              res = ORDER_AUTO.RECEIPT.MALE[orderType]
              break
            case ORDER_AUTO.RECEIPT.FEMALE.id:
              res = ORDER_AUTO.RECEIPT.FEMALE[orderType]
              break
            default:
              res = this.defaultAudioSrc // 默认系统提示音
              break
          }
        }

        // 待付款（原待支付）
        if (transactionStatus === TRANSACTION_STATUS.WAITING_PAY.id) {
          switch (voiceRemindPendingPayType) {
            case ORDER_AUTO.PAY.MALE.id:
              res = ORDER_AUTO.PAY.MALE[orderType]
              break
            case ORDER_AUTO.PAY.FEMALE.id:
              res = ORDER_AUTO.PAY.FEMALE[orderType]
              break
            default:
              res = this.defaultAudioSrc // 默认系统提示音
              break
          }
        }

        // // 定向票-待支付（接单方确认后持票方会收到消息，此时播放的是默认提示声音，其他交易环节正常）
        // if ((role === 2) && (transactionStatus === TRANSACTION_STATUS.CHECKING.id)) {
        //   res = this.defaultAudioSrc // 默认系统提示音
        // }

        // 票方 && 待背书 声音提示
        if (role === 2 && transactionStatus === TRANSACTION_STATUS.WAITING_ENDORSE.id) {
          switch (voiceRemindPendingEndorseType) {
            case ORDER_AUTO.ENDORSE.MALE.id:
              res = ORDER_AUTO.ENDORSE.MALE[orderType]
              break
            case ORDER_AUTO.ENDORSE.FEMALE.id:
              res = ORDER_AUTO.ENDORSE.FEMALE[orderType]
              break
            default:
              res = this.defaultAudioSrc // 默认系统提示音
              break
          }
        }

        // 待签付 || 待签收
        if (transactionStatus === TRANSACTION_STATUS.WAITING_SIGN.id) {
          // 根据渠道类型字段取 待签付 || 待签收 对应枚举字段名称
          const orderAutoField = paymentChannel === MARGIN_BANK_ACCOUNT.ZHI_PIAO_TONG_CHANNEL.id ? 'LOCK_SIGNIN' : 'SIGNIN'
          // 根据渠道类型字段取 待签付 || 待签收 对应声音类型字段
          const soundType = paymentChannel === MARGIN_BANK_ACCOUNT.ZHI_PIAO_TONG_CHANNEL.id ? voiceRemindPendingSignInType : voiceRemindSignAndPayType
          switch (soundType) {
            case ORDER_AUTO[orderAutoField].MALE.id:
              res = ORDER_AUTO[orderAutoField].MALE[orderType]
              break
            case ORDER_AUTO[orderAutoField].FEMALE.id:
              res = ORDER_AUTO[orderAutoField].FEMALE[orderType]
              break
            default:
              res = this.defaultAudioSrc // 默认系统提示音
              break
          }
        }
      }

      // mqtt推送频道-自动自动接单成功
      if (this.mqttData?.topicChannel === WEB_SOCKET_EVENT.BILL_ORDER_NEED_RULE_SUCCESS) {
        switch (voiceRemindPendingRadarType) {
          case ORDER_AUTO.RADAR.MALE.id:
            res = ORDER_AUTO.RADAR.MALE.DEFAULT
            break
          case ORDER_AUTO.RADAR.FEMALE.id:
            res = ORDER_AUTO.RADAR.FEMALE.DEFAULT
            break
          default:
            res = this.defaultAudioSrc // 默认系统提示音
            break
        }
      }

      return res || this.defaultAudioSrc
    },
  },

  methods: {
    // 播放音频
    play() {
      try {
        if (this.$refs.audio) {
          this.$refs.audio.src = this.audioSrc
          // eslint-disable-next-line no-console
          console.log('this.audioSrc', this.audioSrc)
          return this.$refs.audio.play()
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('播放音频error :>> ', error)
        return Promise.reject(error)
      }
    }
  },
}
</script>
