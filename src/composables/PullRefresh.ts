import { useSwipe } from '@vueuse/core'
import type { MaybeRefOrGetter } from 'vue'

export type UsePullRefreshOptions = {
  threshold?: number
  maxLength?: number
  onRefresh?: () => void
}

export function usePullRefresh(
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  options?: UsePullRefreshOptions
) {
  const pulling = ref(false)
  const disabled = ref(false)

  const threshold = options?.threshold ?? 25
  const maxLength = options?.maxLength ?? 100
  const cacheY = ref(0)

  const { isSwiping, lengthY } = useSwipe(target, {
    threshold: 0,
    onSwipe() {
      if (disabled.value) {
        return
      }
      const y = translateY.value
      pulling.value = y >= threshold
    },
    onSwipeEnd() {
      if (pulling.value) {
        options?.onRefresh?.()
      }
      pulling.value = false
      cacheY.value = lengthY.value * -1
    }
  })

  watch(disabled, () => {
    if (!disabled.value && lengthY.value != 0) {
      cacheY.value = lengthY.value * -1
    }
  })

  const translateY = computed(() => {
    if (disabled.value) {
      return 0
    }
    let y = lengthY.value * -1
    y -= cacheY.value
    if (y <= 0) {
      y = 0
    }
    if (y >= maxLength) {
      y = maxLength
    }
    return y
  })

  return { translateY, pulling, disabled, isSwiping }
}
