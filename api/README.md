# 高校实验室预约管理系统 API 接口文档

## 概述

本项目采用模块化设计，将API接口按照功能模块进行分类组织。每个模块都包含完整的类型定义和API调用函数，方便前端调用和维护。

## 目录结构

```
src/api/
├── README.md              # 使用说明文档
├── index.ts               # 统一导出所有API
├── auth.api.ts            # 认证模块
├── user.api.ts            # 用户管理模块
├── lab.api.ts             # 实验室管理模块
├── appointment.api.ts     # 预约管理模块
├── instrument.api.ts      # 仪器设备模块
├── news.api.ts            # 新闻公告模块
├── evaluation.api.ts      # 评价系统模块
├── favorites.api.ts       # 收藏管理模块
└── notification.api.ts    # 通知消息模块
```

## API 模块说明

### 1. AuthApi - 认证模块
- **功能**：用户登录、注册、获取用户信息、Token刷新、退出登录
- **主要接口**：
  - `loginApi()` - 用户登录
  - `registerApi()` - 用户注册
  - `getCurrentUserApi()` - 获取当前用户信息
  - `refreshTokenApi()` - 刷新Token
  - `logoutApi()` - 退出登录

### 2. UserApi - 用户管理模块
- **功能**：用户列表、用户详情、创建用户、更新用户、删除用户
- **主要接口**：
  - `getUsersApi()` - 获取用户列表（支持分页和筛选）
  - `getUserDetailApi()` - 获取用户详情
  - `createUserApi()` - 创建用户
  - `updateUserApi()` - 更新用户信息
  - `deleteUserApi()` - 删除用户
  - `updateUserStatusApi()` - 更新用户状态
  - `updateUserTagsApi()` - 更新用户教学标签

### 3. LabApi - 实验室管理模块
- **功能**：实验室列表、实验室详情、创建实验室、更新实验室
- **主要接口**：
  - `getLabsApi()` - 获取实验室列表（支持分页和筛选）
  - `getLabDetailApi()` - 获取实验室详情
  - `createLabApi()` - 创建实验室
  - `updateLabApi()` - 更新实验室信息
  - `deleteLabApi()` - 删除实验室

### 4. AppointmentApi - 预约管理模块
- **功能**：预约列表、预约详情、创建预约、审核预约、取消预约
- **主要接口**：
  - `getAppointmentsApi()` - 获取预约列表（支持分页和筛选）
  - `getAppointmentDetailApi()` - 获取预约详情
  - `createAppointmentApi()` - 创建预约
  - `reviewAppointmentApi()` - 审核预约
  - `cancelAppointmentApi()` - 取消预约
  - `completeAppointmentApi()` - 完成预约

### 5. InstrumentApi - 仪器设备模块
- **功能**：仪器管理、仪器申请、仪器维修
- **主要接口**：
  - **仪器管理**：
    - `getInstrumentsApi()` - 获取仪器列表
    - `getInstrumentDetailApi()` - 获取仪器详情
    - `createInstrumentApi()` - 创建仪器
    - `updateInstrumentApi()` - 更新仪器信息
    - `deleteInstrumentApi()` - 删除仪器
  - **仪器申请**：
    - `getInstrumentApplicationsApi()` - 获取申请列表
    - `createInstrumentApplicationApi()` - 创建使用申请
    - `reviewInstrumentApplicationApi()` - 审核申请
  - **仪器维修**：
    - `getInstrumentRepairsApi()` - 获取维修列表
    - `reportInstrumentRepairApi()` - 报告故障
    - `updateRepairStatusApi()` - 更新维修状态

### 6. NewsApi - 新闻公告模块
- **功能**：新闻列表、新闻详情、创建新闻、审核新闻、点赞功能
- **主要接口**：
  - `getNewsApi()` - 获取新闻列表（支持分页和筛选）
  - `getNewsDetailApi()` - 获取新闻详情
  - `createNewsApi()` - 创建新闻
  - `updateNewsApi()` - 更新新闻
  - `deleteNewsApi()` - 删除新闻
  - `reviewNewsApi()` - 审核新闻
  - `likeNewsApi()` - 点赞新闻

### 7. EvaluationApi - 评价系统模块
- **功能**：评价列表、评价详情、创建评价、更新评价、评价统计
- **主要接口**：
  - `getEvaluationsApi()` - 获取评价列表（支持分页和筛选）
  - `getEvaluationDetailApi()` - 获取评价详情
  - `createEvaluationApi()` - 创建评价
  - `updateEvaluationApi()` - 更新评价
  - `deleteEvaluationApi()` - 删除评价
  - `getEvaluationStatsApi()` - 获取评价统计

### 8. FavoritesApi - 收藏管理模块
- **功能**：收藏列表、添加收藏、取消收藏、检查收藏状态
- **主要接口**：
  - `getFavoritesApi()` - 获取收藏列表
  - `addFavoriteApi()` - 添加收藏
  - `removeFavoriteApi()` - 取消收藏
  - `checkFavoriteApi()` - 检查是否收藏

### 9. NotificationApi - 通知消息模块
- **功能**：通知列表、通知详情、标记已读、删除通知
- **主要接口**：
  - `getNotificationsApi()` - 获取通知列表（支持分页和筛选）
  - `getNotificationDetailApi()` - 获取通知详情
  - `createNotificationApi()` - 创建通知
  - `markAsReadApi()` - 标记为已读
  - `markAllAsReadApi()` - 标记所有为已读
  - `deleteNotificationApi()` - 删除通知
  - `clearAllNotificationsApi()` - 清空所有通知

## 使用示例

### 基础用法

