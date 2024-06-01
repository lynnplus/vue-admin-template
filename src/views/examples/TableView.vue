<script setup lang="ts">
import type { PaginationData, PaginationQuery } from '@/api/model'
import { getUserList, type TestUser } from '@/api/table'
import type { ElSortChangeEvent, ElTableColumnItem } from '@/types/element-ui'
import type { Sort } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'

const query = reactive<PaginationQuery>({
  limit: 10,
  page: 1
})

const loading = ref(false)

const data = ref<PaginationData<TestUser>>({
  total: 0,
  items: []
})

async function loadData() {
  loading.value = true
  try {
    data.value = await getUserList(toRaw(query))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function sortChange(evt: ElSortChangeEvent<TestUser>) {
  console.debug(evt)
}

//order: 'ascending' | 'descending';
const sort: Sort = { prop: 'id', order: 'ascending' }

type ColumnItem = ElTableColumnItem<TestUser>
</script>

<template>
  <div v-loading="loading">
    <common-table
      v-model:query="query"
      :list-data="data"
      :default-sort="sort"
      @sort-change="sortChange"
      @pagination-change="loadData"
    >
      <el-table-column prop="id" label="ID" sortable="custom" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="age" label="Age" sortable="custom" />
      <el-table-column prop="remark" label="Remark" show-overflow-tooltip />
      <el-table-column prop="avatar" label="Avatar" align="center" class-name="avatar-column">
        <template #default="{ row }: ColumnItem">
          <avatar-view
            class="table-column-avatar"
            :src="row.avatar"
            :icon="UserFilled"
            view-size="3rem"
          />
        </template>
      </el-table-column>
    </common-table>
  </div>
</template>

<style>
.avatar-column .cell {
  display: flex;
}
</style>

<style scoped></style>
