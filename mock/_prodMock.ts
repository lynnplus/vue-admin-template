import type { MockConfig } from 'vite-plugin-mock'
import { createProdMockServer } from 'vite-plugin-mock/client'
import account from './account'
import user from './user'

const config: MockConfig = {
  env: import.meta.env,
  mode: import.meta.env.MODE,
  command: 'build'
}

type MockMod = (opt: MockConfig) => any[]

function loadMockModule(...mods: MockMod[]): any[] {
  const r: any[] = []
  mods.forEach((mod) => {
    r.push(...mod(config))
  })
  return r
}

export function loadMockServer() {
  return createProdMockServer(loadMockModule(account, user))
}
