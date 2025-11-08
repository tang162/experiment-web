/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  // 更多环境变量...
}

// 环境变量的类型扩展
interface ImportMeta {
  readonly env: ImportMetaEnv
}
