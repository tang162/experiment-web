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

  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const context = this;
    timeoutId = setTimeout(() => {
      func.apply(context, args);
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

  return function (...args) {
    const now = Date.now();
    const context = this;

    if (now - lastRun >= delay) {
      func.apply(context, args);
      lastRun = now;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(
        () => {
          func.apply(context, args);
          lastRun = Date.now();
          timeoutId = null;
        },
        delay - (now - lastRun),
      );
    }
  };
}
/*** 复制方法 */
export function copyText(text) {
  return new Promise((resolve, reject) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(() => resolve())
          .catch((err) => reject(err));
      } else {
        const input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        const success = document.execCommand("copy");
        document.body.removeChild(input);
        if (success) {
          resolve();
        } else {
          reject(new Error("复制失败"));
        }
      }
    } catch (err) {
      reject(err);
    }
  });
}
