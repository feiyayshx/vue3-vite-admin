import Mock from 'mockjs'
import { menuList, followUserInfo } from '/mock/data/user.js'
const responseData = (code, msg, data) => {
  return {
    code: code,
    msg: msg,
    data: data
  }
}

Mock.mock('/v3-admin/getUserInfo', responseData(200, '请求成功', menuList))
Mock.mock('/v3-admin/followUserInfo', responseData(200, '请求成功', followUserInfo))
