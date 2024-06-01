import 'axios'

export {}

declare module 'axios' {
  export type ResponseData<T> = {
    code: number
    msg?: string
    data?: T
  }

  export interface AxiosResponse {
    data: ResponseData
  }

  export interface AxiosRequestConfig {
    disableTransformResp?: boolean
    disableErrTip?: boolean
  }
}
