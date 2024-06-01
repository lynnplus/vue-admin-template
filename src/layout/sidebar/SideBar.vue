<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import SideBarMenu from '@/layout/sidebar/SideBarMenu.vue'

const showMenu = defineModel<boolean>({ required: true })

const isFloatingMenu = useMediaQuery('(max-width: 1023px)') //<=1023px
const hasMenuSpace = useMediaQuery('(min-width: 1250px)') //>=1250
const menuCollapse = ref(!hasMenuSpace.value)
const menuFloatShow = ref(false)

onMounted(() => {
  updateState()
})

watch(isFloatingMenu, () => {
  if (!isFloatingMenu.value) {
    menuCollapse.value = true
  }
  updateState()
})
watch(hasMenuSpace, () => {
  menuCollapse.value = !hasMenuSpace.value
  updateState()
})

function toggleMenu() {
  if (isFloatingMenu.value) {
    menuFloatShow.value = !menuFloatShow.value
    updateState()
    return
  }
  menuCollapse.value = !menuCollapse.value
  updateState()
}

function clickMenuOutside() {
  if (!isFloatingMenu.value) {
    return
  }
  menuFloatShow.value = false
  updateState()
}

function updateState() {
  if (isFloatingMenu.value) {
    menuCollapse.value = false
    showMenu.value = menuFloatShow.value
  } else {
    showMenu.value = !menuCollapse.value
  }
}

function onMenuSelected() {
  menuFloatShow.value = false
  updateState()
}

defineExpose({
  toggleMenu
})
</script>

<template>
  <transition name="el-fade-in-linear">
    <el-overlay
      z-index="1000"
      v-if="isFloatingMenu && menuFloatShow"
      @click="clickMenuOutside"
    ></el-overlay>
  </transition>

  <teleport :disabled="!isFloatingMenu" to="body">
    <el-aside
      class="app-aside"
      :class="{ 'is-mini-screen': isFloatingMenu, 'is-show': menuFloatShow }"
    >
      <div class="logo-container"><svg-icon name="logo" size="4rem" /></div>
      <side-bar-menu
        class="aside_sidebar"
        @select="onMenuSelected"
        :collapse="menuCollapse"
        :collapse-transition="!isFloatingMenu"
      />
    </el-aside>
  </teleport>
</template>

<style scoped></style>
