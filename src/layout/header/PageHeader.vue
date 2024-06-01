<script setup lang="ts">
import { CaretBottom, Expand, UserFilled } from '@element-plus/icons-vue'
import { useFullscreen } from '@vueuse/core'
import DarkSwitch from '@/layout/header/DarkSwitch.vue'
import BreadcrumbView from '@/layout/header/BreadcrumbView.vue'
import { useUserStore } from '@/stores/user'
import MessageBell from '@/layout/notice/MessageBell.vue'

defineProps<{
  showMenu: boolean
}>()

const fullscreen = useFullscreen()

const emit = defineEmits(['toggleMenuCollapse'])

const fullscreenIcon = computed(() =>
  fullscreen.isFullscreen.value ? 'exit_fullscreen' : 'fullscreen'
)

const userStore = useUserStore()
const router = useRouter()

async function exitLogin() {
  try {
    await ElMessageBox.confirm('确定退出系统登录?', '提示', { type: 'warning' })
    userStore.reset()
    await router.replace({ name: 'Login' })
  } catch (e) {
    if (e !== 'cancel') {
      console.error(e)
    }
  }
}
</script>

<template>
  <div style="height: 100%">
    <div class="hamburger-container header-icon-container" @click="emit('toggleMenuCollapse')">
      <el-icon class="menu-collapse-icon" :class="{ 'is-show': showMenu }">
        <Expand />
      </el-icon>
    </div>
    <div class="hamburger-container hidden-xs-only">
      <breadcrumb-view />
    </div>

    <div class="right-menu">
      <div class="dark-switch-container">
        <dark-switch />
      </div>

      <div
        class="fullscreen-container header-icon-container hidden-xs-only"
        @click="fullscreen.toggle"
      >
        <svg-icon :name="fullscreenIcon" />
      </div>

      <message-bell />

      <div class="avatar-container header-icon-container">
        <el-dropdown trigger="click">
          <span class="avatar-wrap">
            <avatar-view :icon="UserFilled" :src="userStore.userInfo.avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>账户设置</el-dropdown-item>

              <el-dropdown-item divided @click="exitLogin">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'element-plus/theme-chalk/display.css';

.header-icon-container {
  display: flex;
  align-items: center;
  height: 100%;
  transition: background 0.3s;
  cursor: pointer;
  padding: 0 15px;
  font-size: 2.5rem;
  &:hover {
    background: rgba(#000000, 0.025);
  }
}

.dark .header-icon-container:hover {
  background: rgba(#ffffff, 0.05);
}

.hamburger-container {
  display: flex;
  align-items: center;
  height: 100%;
  float: left;
}

.right-menu {
  float: right;
  display: flex;
  height: 100%;
  flex-direction: row;
  align-items: center;

  :deep(.message-bell) {
    @extend .header-icon-container;
    &:hover {
      background: rgba(#000000, 0.025);
    }
  }
}

.dark-switch-container {
  padding: 0 10px;
}

.avatar-container {
  margin-right: 2.5rem;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
}
.avatar-wrap {
  display: flex;
  align-items: flex-end;
}

.menu-collapse-icon {
  transition: transform 0.3s linear;
  &.is-show {
    transform: rotate(180deg);
  }
}
</style>
