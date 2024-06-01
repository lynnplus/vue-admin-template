<script setup lang="ts">
import { type FormInstance, type FormRules } from 'element-plus'
import { Key as KeyIcon, Lock, User, WarningFilled } from '@element-plus/icons-vue'
import { type LoginRequest } from '@/api/account'
import { useUserStore } from '@/stores/user'
import type VerifyCodeView from '@/components/VerifyCodeView.vue'
import { ResponseError } from '@/utils/request'

const loginForm = ref<FormInstance>()
const verifyCodeInstance = ref<InstanceType<typeof VerifyCodeView>>()

const loginData = reactive<LoginRequest>({
  account: 'admin',
  password: 'public',
  verify_code: '',
  code_uuid: ''
})

const userStore = useUserStore()
const loading = ref(false)
const isRemembered = ref(false)
const router = useRouter()
const route = useRoute()
const title = import.meta.env.VITE_APP_TITLE

const rules: FormRules<typeof loginData> = {
  account: [{ required: true, message: '请输入账户', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  verify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

async function submitLoginForm() {
  if (!loginForm.value) {
    return
  }
  loading.value = true
  try {
    const valid = await loginForm.value.validate()
    if (!valid) {
      return
    }
    await userStore.normalLogin(toRaw(loginData), isRemembered.value)
    await router.replace(getRedirect() ?? '/')
  } catch (e) {
    console.error(e)
    if (e instanceof ResponseError) {
      verifyCodeInstance.value?.refreshCode()
    }
  } finally {
    loading.value = false
  }
}

function getRedirect(): string | undefined {
  const value = route.query['redirect']
  if (!value) {
    return
  }
  return decodeURIComponent(value.toString())
}
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <svg-icon name="logo" size="6rem" />
      <span style="margin: 2rem">{{ title }}</span>
      <el-form
        ref="loginForm"
        v-loading="loading"
        element-loading-text="登录中..."
        :model="loginData"
        status-icon
        :rules="rules"
        @keydown.enter="submitLoginForm()"
      >
        <el-form-item prop="account">
          <el-input
            size="large"
            v-model="loginData.account"
            :prefix-icon="User"
            clearable
            placeholder="账号"
            autocomplete="on"
            autofocus
            tabindex="1"
            type="text"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            size="large"
            v-model="loginData.password"
            clearable
            placeholder="密码"
            show-password
            autocomplete="off"
            :prefix-icon="Lock"
            tabindex="2"
            type="password"
          />
        </el-form-item>

        <el-form-item prop="verify_code">
          <el-input
            size="large"
            class="verify-code-input"
            v-model="loginData.verify_code"
            type="text"
            tabindex="3"
            placeholder="验证码"
            clearable
            :prefix-icon="KeyIcon"
          >
            <template #append>
              <verify-code-view
                ref="verifyCodeInstance"
                class="verify-code-img"
                v-model="loginData.code_uuid"
              />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div
            style="display: flex; align-items: center; justify-content: space-between; width: 100%"
          >
            <el-checkbox tabindex="4" v-model="isRemembered">
              <span style="display: flex; align-items: center">
                7天内免登录
                <el-tooltip
                  effect="light"
                  placement="top"
                  content="勾选并登录后，规定天数内无需输入用户名和密码会自动登入系统"
                >
                  <el-icon style="margin-left: 0.25rem"><WarningFilled /></el-icon> </el-tooltip
              ></span>
            </el-checkbox>
            <el-button link type="primary">忘记密码？</el-button>
          </div>
          <el-button class="login-btn" tabindex="5" type="primary" @click="submitLoginForm()">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 36rem;
}

.verify-code-input {
  height: var(--el-input-height);
  overflow: hidden;

  :deep(.el-input__suffix) {
    position: absolute;
    right: 15px;
  }
  :deep(.el-input-group__append) {
    padding: 0;
  }
}

.verify-code-img {
  overflow: hidden;
  width: 12rem;
  height: 100%;

  :deep(.verify-code_refresh) {
    border-radius: var(--el-input-border-radius);
    box-shadow:
      0 1px 0 0 var(--el-input-border-color) inset,
      0 -1px 0 0 var(--el-input-border-color) inset,
      -1px 0 0 0 var(--el-input-border-color) inset;
  }
}

.login-btn {
  width: 100%;
  margin-top: 1rem;
}
</style>
