/** 角色权限 */
export type Roles = "job_seeker" | "recruiter";

/** 判断是否是方法 */
export const isFunction = (fun: any): fun is (...args: any[]) => any => {
  return typeof fun === "function";
};

/** 判断是否是字符串 */
export const isString = (str: any): str is string => {
  return typeof str === "string";
};

/** 深拷贝函数 */
export const cloneDeep = <T>(source: T): T => {
  // 处理基本类型和 null/undefined
  if (source === null || typeof source !== "object") {
    return source;
  }

  // 处理 Date 对象
  if (source instanceof Date) {
    return new Date(source.getTime()) as unknown as T;
  }

  // 处理 Array
  if (Array.isArray(source)) {
    return source.map((item) => cloneDeep(item)) as unknown as T;
  }

  // 处理普通对象
  if (source instanceof Object) {
    const result: any = {};
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        result[key] = cloneDeep(source[key]);
      }
    }
    return result;
  }

  // 其他类型直接返回
  return source;
};
