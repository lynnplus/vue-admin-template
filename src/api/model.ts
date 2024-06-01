export type UserInfo = Partial<{
  nickname: string
  avatar: string
}>

export type PaginationData<T> = {
  total: number
  items: T[]
}

export type PaginationQuery = {
  page: number
  limit: number
}
