<script setup lang="ts">
import { getUserList, type TestUser } from '@/api/table'
import type { PaginationData, PaginationQuery } from '@/api/model'

const query = reactive<PaginationQuery>({
  limit: 10,
  page: 0
})

const data = ref<PaginationData<TestUser>>({
  total: -1,
  items: []
})

async function loadData() {
  try {
    const d = Object.assign({}, toRaw(query))
    d.page++
    const { total, items } = await getUserList(d)
    if (items && items.length > 0) {
      query.page++
      data.value.items.push(...items)
      data.value.total = total
      console.debug('total', total)
    }
  } catch (e) {
    console.error(e)
  }
}

function onPullRefresh() {
  query.page = 0
  data.value = {
    total: -1,
    items: []
  }
}
</script>

<template>
  <div class="flex-grid-container">
    <flex-grid
      item-key="id"
      :data="data"
      :load-method="loadData"
      :xl="6"
      :lg="{ num: 4, gutter: 8 }"
      :md="3"
      :sm="2"
      :xs="1"
      justify="space-evenly"
      @refresh="onPullRefresh"
    >
      <template #default="{ item }: { item: TestUser }">
        <el-card class="user-card" shadow="hover">
          <image-view :src="item.avatar" class="avatar" />
          <div class="userinfo">
            <el-text class="name">{{ item.name }}</el-text>
            <el-text truncated type="info" class="email">{{ item.email }}</el-text>
          </div>
        </el-card>
      </template>
    </flex-grid>
  </div>
</template>

<style scoped lang="scss">
.flex-grid-container {
  height: var(--app-main-height);
  overflow: hidden;
}
.user-card {
  margin-bottom: 10px;

  :deep(.el-card__body) {
    display: flex;
  }

  .userinfo {
    flex: 1;
    width: 0;
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    span {
      align-self: start;
    }
  }
}

.avatar {
  flex-shrink: 0;
  width: 110px;
  height: 100px;
}

.name {
  font-size: 15px;
  margin-bottom: 5px;
}
</style>
