import { httpGet } from '@/utils/request'
import type { PaginationData, PaginationQuery } from '@/api/model'

export type TestUser = {
  id: number
  name: string
  age: number
  email: string
  avatar: string
  remark: string
}

export function getUserList(query: PaginationQuery & any) {
  return httpGet<PaginationData<TestUser>>('/user/list', query)
}

export function getUserAvatarUrl() {
  return httpGet<string>('/user/avatar')
}
