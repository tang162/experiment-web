/**
 * 图片工具函数
 */

// 生成默认骨架图片 (SVG base64)
export function generateSkeletonImage(
  width = 300,
  height = 200,
  text = "Loading..."
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skeleton-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f0f0f0"/>
          <stop offset="50%" stop-color="#e0e0e0"/>
          <stop offset="100%" stop-color="#f0f0f0"/>
        </linearGradient>
        <animate id="skeleton-animation" attributeName="x1" values="-100%;100%" dur="1.5s" repeatCount="indefinite"/>
      </defs>
      <rect width="100%" height="100%" fill="url(#skeleton-gradient)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#999999" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// 生成错误图片 (SVG base64)
export function generateErrorImage(
  width = 300,
  height = 200,
  text = "Load Failed"
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f5f5f5"/>
      <circle cx="${width / 2}" cy="${
    height / 2
  }" r="30" fill="none" stroke="#f56565" stroke-width="3"/>
      <path d="M${width / 2 - 15} ${height / 2 - 15}L${width / 2 + 15} ${
    height / 2 + 15
  }M${width / 2 + 15} ${height / 2 - 15}L${width / 2 - 15} ${
    height / 2 + 15
  }" stroke="#f56565" stroke-width="3" stroke-linecap="round"/>
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="14" fill="#f56565" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// 预加载图片
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// 检查图片是否可访问
export async function checkImageAccessibility(src: string): Promise<boolean> {
  try {
    await preloadImage(src);
    return true;
  } catch {
    return false;
  }
}

// 获取图片尺寸
export function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
}

// 压缩图片质量 (通过添加质量参数，适用于支持的图片服务)
export function compressImageUrl(src: string, quality = 80): string {
  try {
    const url = new URL(src);

    // 检查是否是常见的图片服务
    if (url.hostname.includes("picsum.photos")) {
      // Picsum 不支持质量参数，返回原URL
      return src;
    }

    // 为其他服务添加质量参数
    url.searchParams.set("quality", quality.toString());
    return url.toString();
  } catch {
    // 如果URL无效，返回原字符串
    return src;
  }
}

// 生成响应式图片URL (根据设备像素比)
export function getResponsiveImageUrl(src: string, baseWidth: number): string {
  const pixelRatio = window.devicePixelRatio || 1;
  const targetWidth = Math.round(baseWidth * pixelRatio);

  try {
    const url = new URL(src);

    // 对于 Picsum Photos
    if (url.hostname.includes("picsum.photos")) {
      const pathParts = url.pathname.split("/");
      if (pathParts.length >= 3) {
        pathParts[1] = targetWidth.toString(); // 宽度
        url.pathname = pathParts.join("/");
      }
    }

    return url.toString();
  } catch {
    return src;
  }
}

// 图片格式检测
export function getImageFormat(src: string): string {
  const extension = src.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/jpeg"; // 默认格式
  }
}

// 检查浏览器是否支持 WebP
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  });
}

// 检查浏览器是否支持 AVIF
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src =
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=";
  });
}

// 获取最佳图片格式
export async function getBestImageFormat(): Promise<"avif" | "webp" | "jpeg"> {
  if (await supportsAVIF()) {
    return "avif";
  } else if (await supportsWebP()) {
    return "webp";
  } else {
    return "jpeg";
  }
}

// 图片URL转换为最佳格式 (适用于支持的图片服务)
export async function convertToOptimalFormat(src: string): Promise<string> {
  // const bestFormat = await getBestImageFormat()

  try {
    // const url = new URL(src)

    // 这里可以根据不同的图片服务添加格式转换逻辑
    // 例如，某些CDN服务支持通过URL参数指定格式

    return src; // 暂时返回原URL，实际使用时可根据具体服务调整
  } catch {
    return src;
  }
}

// 创建图片加载性能监控
export function createImageLoadMonitor() {
  const loadTimes = new Map<string, number>();
  const startTimes = new Map<string, number>();

  return {
    start(src: string) {
      startTimes.set(src, performance.now());
    },

    end(src: string) {
      const startTime = startTimes.get(src);
      if (startTime) {
        const loadTime = performance.now() - startTime;
        loadTimes.set(src, loadTime);
        startTimes.delete(src);
        return loadTime;
      }
      return 0;
    },

    getLoadTime(src: string) {
      return loadTimes.get(src) || 0;
    },

    getAverageLoadTime() {
      const times = Array.from(loadTimes.values());
      return times.length > 0
        ? times.reduce((a, b) => a + b, 0) / times.length
        : 0;
    },

    clear() {
      loadTimes.clear();
      startTimes.clear();
    },
  };
}

// 全局图片加载监控实例
export const imageLoadMonitor = createImageLoadMonitor();
