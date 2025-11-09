/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce(
  func,
  delay,
) {
  let timeoutId = null;

  return function (this, ...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle(
  func,
  delay,
) {
  let lastRun = 0;
  let timeoutId = null;

  return function (this, ...args) {
    const now = Date.now();

    if (now - lastRun >= delay) {
      func.apply(this, args);
      lastRun = now;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(
        () => {
          func.apply(this, args);
          lastRun = Date.now();
          timeoutId = null;
        },
        delay - (now - lastRun),
      );
    }
  };
}
