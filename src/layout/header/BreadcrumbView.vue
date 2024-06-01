<script setup lang="ts">
import type { RouteLocationMatched } from 'vue-router'

const route = useRoute()
const breadcrumbs = ref([] as Array<RouteLocationMatched>)

watch(
  () => route.path,
  () => {
    breadcrumbs.value = route.matched.filter((item) => item.meta && item.meta.title)
  },
  { immediate: true }
)
</script>

<template>
  <el-breadcrumb separator="/" style="margin-left: 10px">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path"
        >{{ item.meta.title }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style scoped></style>
