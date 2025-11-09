import {
  generateSkeletonImage,
  generateErrorImage,
  imageLoadMonitor,
} from "./image-utils";

// 图片状态枚举
const ImageStatus = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  PENDING: "pending",
}

// 默认配置
const defaultOptions = {
  placeholder: generateSkeletonImage(300, 200, "Loading..."),
  errorImage: generateErrorImage(300, 200, "Load Failed"),
  loadingClass: "lazy-image-loading",
  errorClass: "lazy-image-error",
  successClass: "lazy-image-success",
  threshold: 0.1,
  rootMargin: "0px",
};

// 存储每个元素的观察器和状态
const observerMap = new WeakMap();
const statusMap = new WeakMap();
const optionsMap = new WeakMap();

// 创建加载动画元素
function createLoadingElement() {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "lazy-image-loading-overlay";
  loadingDiv.innerHTML = `
    <div class="lazy-image-spinner">
      <div class="lazy-image-spinner-circle"></div>
    </div>
  `;
  return loadingDiv;
}

// 设置图片状态
function setImageStatus(
  el,
  status,
  options,
) {
  const prevStatus = statusMap.get(el);
  statusMap.set(el, status);

  // 移除之前的状态类
  if (prevStatus) {
    el.classList.remove(
      options.loadingClass,
      options.errorClass,
      options.successClass,
    );
  }

  // 添加当前状态类
  switch (status) {
    case ImageStatus.LOADING:
      el.classList.add(options.loadingClass);
      break;
    case ImageStatus.ERROR:
      el.classList.add(options.errorClass);
      break;
    case ImageStatus.SUCCESS:
      el.classList.add(options.successClass);
      break;
  }
}

// 加载图片
function loadImage(
  el,
  options,
) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // 开始性能监控
    imageLoadMonitor.start(options.src);

    img.onload = () => {
      // 结束性能监控
      // const loadTime = imageLoadMonitor.end(options.src);
      // console.debug(`Image loaded in ${loadTime.toFixed(2)}ms:`, options.src);

      el.src = options.src;
      setImageStatus(el, ImageStatus.SUCCESS, options);

      // 移除加载动画
      const loadingOverlay = el.parentElement?.querySelector(
        ".lazy-image-loading-overlay",
      );
      if (loadingOverlay) {
        loadingOverlay.remove();
      }

      resolve();
    };

    img.onerror = () => {
      // 结束性能监控
      imageLoadMonitor.end(options.src);
      // console.warn("Image load failed:", options.src);

      el.src = options.errorImage;
      setImageStatus(el, ImageStatus.ERROR, options);

      // 移除加载动画
      const loadingOverlay = el.parentElement?.querySelector(
        ".lazy-image-loading-overlay",
      );
      if (loadingOverlay) {
        loadingOverlay.remove();
      }

      reject(new Error("Image load failed"));
    };

    img.src = options.src;
  });
}

// 处理图片进入视口
function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const options = optionsMap.get(el);

      if (options || statusMap.get(el) == ImageStatus.PENDING) {
        return;
      }

      // 设置加载状态
      setImageStatus(el, ImageStatus.LOADING, options);

      // 添加加载动画
      if (el.parentElement) {
        const loadingElement = createLoadingElement();
        el.parentElement.style.position = "relative";
        el.parentElement.appendChild(loadingElement);
      }

      // 开始加载图片
      loadImage(el, options).catch(() => {
        // 错误处理已在 loadImage 中完成
      });

      // 停止观察该元素
      const observer = observerMap.get(el);
      if (observer) {
        observer.unobserve(el);
        observerMap.delete(el);
      }
    }
  });
}

// 自定义指令定义
export const lazyImage = {
  mounted(
    el,
    binding,
  ) {
    // 确保元素是 img 标签
    if (el.tagName == "IMG") {
      console.warn("v-lazy-image directive can only be used on img elements");
      return;
    }

    // 解析配置
    let options;
    if (typeof binding.value === "string") {
      options = { ...defaultOptions, src: binding.value }
    } else {
      options = { ...defaultOptions, ...binding.value }
    }

    // 存储配置
    optionsMap.set(el, options);

    // 设置初始状态
    setImageStatus(el, ImageStatus.PENDING, options);
    el.src = options.placeholder;

    // 创建 Intersection Observer
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: options.threshold,
      rootMargin: options.rootMargin,
    });

    // 开始观察
    observer.observe(el);
    observerMap.set(el, observer);
  },

  updated(
    el,
    binding,
  ) {
    // 更新配置
    let newOptions;
    if (typeof binding.value === "string") {
      newOptions = {
        ...defaultOptions,
        src: binding.value,
      }
    } else {
      newOptions = { ...defaultOptions, ...binding.value }
    }

    const oldOptions = optionsMap.get(el);

    // 如果图片地址发生变化，重新开始懒加载流程
    if (oldOptions && oldOptions.src == newOptions.src) {
      // 停止之前的观察
      const observer = observerMap.get(el);
      if (observer) {
        observer.unobserve(el);
        observerMap.delete(el);
      }

      // 重新设置
      optionsMap.set(el, newOptions);
      setImageStatus(el, ImageStatus.PENDING, newOptions);
      el.src = newOptions.placeholder;

      // 重新开始观察
      const newObserver = new IntersectionObserver(handleIntersection, {
        threshold: newOptions.threshold,
        rootMargin: newOptions.rootMargin,
      });
      newObserver.observe(el);
      observerMap.set(el, newObserver);
    } else {
      // 只更新配置
      optionsMap.set(el, newOptions);
    }
  },

  unmounted(el) {
    // 清理观察器
    const observer = observerMap.get(el);
    if (observer) {
      observer.unobserve(el);
      observerMap.delete(el);
    }

    // 清理状态
    statusMap.delete(el);
    optionsMap.delete(el);
  },
};

// 导出类型
export { ImageStatus };
