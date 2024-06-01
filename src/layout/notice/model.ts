import type { Ref } from 'vue'

export type NoticeData = {
  msg: string
}

export type TabItemInfo = {
  label: string
  type: 'success' | 'warning' | 'info' | 'primary' | 'danger'
  list: Ref<NoticeData[] | undefined>
}
