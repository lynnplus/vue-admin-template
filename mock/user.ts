import { MockConfig, MockMethod } from 'vite-plugin-mock'
import { mockGetData } from './utils'
import { PaginationData, PaginationQuery } from '../src/api/model'
import { TestUser } from '../src/api/table'
import { faker } from '@faker-js/faker/locale/zh_CN'

export default function (config: MockConfig): MockMethod[] {
  return [
    mockGetData<PaginationQuery, PaginationData<TestUser>>('/user/list', config, ({ query }) => {
      const arr: TestUser[] = []
      for (let i = 0; i < query.limit; i++) {
        arr.push({
          id: faker.number.int(),
          name: faker.person.fullName(),
          age: faker.number.int({ min: 15, max: 80 }),
          email: faker.internet.email(),
          avatar: i === 8 ? 'http://localhost:8174/api/account/image' : faker.image.avatar(),
          remark: faker.word.words(50)
        })
      }
      return { total: query.limit * 150, items: arr }
    })
  ]
}
