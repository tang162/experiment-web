// 为Vue文件声明模块
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 为SCSS文件声明模块
declare module '*.scss' {
  const content: any
  export default content
}

// 为CSS文件声明模块
declare module '*.css' {
  const content: any
  export default content
}
