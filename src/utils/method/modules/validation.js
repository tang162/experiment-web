/** 邮箱验证正则 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** 手机号验证正则 */
export const PHONE_REGEX = /^1[3-9]\d{9}$/;

/** URL验证正则 */
export const URL_REGEX =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
