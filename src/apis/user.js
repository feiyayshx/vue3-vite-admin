import { api } from '@/utils/axios.js'

const userApi = {
  // 获取用户信息
  queryUserInfo(body) {
    return api.post('/v3-admin/getUserInfo', body, {
      mock: false
    })
  }
}

export default userApi
