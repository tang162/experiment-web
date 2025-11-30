/**
 * 用户角色常量
 */
export const USER_ROLES = {
  /** 学生 */
  STUDENT: 'STUDENT',
  /** 教师 */
  TEACHER: 'TEACHER',
};

/**
 * 权限级别
 */
export const PERMISSION_LEVELS = {
  /** 公开访问 */
  PUBLIC: 'PUBLIC',
  /** 需要登录 */
  AUTHENTICATED: 'AUTHENTICATED',
  /** 教师权限 */
  TEACHER: 'TEACHER',
};

/**
 * 检查用户是否有权限
 * @param {string} userRole 用户角色
 * @param {string} requiredPermission 需要的权限
 * @returns {boolean}
 */
export function hasPermission(userRole, requiredPermission) {
  // 公开权限，所有人都可以访问
  if (requiredPermission === PERMISSION_LEVELS.PUBLIC) {
    return true;
  }

  // 需要登录，学生和教师都可以访问
  if (requiredPermission === PERMISSION_LEVELS.AUTHENTICATED) {
    return userRole === USER_ROLES.STUDENT || userRole === USER_ROLES.TEACHER;
  }

  // 教师权限，只有教师可以访问
  if (requiredPermission === PERMISSION_LEVELS.TEACHER) {
    return userRole === USER_ROLES.TEACHER;
  }

  return false;
}

/**
 * 检查用户是否是教师
 * @param {string} userRole 用户角色
 * @returns {boolean}
 */
export function isTeacher(userRole) {
  return userRole === USER_ROLES.TEACHER;
}

/**
 * 检查用户是否是学生
 * @param {string} userRole 用户角色
 * @returns {boolean}
 */
export function isStudent(userRole) {
  return userRole === USER_ROLES.STUDENT;
}
