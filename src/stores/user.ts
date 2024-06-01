import { defineStore } from 'pinia'
import { loginByAccount, type LoginRequest, requestUserInfo } from '@/api/account'
import type { UserInfo } from '@/api/model'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('token')
    const tokenExpireAt = ref('')
    const userInfo = ref<UserInfo>({})

    async function normalLogin(value: LoginRequest, isRemembered = false) {
      reset()
      const resp = await loginByAccount(value)
      token.value = resp.token
      tokenExpireAt.value = resp.expire_date
      userInfo.value = await requestUserInfo()
    }

    function reset() {
      token.value = ''
      tokenExpireAt.value = ''
      userInfo.value = {}
    }

    function validToken() {
      try {
        if (!token.value || !tokenExpireAt.value) {
          return false
        }
        const exp = new Date(tokenExpireAt.value)
        return new Date().getTime() < exp.getTime()
      } catch (e) {
        console.error(e)
        return false
      }
    }

    return {
      token,
      tokenExpireAt,
      userInfo,
      reset,
      normalLogin,
      validToken
    }
  },
  {
    persist: true
  }
)
