import Axios from 'axios'

// 创建axios请求实例
const request = Axios.create({
  baseURL: '',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

/**
 * config 自定义配置项
 * @param withoutCheck 不使用默认的接口状态校验，直接返回 response
 * @param returnOrigin 是否返回整个 response 对象，为 false 只返回 response.data
 * @param showError 全局错误时，是否使用统一的报错方式
 * @param canEmpty 传输参数是否可以为空
 * @param mock 是否使用 mock 服务
 * @param mockId mock 服务对应的项目 id
 * @param timeout 接口请求超时时间，默认10秒
 * @param isCancelRequest 是否可以取消请求
 */
const OPTIONS_DEFAULT = {
  showError: true,
  canEmpty: false,
  returnOrigin: false,
  withoutCheck: false,
  mock: false,
  timeout: 10000,
  isCancelRequest: true
}

// 请求前先缓存path,请求成功后再清除对应的path,避免重复发起请求
let requestList = []
// object对象存放每次new CancelToken生成的方法
let source = {}

/* 异常报错处理 */
const errorHandler = (error) => {
  return Promise.reject(error)
}

/* 请求拦截 */
request.interceptors.request.use((request) => {
  // 请求携带token,根据业务自行修改
  request.headers.token = ''
  return request
}, errorHandler)

/* 响应拦截 */
request.interceptors.response.use((res) => {
  // 获取请求的api
  const path = JSON.stringify(res.config.url)
  // 请求完成后，将此请求从请求列表中移除
  requestList = requestList.filter((item) => !path.includes(item))
  // 接口请求成功的code码
  const SUCCESS_CODE = [200]
  if (SUCCESS_CODE.includes(res.data.code)) {
    // 接口响应为请求成功
    if (res.config.returnOrigin) {
      return res
    }
    if (res.data && res.data !== 0) {
      return res.data.data
    } else {
      return res.data || {}
    }
  } else {
    /* 接口请求失败情况 */
    // token过期,退出登录
    const TOKEN_EXPIRED = '01002'
    if (res.data.code === TOKEN_EXPIRED) {
      // TODO-退出登录
    }

    return Promise.reject(res)
  }
}, errorHandler)

/* 定义取消方法 */
function cancelRequest(path, allCancel) {
  // 请求列表里存在此path，即发起重复请求，把之前的请求取消掉
  if (path && requestList.includes(path) && typeof source[path] === 'function') {
    source[path].abort()
    // source[path](`终止请求: ${path}`)
  } else if (!path && allCancel) {
    // allCancel为true则请求列表里的请求全部取消
    requestList.forEach((el) => {
      // source[el]('批量终止请求')
      source[el].abort()
    })
  }
}
/*统一封装请求方法 */
function httpRequest(method, path, data = {}, options = {}) {
  let opts = {
    ...OPTIONS_DEFAULT,
    ...options
  }

  // 取消上一次请求
  if (requestList.length) {
    cancelRequest(path)
  }
  // 设置isCancelRequest为ture, 请求前将path推入requestList
  if (opts.isCancelRequest) {
    requestList.push(path)
  }

  const abortController = new AbortController()
  source[path] = abortController

  if (method === 'post') {
    return request.post(path, data, {
      // cancelToken: new Axios.CancelToken((c) => {
      //   source[path] = c
      // }),
      signal: abortController.signal,
      ...opts
    })
  } else if (method === 'get') {
    return request.get(path, {
      params: data,
      // cancelToken: new Axios.CancelToken((c) => {
      //   source[path] = c
      // }),
      signal: abortController.signal,
      ...opts
    })
  }
}

// 导出请求方法
export const api = {
  get: (path, data, config) => httpRequest('get', path, data, config),
  post: (path, data, config) => httpRequest('post', path, data, config)
}

// 默认导出axios实例
export default request