```typescript
// 方式1：直接导入API函数
import { loginApi, getCurrentUserApi } from "@/api/auth.api";
import { getUsersApi } from "@/api/user.api";
import { getLabsApi } from "@/api/lab.api";

// 方式2：使用命名空间
import { AuthApi, UserApi, LabApi } from "@/api";

// 登录示例
const handleLogin = async () => {
  try {
    const result = await loginApi({
      username: "student001",
      password: "Password123",
    });
    console.log("登录成功", result);
  } catch (error) {
    console.error("登录失败", error);
  }
};

// 获取用户列表
const getUserList = async () => {
  try {
    const result = await getUsersApi({
      keyword: "张三",
      role: "student",
      page: 1,
      size: 10,
    });
    console.log("用户列表", result);
  } catch (error) {
    console.error("获取失败", error);
  }
};

// 获取实验室列表
const getLabList = async () => {
  try {
    const result = await getLabsApi({
      status: "active",
      department: "计算机学院",
      page: 1,
      size: 20,
    });
    console.log("实验室列表", result);
  } catch (error) {
    console.error("获取失败", error);
  }
};
```

### 分页查询示例

```typescript
// 带分页的用户查询
const fetchUsers = async (page: number = 1, size: number = 10) => {
  const result = await getUsersApi({
    page,
    size,
    role: "student", // 筛选条件
  });
  return result;
};
```

### 高级筛选示例

```typescript
// 预约查询
const fetchAppointments = async (params: {
  status?: AppointmentStatus;
  labId?: number;
  timeSlot?: TimeSlot;
  startDate?: string;
  endDate?: string;
}) => {
  const result = await getAppointmentsApi({
    page: 1,
    size: 20,
    ...params,
  });
  return result;
};
```

### 创建数据示例

```typescript
// 创建预约
const createAppointment = async () => {
  const result = await createAppointmentApi({
    labId: 1,
    appointmentDate: "2024-01-15T00:00:00.000Z",
    timeSlot: TimeSlot.MORNING,
    purpose: "数据结构实验课",
    description: "需要使用实验室进行二叉树遍历实验，预计50人参与",
    participantCount: 50,
  });
  return result;
};

// 创建评价
const createEvaluation = async () => {
  const result = await createEvaluationApi({
    labId: 1,
    overallRating: 5,
    equipmentRating: 4,
    environmentRating: 5,
    serviceRating: 4,
    comment: "实验室环境很好，设备齐全，老师很负责",
  });
  return result;
};
```

### 更新数据示例

```typescript
// 更新用户信息
const updateUser = async (id: number) => {
  const result = await updateUserApi(id, {
    nickname: "新昵称",
    email: "newemail@example.com",
    teachingTags: ["Java", "Python", "数据结构"],
  });
  return result;
};

// 审核预约
const reviewAppointment = async (id: number, status: AppointmentStatus) => {
  const result = await reviewAppointmentApi(id, {
    status,
    rejectionReason: status === AppointmentStatus.REJECTED ? "实验室正在维护中" : undefined,
  });
  return result;
};
```

## 类型定义说明

每个API模块都包含以下类型的定义：

1. **Params类型**：用于查询参数，如`GetUsersParams`
2. **Item类型**：用于列表项数据，如`UserListItem`
3. **Detail类型**：用于详情数据，如`UserDetail`
4. **CreateParams类型**：用于创建数据，如`CreateUserParams`
5. **UpdateParams类型**：用于更新数据（如适用）

## 响应数据格式

所有API的响应数据都采用统一的格式：

```typescript
{
  success: boolean;     // 操作是否成功
  message: string;      // 响应消息
  data: any;            // 数据
  timestamp: string;    // 时间戳
}
```

分页查询的响应格式：

```typescript
{
  data: Array<T>;       // 数据列表
  total: number;        // 总数
  page: number;         // 当前页
  size: number;         // 每页大小
}
```

## 注意事项

1. **认证**：所有私有接口都需要在请求头中携带JWT Token
2. **权限**：不同角色用户访问的API接口可能不同
3. **分页**：列表查询接口都支持`page`和`size`参数
4. **枚举**：所有枚举类型都使用数字值，具体值请参考枚举定义
5. **错误处理**：请使用try-catch捕获异常，并进行适当的错误处理

## 枚举参考

### 角色 (Role)
- `STUDENT = 0` - 学生
- `TEACHER = 1` - 教师
- `ADMIN = 2` - 管理员
- `SUPER_ADMIN = 3` - 超级管理员

### 状态相关
- **用户状态 (Status)**: `ACTIVE`, `INACTIVE`, `BANNED`
- **实验室状态 (LabStatus)**: `ACTIVE`, `MAINTENANCE`, `INACTIVE`
- **仪器状态 (InstrumentStatus)**: `ACTIVE`, `INACTIVE`, `MAINTENANCE`, `FAULT`
- **预约状态 (AppointmentStatus)**: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`, `COMPLETED`
- **申请状态 (ApplicationStatus)**: `PENDING`, `APPROVED`, `REJECTED`
- **维修状态 (RepairStatus)**: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- **新闻状态 (NewsStatus)**: `PENDING`, `APPROVED`, `REJECTED`
- **时间段 (TimeSlot)**: `MORNING`, `AFTERNOON`, `EVENING`
- **故障类型 (FaultType)**: `HARDWARE`, `SOFTWARE`, `OPERATION_ERROR`, `OTHER`
- **紧急程度 (UrgencyLevel)**: `LOW`, `MEDIUM`, `HIGH`, `URGENT`

---

**文档版本**: v1.0
**创建日期**: 2024-11-08
