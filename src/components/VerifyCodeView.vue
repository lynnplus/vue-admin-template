<script setup lang="ts">
import { getVerifyCode } from '@/api/security'
import { Refresh } from '@element-plus/icons-vue'

const verifyCodeIcon = ref<HTMLElement>()

const codeId = defineModel<string>({ required: true })
const loading = ref(false)

async function refreshCode() {
  loading.value = true
  try {
    const code = await getVerifyCode()
    codeId.value = code.uuid
    if (verifyCodeIcon.value) {
      verifyCodeIcon.value.innerHTML = code.data
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshCode()
})

defineExpose({ refreshCode })
</script>

<template>
  <div class="verify-code" v-loading="loading" @click="refreshCode()">
    <i ref="verifyCodeIcon" class="verify-code_icon" />
    <el-icon v-if="!loading" class="verify-code_refresh" size="2rem"><Refresh /></el-icon>
  </div>
</template>

<style scoped lang="scss">
.verify-code {
  position: relative;
  :deep(.el-loading-mask) {
    --el-loading-spinner-size: 2.8rem;
  }
}

.verify-code:hover {
  .verify-code_refresh {
    color: var(--el-color-primary);
    opacity: 1;
  }
}

.verify-code_refresh {
  z-index: 0;
  position: absolute;
  transition: opacity 0.3s;
  cursor: pointer;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  background: var(--el-mask-color);
}

.verify-code_icon {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}
</style>
