import { MockConfig, MockMethod } from 'vite-plugin-mock'
import type { LoginRequest, LoginResp } from '../src/api/account'
import { mockGetData, mockPostData, ResponseError } from './utils'
import type { UserInfo } from '../src/api/model'
import { faker } from '@faker-js/faker/locale/zh_CN'
import { VerifyCode } from '../src/api/security'
import svgCaptcha from 'svg-captcha'
import dayjs from 'dayjs'

export default function (config: MockConfig): MockMethod[] {
  const cacheVerifyCode = {
    code: '',
    uuid: ''
  }

  return [
    mockGetData<any, VerifyCode>('/security/verify_code', config, () => {
      const captcha = svgCaptcha.createMathExpr({
        noise: 5,
        mathMin: 9,
        inverse: true,
        color: true,
        mathMax: 50,
        mathOperator: '+/-'
      })

      const uuid = svgCaptcha.randomText(8)
      cacheVerifyCode.code = captcha.text
      cacheVerifyCode.uuid = uuid
      return {
        data: captcha.data,
        uuid: uuid,
        code_type: 1
      }
    }),
    mockPostData<LoginRequest, LoginResp>('/account/login', config, ({ body }) => {
      if (body.code_uuid != cacheVerifyCode.uuid || body.verify_code != cacheVerifyCode.code) {
        throw new ResponseError(-1000, '验证码错误')
      }
      if (body.account != 'admin' || body.password != 'public') {
        throw new ResponseError(-1001, '账户或密码错误')
      }

      const now = dayjs()
      return { token: faker.string.alpha(32), expire_date: now.add(7, 'day').toISOString() }
    }),
    mockGetData<any, UserInfo>('/account/info', config, () => {
      return {
        nickname: faker.internet.userName(),
        avatar: faker.image.avatar()
      }
    })
  ]
}
