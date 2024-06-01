<script setup lang="ts">
import type { PaginationData, PaginationQuery } from '@/api/model'
import type { ElSortChangeEvent } from '@/types/element-ui'
import type { Sort } from 'element-plus'
import { useElementSize } from '@vueuse/core'
import { useMediaSizeQuery } from '@/composables/MediaSizeQuery'

defineProps<{
  listData: PaginationData<any>
  defaultSort?: Sort
  rowKey?: string | ((row: any) => string)
}>()

const emit = defineEmits<{
  (e: 'sortChange', data: ElSortChangeEvent): void
  (e: 'paginationChange'): void
}>()

const query = defineModel<PaginationQuery>('query', { required: true })
const paginationView = ref()
const paginationSize = useElementSize(paginationView)
const screenQuery = useMediaSizeQuery() //<=1023px
const pagerCount = computed(() => {
  if (screenQuery.value == 'xs') {
    return 4
  } else if (screenQuery.value == 'sm') {
    return 5
  } else {
    return 7
  }
})

const tableHeight = computed(() => {
  if (!paginationView.value) {
    return 'var(--app-main-height)'
  }
  const h = paginationSize.height.value
  return `calc(var(--app-main-height) - ${h + 'px'} - var(--app-main-padding) - 2px)`
})

const layout = computed(() => {
  if (screenQuery.value == 'xs') {
    return 'pager'
  } else {
    return 'total,sizes,prev,pager,next,jumper'
  }
})

onMounted(() => {
  emit('paginationChange')
})
</script>

<template>
  <div class="common-table-container">
    <el-table
      class="common-table"
      :row-key="rowKey"
      :data="listData.items"
      :max-height="tableHeight"
      :default-sort="defaultSort"
      :tooltip-options="{ showAfter: 1000, popperClass: 'table-overflow-tooltip' }"
      @sort-change="emit('sortChange', $event)"
    >
      <template #empty>
        <el-empty />
      </template>
      <slot />
    </el-table>
    <div ref="paginationView">
      <el-pagination
        class="table-pagination"
        :layout="layout"
        background
        :pager-count="pagerCount"
        :total="listData.total"
        v-model:page-size="query.limit"
        v-model:current-page="query.page"
        hide-on-single-page
        @update:page-size="emit('paginationChange')"
        @update:current-page="emit('paginationChange')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-pagination {
  margin-top: var(--app-main-padding);
  background: var(--el-pagination-bg-color);
  padding: 4px;
  box-shadow: var(--el-box-shadow-light);
  border-radius: 2px;
}
</style>
