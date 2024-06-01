<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue'
import type { NoticeData, TabItemInfo } from '@/layout/notice/model'
import NoticeList from '@/layout/notice/NoticeList.vue'

const activeId = ref(0)

const noticeDataList = ref<NoticeData[]>([])
const msgList = ref<NoticeData[]>([])
const todoList = ref<NoticeData[]>([])

const handleHistory = () => {}

const tabsData: TabItemInfo[] = [
  { label: '通知', type: 'primary', list: noticeDataList },
  { label: '消息', type: 'danger', list: msgList },
  { label: '待办', type: 'warning', list: todoList }
]
</script>

<template>
  <el-popover trigger="click" :width="350">
    <template #reference>
      <div class="message-bell">
        <el-badge
          :value="0"
          :show-zero="false"
          :max="99"
          :offset="[-5, 0]"
          style="display: inline-flex"
        >
          <el-icon><Bell /></el-icon>
        </el-badge>
      </div>
    </template>

    <template #default>
      <el-tabs v-model="activeId" stretch>
        <el-tab-pane v-for="(item, index) in tabsData" :key="index" :name="index" lazy>
          <template #label>
            {{ item.label }}
            <el-badge
              :value="item.list.value?.length"
              :show-zero="false"
              :max="99"
              :type="item.type"
            />
          </template>
          <el-scrollbar height="38rem">
            <notice-list :list="item.list.value" />
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <div class="notify-history">
        <el-button link @click="handleHistory">查看{{ tabsData[activeId].label }}历史</el-button>
      </div>
    </template>
  </el-popover>
</template>

<style scoped>
.message-bell {
  --el-badge-size: 1.6rem;
}

.notify-history {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color);
}
</style>
