/*** 复制方法 */
export function copyText(text: string): Promise<void> {
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

export * from "./modules/debounce";
export * from "./modules/fromData";
export * from "./modules/validation";
