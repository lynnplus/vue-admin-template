import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'
import router from './router'
import '@/styles/index.scss'
import 'virtual:svg-icons-register'

const app = createApp(App)

app
  .use(createPinia().use(piniaPluginPersistedstate))
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .mount('#app')
