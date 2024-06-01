<script setup lang="ts">
import PageHeader from '@/layout/header/PageHeader.vue'
import SideBar from '@/layout/sidebar/SideBar.vue'
import { useElementSize } from '@vueuse/core'

const menuIsShow = ref(true)
const mainContent = ref()
const sidebarMenu = ref<InstanceType<typeof SideBar> | null>(null)
const contentSize = useElementSize(mainContent)

function toggleMenuCollapse() {
  sidebarMenu.value?.toggleMenu()
}
</script>

<template>
  <el-container class="app-container">
    <side-bar ref="sidebarMenu" v-model="menuIsShow" />
    <el-container>
      <el-header class="app-header">
        <page-header :show-menu="menuIsShow" @toggle-menu-collapse="toggleMenuCollapse" />
      </el-header>
      <el-main
        class="app-main"
        ref="mainContent"
        :style="{
          '--app-main-width': `calc(${contentSize.width.value + 'px'} - var(--app-main-padding) * 2)`,
          '--app-main-height': `calc(${contentSize.height.value + 'px'} - var(--app-main-padding) * 2)`
        }"
      >
        <router-view v-slot="{ Component, route }">
          <transition name="el-fade-in" mode="out-in">
            <keep-alive :include="[]">
              <el-scrollbar view-class="app-main-content_wrap">
                <component :is="Component" :key="route.path" />
              </el-scrollbar>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-container {
  height: 100%;
  position: relative;
}
</style>
