import { httpGet, httpPost } from '@/utils/request'
import type { UserInfo } from '@/api/model'

export type LoginRequest = {
  account: string
  password: string
  verify_code: string
  code_uuid: string
}

export type LoginResp = {
  token: string
  expire_date: string
}

export function loginByAccount(data: LoginRequest) {
  return httpPost<LoginResp>('/account/login', data)
}

export function refreshToken(data: LoginResp) {
  return httpPost<LoginResp>('/account/refresh_token', data)
}

export function requestUserInfo() {
  return httpGet<UserInfo>('/account/info')
}
