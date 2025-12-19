/**
 * Format số thành tiền VND
 * @param {number} amount - Số tiền
 * @returns {string} Chuỗi tiền đã format
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Format số thành số có dấu phẩy
 * @param {number} num - Số
 * @returns {string} Số đã format
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

/**
 * Format ngày tháng
 * @param {Date|string} date - Ngày
 * @param {Object} options - Tùy chọn format
 * @returns {string} Ngày đã format
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };
  return new Date(date).toLocaleDateString("vi-VN", defaultOptions);
};

/**
 * Format ngày giờ
 * @param {Date|string} date - Ngày
 * @returns {string} Ngày giờ đã format
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format relative time (vd: 2 giờ trước)
 * @param {Date|string} date - Ngày
 * @returns {string} Thời gian relative
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(date);
};
