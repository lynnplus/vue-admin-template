import type { MockConfig, MockMethod } from 'vite-plugin-mock'
import { mockGetData } from './_utils'
import type { PaginationData, PaginationQuery } from '@/api/model'
import type { TestUser } from '@/api/table'
import { faker } from '@faker-js/faker/locale/zh_CN'

export default function (config: MockConfig): MockMethod[] {
  return [
    mockGetData<PaginationQuery, PaginationData<TestUser>>('/user/list', config, ({ query }) => {
      const arr: TestUser[] = []
      for (let i = 0; i < query?.limit; i++) {
        arr.push({
          id: faker.number.int(),
          name: faker.person.fullName(),
          age: faker.number.int({ min: 15, max: 80 }),
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          remark: faker.word.words(50)
        })
      }
      return { total: query?.limit * 150, items: arr }
    })
  ]
}
