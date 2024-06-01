import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'

const pathResolve = (dir: string): string => {
  return path.resolve(__dirname, dir)
}

const alias: Record<string, string> = {
  '@': pathResolve('src')
}

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: { target: env.VITE_APP_API_TARGET_URL }
      }
    },
    base: env.VITE_PUBLIC_PATH,
    plugins: [
      vue(),
      vueJsx(),
      viteMockServe({
        enable: mode === 'development' && env.ENABLE_MOCK === 'true',
        ignore(fileName) {
          return fileName === 'utils.ts'
        }
      }),
      visualizer(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')]
      }),
      AutoImport({
        dts: 'src/types/auto-import.d.ts',
        imports: ['vue', 'vue-router'],
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: 'src/types/components.d.ts',
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
      })
    ],
    resolve: { alias },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element_ui.scss" as *;`
        }
      }
    }
  }
})
