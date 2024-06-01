<script setup lang="ts">
import { Picture as IconPicture } from '@element-plus/icons-vue'
const props = defineProps<{
  src?: string
  previewSrcList?: string[]
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  previewTeleported?: boolean
}>()

const loading = ref(true)

function onLoad() {
  loading.value = false
}

watch(
  () => props.src,
  () => {
    loading.value = !!props.src
  }
)
</script>

<template>
  <el-image
    loading="lazy"
    :src="src"
    :fit="fit ?? 'contain'"
    :preview-src-list="previewSrcList"
    :preview-teleported="previewTeleported"
    @load="onLoad"
    @error="loading = false"
    v-loading="!!src && loading"
  >
    <template #error>
      <div class="el-image__error" style="flex-direction: column">
        <el-icon :size="30"><icon-picture /></el-icon>
      </div>
    </template>
  </el-image>
</template>

<style scoped></style>
