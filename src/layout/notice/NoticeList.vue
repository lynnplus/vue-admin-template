<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import type { NoticeData } from '@/layout/notice/model'

const prop = defineProps<{
  list?: NoticeData[]
}>()
</script>

<template>
  <el-empty v-if="!list || list.length === 0" />
  <div v-else>
    <i v-for="(item, index) in list" :key="index">{{ item }}</i>
  </div>
</template>

<style scoped></style>
