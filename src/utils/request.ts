import axios, { type AxiosRequestConfig, type ResponseData } from 'axios'

export class ResponseError extends Error {
  readonly code: number
  constructor(from: ResponseData<any>) {
    super(from.msg ?? 'response error')
    this.code = from.code
  }
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
})

instance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response) {
    const { data, config } = response

    if (config.disableTransformResp) {
      return data
    }
    if (response.data.code !== 0) {
      console.debug(response.data)
      const err = new ResponseError(response.data)
      if (!config.disableErrTip) {
        showErrorMessageTip(err)
      }
      return Promise.reject(err)
    }
    return data.data
  },
  function (error) {
    if (error.response) {
      error.message = convertStatusToMessage(error.response.status)
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      error.message = '请求超时 ECONNABORTED'
    }
    showErrorMessageTip(error)
    return Promise.reject(error)
  }
)

function showErrorMessageTip(err: Error) {
  ElMessage({
    showClose: true,
    message: err.message || 'Error',
    grouping: true,
    type: 'error'
  })
}

function convertStatusToMessage(status: number) {
  switch (status) {
    case 400:
      return '请求错误(400)'
    case 401:
      return '未授权，请重新登录(401)'
    case 403:
      return '拒绝访问(403)'
    case 404:
      return '请求出错(404)'
    case 408:
      return '请求超时(408)'
    case 500:
      return '服务器错误(500)'
    case 501:
      return '服务未实现(501)'
    case 502:
      return '网络错误(502)'
    case 503:
      return '服务不可用(503)'
    case 504:
      return '网络超时(504)'
    case 505:
      return 'HTTP版本不受支持(505)'
    default:
      return `HTTP错误(${status})`
  }
}

export function httpGet<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return instance.get<any, T, any>(url, { params, ...config })
}

export function httpPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return instance.post(url, data, config)
}
