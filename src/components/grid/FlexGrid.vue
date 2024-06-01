<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { PaginationData } from '@/api/model'
import { useMediaSizeQuery } from '@/composables/MediaSizeQuery'
import { usePullRefresh } from '@/composables/PullRefresh'

export type FlexGridCol = {
  num: number
  gutter?: number | string
}

type Props = {
  itemKey: string
  data?: PaginationData<any>
  xs?: number | FlexGridCol
  sm?: number | FlexGridCol
  md?: number | FlexGridCol
  lg?: number | FlexGridCol
  xl?: number | FlexGridCol
  gutter?: number | string
  rowTag?: string
  colTag?: string
  justify?: 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly'
  loadMethod: () => Promise<void>
}

const props = withDefaults(defineProps<Props>(), {
  rowTag: 'div',
  colTag: 'div'
})
const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const root = ref<HTMLElement>()
const refresher = usePullRefresh(root, { onRefresh: refresh })

const pullStyle = computed(() => {
  const styles: CSSProperties = {}
  let y = refresher.translateY.value
  if (!refresher.pulling.value) {
    return styles
  }
  const scale = Math.min(y / 50, 1)
  styles.transform = `translateY(${-y / 2}px)  scale(${scale})`
  styles.opacity = scale
  return styles
})

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

const matchedSizeName = useMediaSizeQuery()

function getColNum(v?: number | FlexGridCol) {
  if (!v) {
    return 0
  }
  if (typeof v === 'number') {
    return Number(v)
  }
  return v.num
}

const maxColumns = computed(() => {
  let n = 0
  sizes.forEach((size) => {
    n = Math.max(n, getColNum(props[size]))
  })
  return n
})

const colKls = computed(() => {
  const classes: string[] = []
  sizes.forEach((size) => {
    if (props[size] != undefined) {
      classes.push(`flex-grid-col-${size}-${getColNum(props[size])}`)
    }
  })
  return [classes]
})

function getGutterValue(v?: number | string) {
  if (!v) {
    return ''
  }
  if (typeof v === 'number') {
    return `${v / 2}px`
  }
  return `calc(${v} / 2)`
}

const rowStyle = computed(() => {
  const styles: CSSProperties = {}
  if (props.justify && props.justify != 'start') {
    styles.justifyContent = props.justify
  }
  styles.transform = `translateY(${refresher.translateY.value}px)`
  return styles
})

const colStyle = computed(() => {
  const styles: CSSProperties = {}
  const name = matchedSizeName.value
  if (name == '') {
    styles.paddingLeft = styles.paddingRight = getGutterValue(props.gutter)
    return styles
  }

  let gt = ''
  sizes.find((v) => {
    if (props[v] && !(typeof props[v] === 'number')) {
      const m = props[v] as FlexGridCol
      const temp = getGutterValue(m.gutter)
      if (temp != '') {
        gt = temp
      }
    }
    return v === name
  })

  if (gt === '') {
    gt = '0'
  }
  styles.paddingLeft = styles.paddingRight = gt
  return styles
})

const stopLoad = ref(false)

function refresh() {
  emit('refresh')
  loadData()
}

async function loadData() {
  refresher.disabled.value = true
  loading.value = true
  try {
    await props.loadMethod()
  } catch (e) {
    if (!props.data || props.data.total <= 0) {
      stopLoad.value = true
    }
    console.error(e)
  } finally {
    refresher.disabled.value = false
    loading.value = false
  }
}

const disableLoad = computed(() => {
  if (loading.value || stopLoad.value) {
    return true
  }
  return props.data && props.data.total > 0 && props.data.total <= props.data.items.length
})

const loading = ref(false)

onMounted(() => {
  loadData()
})

function onScroll(v: { scrollTop: number; scrollLeft: number }) {
  refresher.disabled.value = v.scrollTop != 0 && refresher.translateY.value <= 0
}
</script>

<template>
  <el-scrollbar @scroll="onScroll">
    <component
      ref="root"
      :is="rowTag"
      type="flex"
      v-infinite-scroll="loadData"
      :infinite-scroll-disabled="disableLoad"
      v-if="data && data.total > 0"
      :style="rowStyle"
      class="flex-grid"
    >
      <el-text
        v-if="refresher.pulling.value"
        :style="pullStyle"
        style="display: flex; justify-content: center; width: 100%; position: absolute; top: 0"
        >松开即可刷新</el-text
      >
      <transition-group name="el-fade-in-linear">
        <component
          :is="colTag"
          :class="colKls"
          v-for="(item, index) in data.items"
          :key="item[itemKey]"
          class="flex-grid__col"
          :style="colStyle"
        >
          <slot v-bind="{ item, index }" />
        </component>
      </transition-group>

      <i
        v-for="i in maxColumns"
        :key="i"
        :class="colKls"
        :style="colStyle"
        class="flex-grid__col"
        style="height: 0"
      />
      <div
        class="more-loading"
        :style="colStyle"
        v-if="loading"
        v-loading="true"
        element-loading-text="加载中"
      ></div>
    </component>
    <el-empty v-else v-loading="loading" />
  </el-scrollbar>
</template>

<style lang="scss">
@use 'sass:math';
@use '@/styles/mixin' as *;

@mixin flex-grid-col-size($size) {
  @include screen_size($size) {
    @for $i from 0 through 10 {
      .flex-grid-col-#{$size}-#{$i} {
        display: if($i == 0, none, block);
        @if $i==0 {
          max-width: 0;
          flex: 0 0 0;
        } @else {
          max-width: math.div(100, $i) * 1%;
          flex: 0 0 math.div(100, $i) * 1%;
        }
      }
    }
  }
}

@each $s in $screen_size_preset {
  @include flex-grid-col-size($s);
}

.flex-grid {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  box-sizing: border-box;
}
.flex-grid__col {
  min-height: 0;
}
.more-loading {
  --el-loading-spinner-size: 25px;
  height: 45px;
  width: 100%;

  .el-loading-mask {
    height: 100%;
    position: relative;
  }

  .el-loading-spinner {
    display: inline-flex;
    justify-content: center;
    .el-loading-text {
      margin: 3px 5px;
    }
  }
}
</style>
