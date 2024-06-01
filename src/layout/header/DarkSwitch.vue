<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const toggleDarkModel = ref(isDark.value)

function toggle() {
  toggleDark()
  toggleDarkModel.value = !toggleDarkModel.value
}

const toggleTheme = (event: MouseEvent) => {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  // @ts-ignore
  if (!document.startViewTransition) {
    toggle()
    return
  }
  const toDarkMode = !isDark.value
  // @ts-ignore
  const transition = document.startViewTransition(async () => {
    toggle()
  })

  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: toDarkMode ? [...clipPath].reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: toDarkMode ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
  })
}

function change() {
  return false
}
</script>

<template>
  <el-switch
    class="header-dark-switch"
    v-model="toggleDarkModel"
    @click="toggleTheme"
    :before-change="change"
  >
    <template #active-action>
      <svg-icon class="dark-switch_icon" name="moon" size="1.6rem" />
    </template>
    <template #inactive-action>
      <svg-icon class="dark-switch_icon" name="sun" />
    </template>
  </el-switch>
</template>

<style scoped>
.header-dark-switch:hover {
  --el-switch-border-color: var(--el-color-primary);
}

.dark .header-dark-switch {
  --el-switch-on-color: #2c2c2c;
  --el-switch-off-color: #2c2c2c;
  --el-switch-border-color: var(--el-border-color);
  &:hover {
    --el-switch-border-color: var(--el-color-primary);
  }
}

.dark-switch_icon {
  color: #606266;
}
.dark .dark-switch_icon {
  border-radius: 50%;
  color: #cfd3dc;
  background-color: #141414;
}
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}

.dark::view-transition-old(root) {
  z-index: 9999;
}

.dark::view-transition-new(root) {
  z-index: 1;
}
</style>
