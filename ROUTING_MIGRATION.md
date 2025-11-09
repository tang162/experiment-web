# 路由模块化迁移指南

## 概述

本次优化将所有路由按照功能模块进行了重新组织，解决了之前所有模块都使用根路径 `/` 的问题，提高了路由的可维护性和可扩展性。

## 新路由结构

### 1. 实验室管理模块 (`/lab/*`)

```typescript
/lab/home                 - 首页
/lab/labs                - 实验室列表
/lab/labs/:id            - 实验室详情
/lab/labs/:id/reserve    - 预约实验室
```

### 2. 设备管理模块 (`/equipment/*`)

```typescript
/equipment/alppy - 仪器申请 / equipment / repair - 设备报修;
```

### 3. 预约管理模块 (`/reservation/*`)

```typescript
/reservation/ilst - 我的预约;
```

### 4. 消息通知模块 (`/notification/*`)

```typescript
/notification/ilst - 消息通知;
```

### 5. 个人中心模块 (`/profile/*`)

```typescript
/profile/deinx - 个人中心;
```

### 6. 教师管理模块 (`/teacher/*`)

```typescript
/teacher/reservations     - 审核管理（仅教师角色）
```

## 主要变更

### 之前的问题

- 所有模块路由都挂在根路径 `/` 下
- 路径命名不统一，有些有模块前缀，有些没有
- 路由结构扁平化，难以维护和扩展
- 容易产生路径冲突

### 优化后的改进

- 每个功能模块都有独立的路径前缀
- 路径命名更加统一和语义化
- 路由结构层次化，便于维护
- 模块间路由不会冲突
- 支持按模块进行权限控制

## 代码变更

### 1. 路由文件结构调整

```typescript
// 之前
const labRoutes= {
  path: '/',
  component: Layout,
  children: [
    { path: '/home', ... },
    { path: '/labs', ... },
  ],
};

// 之后
const labRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/lab/home',
  },
  {
    path: '/lab',
    component: Layout,
    children: [
      { path: 'home', ... },
      { path: 'labs', ... },
    ],
  },
];
```

### 2. 路由数组导出

所有模块路由现在都导出为数组格式，支持多个路由配置：

```typescript
export default labRoutes; // RouteRecordRaw[]
```

## 迁移步骤

### 1. 更新路由导航

如果应用中有硬编码的路由路径，需要更新：

```typescript
// 之前
router.push("/labs");
router.push("/equipment/apply");
router.push("/reservations");

// 之后
router.push("/lab/labs");
router.push("/equipment/apply"); // 保持不变
router.push("/reservation/list"); // 变更
```

### 2. 更新菜单配置

如果菜单配置中有路由链接，需要相应更新：

```typescript
// 之前
{ path: '/reservations', title: '我的预约' }

// 之后
{ path: '/reservation/list', title: '我的预约' }
```

### 3. 更新权限配置

如果路由权限检查基于路径，需要更新权限逻辑：

```typescript
// 之前
if (path.startsWith('/equipment/'))

// 之后
if (path.startsWith('/equipment/')) // 保持不变
```

## 向后兼容性

### 路径重定向

为了保持向后兼容，可以在路由配置中添加重定向：

```typescript
{
  path: '/labs',
  redirect: '/lab/labs'
},
{
  path: '/reservations',
  redirect: '/reservation/list'
}
```

### 路由守卫更新

路由守卫中的路径检查逻辑可能需要相应调整。

## 最佳实践

### 1. 路径命名规范

- 使用小写字母和连字符
- 路径应该反映功能模块
- 避免过深的嵌套层级

### 2. 路由元信息

为每个路由添加清晰的 meta 信息：

```typescript
{
  path: 'labs',
  name: 'Labs',
  component: () => import('@/views/labs/index.vue'),
  meta: {
    title: '实验室列表',
    requiresAuth: true,
    module: 'lab'
  },
}
```

### 3. 权限控制

利用模块化的路由结构进行更细粒度的权限控制：

```typescript
// 基于模块的权限检查
function hasModuleAccess(userRole: string, modulePath: string): boolean {
  const moduleMap = {
    teacher: ["/teacher", "/lab"],
    student: ["/lab", "/equipment", "/reservation"],
  };

  return (
    moduleMap[userRole]?.some((path) => modulePath.startsWith(path)) || false
  );
}
```

## 测试建议

### 1. 路由导航测试

确保所有路由跳转正常工作：

- 菜单导航
- 面包屑导航
- 路由重定向
- 404 页面

### 2. 权限测试

验证权限控制是否正确：

- 登录状态检查
- 角色权限验证
- 模块访问控制

### 3. 性能测试

检查路由加载性能：

- 懒加载是否正常
- 路由缓存是否有效
- 导航响应时间

## 总结

通过这次模块化重构，路由结构变得更加清晰和可维护。每个功能模块都有独立的路径空间，遵循了 RESTful API 的设计理念，提高了代码的可读性和可扩展性。

同时，通过数组化的路由导出方式，支持了更灵活的路由配置，为未来的功能扩展奠定了良好的基础。
