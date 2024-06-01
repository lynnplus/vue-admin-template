<script setup lang="ts">
import type { Component, CSSProperties } from 'vue'

interface Props {
  src?: string
  alt?: string
  srcSet?: string
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  shape?: 'circle' | 'square'
  size?: '' | 'default' | 'small' | 'large'
  icon?: string | Component
  viewSize?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  fit: 'cover',
  shape: 'circle'
})

const emit = defineEmits<{
  (e: 'error', evt: Event): void
  (e: 'onload'): void
}>()

const hasLoadError = ref(false)
const imgLoading = ref(true)
const avatarClass = computed(() => {
  const { size, icon, shape } = props
  const classList = ['el-avatar']
  if (size) classList.push(`el-avatar--${size}`)
  if (icon) classList.push('el-avatar--icon')
  if (shape) classList.push(`el-avatar--${shape}`)
  return classList
})

const fitStyle = computed<CSSProperties>(() => ({
  objectFit: props.fit
}))

const avatarStyle = computed<CSSProperties>(() => {
  if (props.viewSize) {
    if (typeof props.viewSize === 'string') {
      return {
        '--el-avatar-size': props.viewSize
      }
    } else {
      return {
        '--el-avatar-size': props.viewSize + 'px'
      }
    }
  }
  return {}
})

watch(
  () => props.src,
  () => {
    hasLoadError.value = false
    imgLoading.value = true
  }
)

function handleError(e: Event) {
  hasLoadError.value = true
  imgLoading.value = false
  emit('error', e)
}

function onLoad() {
  imgLoading.value = false
  emit('onload')
}
</script>

<template>
  <span :class="avatarClass" v-loading="imgLoading" class="avatar-view" :style="avatarStyle">
    <img
      v-if="(src || srcSet) && !hasLoadError"
      :src="src"
      :alt="alt"
      :srcset="srcSet"
      :style="fitStyle"
      loading="lazy"
      @load="onLoad"
      @error="handleError"
    />
    <el-icon v-else-if="icon">
      <component :is="icon" />
    </el-icon>
    <slot v-else />
  </span>
</template>

<style scoped lang="scss">
@import 'element-plus/theme-chalk/el-avatar.css';
.avatar-view {
  --el-loading-spinner-size: calc(var(--el-avatar-size) / 2 + 1px);
  font-size: calc(var(--el-avatar-size) / 2 + 2px);
}
</style>
