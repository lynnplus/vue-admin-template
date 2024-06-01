import { MethodType, MockConfig, MockMethod, Recordable } from 'vite-plugin-mock'

export type ResponseData<T> = {
  code: number
  msg?: string
  data?: T
}

export class ResponseError extends Error {
  readonly code: number
  constructor(code: number, msg: string) {
    super(msg ?? 'response error')
    this.code = code
  }
}

export class RespData<T> implements ResponseData<T> {
  readonly code: number
  readonly msg?: string
  readonly data?: T

  constructor(value: T, code?: number, msg?: string) {
    if (code === undefined || code === 0) {
      this.data = value
      this.code = 0
    } else {
      this.code = code ?? -1
      this.msg = msg ?? 'error'
    }
  }
}

export type HandlerOpts<T> = {
  url: Recordable
  headers: Recordable
  query?: T | Recordable
  body?: T | Recordable
}

type MockHandler<T, D> = (opts: HandlerOpts<T>, config: MockConfig) => D

export function mockPostData<T = any, D = any>(
  url: string,
  config: MockConfig,
  handler: MockHandler<T, D>,
  delay = 1000
): MockMethod {
  return mockInvoke<D>(url, 'post', delay, config, handler)
}

export function mockGetData<T = any, D = any>(
  url: string,
  config: MockConfig,
  handler: MockHandler<T, D>,
  delay = 1000
): MockMethod {
  return mockInvoke<D>(url, 'get', delay, config, handler)
}

function mockInvoke<D>(
  url: string,
  method: MethodType,
  timeout: number,
  config: MockConfig,
  handler: MockHandler<any, D>
): MockMethod {
  return {
    url: config.env.VITE_APP_BASE_API + url,
    method: method,
    timeout: timeout,
    response: (opt) => {
      try {
        const d = handler(opt, config)
        return new RespData(d)
      } catch (e) {
        if (e instanceof ResponseError) {
          return new RespData(null, e.code, e.message)
        }
        console.debug(e)
        return new RespData(null, -1, e.message)
      }
    }
  }
}
