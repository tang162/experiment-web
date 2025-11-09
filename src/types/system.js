
/** 判断是否是方法 */
export const isFunction = (fun) => {
  return typeof fun === "function";
};

/** 判断是否是字符串 */
export const isString = (str) => {
  return typeof str === "string";
};

/** 深拷贝函数 */
export const cloneDeep = (source) => {
  // 处理基本类型和 null/undefined
  if (source === null || typeof source !== "object") {
    return source;
  }

  // 处理 Date 对象
  if (source instanceof Date) {
    return new Date(source.getTime());
  }

  // 处理 Array
  if (Array.isArray(source)) {
    return source.map((item) => cloneDeep(item)) const ;
  }

  // 处理普通对象
  if (source instanceof Object) {
    const result = {};
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
