import dayjs from "dayjs";

type RangeType = "week" | "month" | "quarter" | "halfYear" | "year";

// 薪资显示格式化
export const formatSalary = (minSalary, maxSalary) => {
  return `${minSalary}K-${maxSalary}K`;
};

export function getRangeByType(type: RangeType) {
  const end = dayjs();
  let start = end;

  switch (type) {
    case "week":
      start = end.subtract(7, "day");
      break;
    case "month":
      start = end.subtract(1, "month");
      break;
    case "quarter":
      start = end.subtract(3, "month");
      break;
    case "halfYear":
      start = end.subtract(6, "month");
      break;
    case "year":
      start = end.subtract(1, "year");
      break;
  }

  return {
    start: start.format("YYYY-MM-DD HH:mm:ss"),
    end: end.format("YYYY-MM-DD HH:mm:ss"),
  };
}

/**
 * 将UTC时间转换为本地时间
 * @param date UTC时间字符串
 * @returns 本地时间字符串
 */
export function convertToLocaleTime(date) {
  return new Date(date).toLocaleString();
}

/**将UTC时间转换 距现在多久 */
export function convertToRelativeTime(timestamp) {
  if (typeof timestamp === "string" && !timestamp.includes("T")) {
    return timestamp;
  }

  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

/**
 *
 * @param timestamp
 * @returns
 */

export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
