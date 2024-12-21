import { api } from '@/utils/axios.js'

const commonApi = {
  // 获取用户信息
  /**
   * 
   * @param {*} body 
   * @returns 
   * {
   *  accessKey: "LTAI5tFjF4qaHfdGNBbEQSy1",
      expiration: "3600000",
      instanceId: "post-cn-gh63qm2hr01",
      token: '',
      topics: {broadcast:'',notice},
      url: 'post-cn-gh63qm2hr01.mqtt.aliyuncs.com'
   * } 
   */
  getApplyToken(body) {
    return api.post('/v3-admin/mqtt/getApplyToken', body, {
      mock: false
    })
  }
}

export default commonApi
