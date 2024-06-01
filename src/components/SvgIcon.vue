<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: string | number
    color?: string
    name?: string
    prefix?: string
  }>(),
  {
    prefix: 'icon'
  }
)

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<template>
  <el-icon :size="size" :color="color">
    <slot>
      <svg v-if="name" aria-hidden="true" class="svg-icon">
        <use :href="symbolId" />
      </svg>
      <span v-else>SVG</span>
    </slot>
  </el-icon>
</template>

<style scoped></style>
