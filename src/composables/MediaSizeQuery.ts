import { defaultWindow, tryOnScopeDispose, useSupported } from '@vueuse/core'

export const mediaSizeNames = ['xs', 'sm', 'md', 'lg', 'xl']
const mediaSizeQueryList: { [key: string]: string } = {
  xs: '(max-width: 767px)',
  sm: '(min-width: 768px) and (max-width: 991px)',
  md: '(min-width: 992px) and (max-width: 1199px)',
  lg: '(min-width: 1200px) and (max-width: 1919px)',
  xl: '(min-width: 1920px)'
}

export type MediaSizeName = (typeof mediaSizeNames)[number] | ''

export function useMediaSizeQuery() {
  const window = defaultWindow
  const isSupported = useSupported(
    () => window && 'matchMedia' in window && typeof window.matchMedia === 'function'
  )

  const querys = new Map<
    string,
    { tgt?: MediaQueryList; query: string; handler?: (event: MediaQueryListEvent) => void }
  >()
  mediaSizeNames.forEach((name) => {
    querys.set(name, { query: mediaSizeQueryList[name] })
  })

  const matches = ref<MediaSizeName>('')

  const cleanup = () => {
    querys.forEach((v) => {
      if (!v.tgt || !v.handler) {
        return
      }
      if ('removeEventListener' in v.tgt) v.tgt.removeEventListener('change', v.handler)
      // @ts-expect-error deprecated API
      else mediaQuery.removeListener(v.handler)
      v.tgt = undefined
    })
  }

  const stopWatch = watchEffect(() => {
    if (!isSupported.value) return

    cleanup()

    querys.forEach((v, n) => {
      v.tgt = window!.matchMedia(v.query)
      v.handler = (eve: MediaQueryListEvent) => {
        if (eve.matches) {
          matches.value = n
        }
      }
      if ('addEventListener' in v.tgt) v.tgt.addEventListener('change', v.handler)
      // @ts-expect-error deprecated API
      else v.tgt.addListener(v.handler)

      if (v.tgt.matches) {
        matches.value = n
      }
    })
  })

  tryOnScopeDispose(() => {
    stopWatch()
    cleanup()
    querys.clear()
  })

  return matches
}
