<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

const prop = defineProps<{
  data: RouteRecordRaw
  parentPath: string
}>()

const isShow = computed(() => {
  if (prop.data.children && prop.data.children.length === 1) {
    const child = prop.data.children[0]
    return !(!child.meta || child.meta.hidden)
  }
  return !(!prop.data.meta || prop.data.meta.hidden)
})

const isSubMenu = computed(() => {
  if (!prop.data.children || prop.data.children.length === 0) {
    return false
  }
  if (prop.data.children.length === 1) {
    if (!prop.data.children[0].path) {
      return false
    }
  }
  return true
})

const current = computed(() => {
  if (prop.data.children && prop.data.children.length === 1) {
    const child = prop.data.children[0]
    if (!child.path) {
      return { title: child.meta?.title, icon: child.meta?.icon, path: getCurrentFullPath() }
    }
  }
  return { title: prop.data.meta?.title, icon: prop.data.meta?.icon, path: getCurrentFullPath() }
})

function getCurrentFullPath() {
  let path = prop.data.path
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  return prop.parentPath + path
}
</script>

<template>
  <template v-if="isShow">
    <el-sub-menu v-if="isSubMenu" :index="current.path">
      <template #title>
        <el-icon>
          <svg-icon :name="current.icon ?? 'logo'" />
        </el-icon>
        <span>{{ current.title }}</span>
      </template>
      <template v-for="item in data.children" :key="item.path">
        <menu-item :data="item" :parent-path="current.path" />
      </template>
    </el-sub-menu>
    <el-menu-item v-else :index="current.path">
      <el-icon>
        <svg-icon :name="current.icon ?? 'logo'" />
      </el-icon>
      <template #title>
        <span>{{ current.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<style scoped></style>
