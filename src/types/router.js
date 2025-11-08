import "vue-router";
import type { Component } from "vue";
import type { Router, RouteRecordRaw } from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    /**
     * 路由标题
     */
    title?: string;
    /**
     * 路由图标
     */
    icon?: string;
    /**
     * 是否显示返回按钮
     * @default true
     */
    showBack?: boolean;
    /**
     * 是否为tab 导航
     */
    isTab?: boolean;
    /**
     * 是否显示底部标签栏
     * @default true
     */
    showBottomTab?: boolean;
    /**
     * 该路由是否需要认证（登录）
     */
    requiresAuth?: boolean;
    /**
     * 允许访问该路由的角色权限
     */
    authority?: string[];
    /**
     * 忽略权限
     */
    ignoreAccess?: boolean;
  }

  // 扩展 RouteRecordRaw 类型以支持你的自定义结构
  interface RouteRecordBase {
    /** 路由组件 */
    component?: Component;

    /** 路由元信息 */
    meta?: RouteMeta;
  }
}

// 导出你的原始接口（可选，用于其他地方使用）
export interface RouteMeta {
  /**
   * 路由标题
   */
  title?: string;
  /**
   * 路由图标
   */
  icon?: string;
  /**
   * 是否显示返回按钮
   * @default true
   */
  showBack?: boolean;
  /**
   * 是否显示底部标签栏
   * @default true
   */
  showBottomTab?: boolean;
  /**
   * 该路由是否需要认证（登录）
   */
  requiresAuth?: boolean;
  /**
   * 允许访问该路由的角色权限
   */
  authority?: string[];
}

export interface RawRouteComponent {
  component?: Component;
  /** 路由名称 */
  name?: string;
  /** 路由路径 */
  path?: string;
  /** 路由元信息 */
  meta?: RouteMeta;
  /** 子路由 */
  children?: RawRouteComponent[];
}

/**
 * 菜单原始对象
 */
export interface MenuRecordRaw {
  /**
   * 激活时的图标名
   */
  activeIcon?: string;
  /**
   * 子菜单
   */
  children?: MenuRecordRaw[];
  /**
   * 是否禁用菜单
   * @default false
   */
  disabled?: boolean;
  /**
   * 图标名
   */
  icon?: Component | string;
  /**
   * 菜单名
   */
  name: string;
  /**
   * 排序号
   */
  order?: number;
  /**
   * 父级路径
   */
  parent?: string;
  /**
   * 所有父级路径
   */
  parents?: string[];
  /**
   * 菜单路径，唯一，可当作key
   */
  path: string;
  /**
   * 是否显示菜单
   * @default true
   */
  show?: boolean;
}

// 定义递归类型以将 RouteRecordRaw 的 component 属性更改为 string

export type RouteRecordStringComponent<T = string> = Omit<
  RouteRecordRaw,
  "children" | "component"
> & {
  children?: RouteRecordStringComponent<T>[];
  component: T;
};

export type ComponentRecordType = Record<string, () => Promise<Component>>;

export interface GenerateMenuAndRoutesOptions {
  fetchMenuListAsync?: () => Promise<RouteRecordStringComponent[]>;
  forbiddenComponent?: RouteRecordRaw["component"];
  layoutMap?: ComponentRecordType;
  pageMap?: ComponentRecordType;
  roles?: string[];
  router: Router;
  routes: RouteRecordRaw[];
}

/**
 * 扩展路由原始对象
 */
export type ExRouteRecordRaw = RouteRecordRaw & {
  parent?: string;
  parents?: string[];
  path?: any;
};
