<script setup lang="ts">
import MenuItem from '@/layout/sidebar/MenuItem.vue'
import { navRoutes } from '@/router'

defineProps<{
  collapse: boolean
  collapseTransition: boolean
}>()

const route = useRoute()

const emit = defineEmits<{
  select: [index: string]
}>()

const activeMenu = computed(() => {
  const { path } = route
  return path
})

function onMenuSelect(index: string) {
  emit('select', index)
}
</script>

<template>
  <el-scrollbar>
    <el-menu
      class="sidebar-menu"
      style="border-right: none"
      mode="vertical"
      router
      @select="onMenuSelect"
      :default-active="activeMenu"
      :collapse="collapse"
      :collapse-transition="collapseTransition"
    >
      <menu-item v-for="item in navRoutes" :key="item.path" :data="item" parent-path="" />
    </el-menu>
  </el-scrollbar>
</template>

<style scoped></style>
